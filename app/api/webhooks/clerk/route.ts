import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";
import { notifyAdminNewRegistration, sendWelcomeEmail } from "@/lib/email";
import { sendMetaEvent } from "@/lib/meta-capi";
import {
  metaLeadEventSourceUrl,
  parseWorkshopSlugFromInterestedProduct,
} from "@/lib/meta-event-source-url";
import { getWorkshopWelcomeSnapshot } from "@/lib/workshops";
import { deriveAttribution, type TrackingParams } from "@/lib/tracking-params";

type EmailAddress = {
  email_address: string;
  id: string;
};

type UserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: EmailAddress[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    unsafe_metadata?: Record<string, unknown>;
  };
};

type ClerkWebhookEvent = UserCreatedEvent | { type: string };

function trackingFromUnsafeMetadata(
  meta: Record<string, unknown> | undefined
): TrackingParams {
  if (!meta) return {};
  const out: TrackingParams = {};
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "ref",
  ] as const;
  for (const k of keys) {
    const v = meta[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Clerk webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "user.created") {
    const {
      id: clerkUserId,
      email_addresses,
      primary_email_address_id,
      first_name,
      last_name,
      unsafe_metadata,
    } = (event as UserCreatedEvent).data;

    const primaryEmail = email_addresses.find(
      (e) => e.id === primary_email_address_id
    );
    const email = primaryEmail?.email_address;

    if (!email) {
      console.error("No primary email found for user", clerkUserId);
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const interestedInProduct =
      typeof unsafe_metadata?.interested_in_product === "string"
        ? unsafe_metadata.interested_in_product
        : null;

    const signupIntentRaw = unsafe_metadata?.signup_intent;
    const signup_intent =
      typeof signupIntentRaw === "string" && signupIntentRaw.trim()
        ? signupIntentRaw.trim().slice(0, 500)
        : null;

    const tracking = trackingFromUnsafeMetadata(unsafe_metadata);
    const { source_type, source_detail } = deriveAttribution(tracking);

    const supabase = createServiceClient();

    const registrationRow: Record<string, unknown> = {
      clerk_user_id: clerkUserId,
      email,
      utm_source: tracking.utm_source ?? null,
      utm_medium: tracking.utm_medium ?? null,
      utm_campaign: tracking.utm_campaign ?? null,
      utm_content: tracking.utm_content ?? null,
      utm_term: tracking.utm_term ?? null,
      ref: tracking.ref ?? null,
      source_type,
      source_detail,
      signup_intent,
    };
    if (interestedInProduct) registrationRow.interested_in_product = interestedInProduct;

    const { error } = await supabase.from("registrations").upsert(
      registrationRow,
      { onConflict: "clerk_user_id" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Promote to publicMetadata so it's readable server-side without unsafe risk
    if (interestedInProduct) {
      try {
        const clerk = await clerkClient();
        await clerk.users.updateUser(clerkUserId, {
          publicMetadata: { interested_in_product: interestedInProduct },
        });
      } catch (clerkErr) {
        console.error("Failed to set Clerk publicMetadata:", clerkErr);
      }
    }

    await captureEvent(clerkUserId, "user_registered", {
      $insert_id: `registration_${clerkUserId}`,
    });

    const hashedEmail = createHash("sha256")
      .update(email.toLowerCase().trim())
      .digest("hex");

    await sendMetaEvent({
      event_name: "Lead",
      event_source_url: metaLeadEventSourceUrl(
        process.env.NEXT_PUBLIC_APP_URL,
        interestedInProduct
      ),
      event_id: `registration_${clerkUserId}`,
      user_data: { em: hashedEmail },
    });

    const fullName = [first_name, last_name].filter(Boolean).join(" ") || email;

    const workshopSlug = parseWorkshopSlugFromInterestedProduct(interestedInProduct);
    if (workshopSlug) {
      const workshop = getWorkshopWelcomeSnapshot(workshopSlug);
      try {
        await sendWelcomeEmail({
          toEmail: email,
          toName: fullName,
          workshop: {
            slug: workshop.slug,
            title: workshop.title,
            displayDate: workshop.displayDate,
            displayTime: workshop.displayTime,
          },
        });
      } catch (welcomeErr) {
        console.error("Failed to send welcome email:", welcomeErr);
      }
    }

    try {
      await notifyAdminNewRegistration({ clerkUserId, email });
    } catch (notifyErr) {
      console.error("Failed to send admin registration notification:", notifyErr);
    }
  }

  return NextResponse.json({ received: true });
}
