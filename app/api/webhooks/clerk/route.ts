import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";

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
  };
};

type ClerkWebhookEvent = UserCreatedEvent | { type: string };

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
    const { id: clerkUserId, email_addresses, primary_email_address_id } =
      (event as UserCreatedEvent).data;

    const primaryEmail = email_addresses.find(
      (e) => e.id === primary_email_address_id
    );
    const email = primaryEmail?.email_address;

    if (!email) {
      console.error("No primary email found for user", clerkUserId);
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("registrations").upsert(
      { clerk_user_id: clerkUserId, email },
      { onConflict: "clerk_user_id" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    await captureEvent(clerkUserId, "user_registered", {
      $insert_id: `registration_${clerkUserId}`,
    });

    const hashedEmail = createHash("sha256")
      .update(email.toLowerCase().trim())
      .digest("hex");

    await sendMetaEvent({
      event_name: "Lead",
      event_source_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets`,
      event_id: `registration_${clerkUserId}`,
      user_data: { em: hashedEmail },
    });
  }

  return NextResponse.json({ received: true });
}
