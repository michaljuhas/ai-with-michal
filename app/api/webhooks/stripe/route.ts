import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";
import {
  notifyAdminPaymentCompleted,
  sendWorkshopConfirmation,
  sendCourseConfirmation,
} from "@/lib/email";
import { getCourseBySlug } from "@/lib/courses";
import { sendMetaEvent } from "@/lib/meta-capi";
import { normalizeBillingCountryCode } from "@/lib/billing-country";
import { orderAmountsFromCheckoutSession } from "@/lib/stripe-order-amounts";
import { metaPurchaseEventSourceUrl } from "@/lib/meta-event-source-url";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerk_user_id;
    const tier = session.metadata?.tier as "basic" | "pro" | undefined;
    const product = session.metadata?.product; // "course" | undefined (workshop = undefined)
    const workshopSlug = session.metadata?.workshop_slug;
    const courseSlug = session.metadata?.course_slug;

    if (!clerkUserId || !tier) {
      console.error("Missing metadata in checkout session", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const billingCountryCode = normalizeBillingCountryCode(
      session.customer_details?.address?.country
    );

    const { amount_eur, amount_net_eur } = orderAmountsFromCheckoutSession(session);

    const { error } = await supabase.from("orders").upsert(
      {
        clerk_user_id: clerkUserId,
        stripe_session_id: session.id,
        price_id: session.metadata?.price_id ?? "",
        tier,
        amount_eur,
        amount_net_eur,
        status: "paid",
        ...(workshopSlug ? { workshop_slug: workshopSlug } : {}),
        ...(courseSlug ? { course_slug: courseSlug } : {}),
        ...(billingCountryCode ? { billing_country_code: billingCountryCode } : {}),
      },
      { onConflict: "stripe_session_id" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const amountEur = amount_eur;

    const eventName = product === "course" ? "course_purchased" : "payment_completed";
    await captureEvent(clerkUserId, eventName, {
      $insert_id: `purchase_${session.id}`,
      tier,
      stripe_session_id: session.id,
      amount_eur: amountEur,
      customer_email: session.customer_email,
      ...(courseSlug ? { course_slug: courseSlug } : {}),
      ...(workshopSlug ? { workshop_slug: workshopSlug } : {}),
    });

    try {
      await notifyAdminPaymentCompleted({
        clerkUserId,
        tier,
        amountEur,
        stripeSessionId: session.id,
        customerEmail:
          session.customer_details?.email ?? session.customer_email ?? undefined,
      });
    } catch (notifyErr) {
      console.error("Failed to send admin payment notification:", notifyErr);
    }

    const customerEmail =
      session.customer_details?.email ?? session.customer_email ?? "";
    if (customerEmail) {
      const hashedEmail = createHash("sha256")
        .update(customerEmail.toLowerCase().trim())
        .digest("hex");

      await sendMetaEvent({
        event_name: "Purchase",
        event_source_url: metaPurchaseEventSourceUrl(
          process.env.NEXT_PUBLIC_APP_URL,
          workshopSlug
        ),
        event_id: `purchase_${session.id}`,
        user_data: { em: hashedEmail },
        custom_data: {
          value: amountEur,
          currency: (session.currency ?? "eur").toUpperCase(),
          content_name:
            product === "course"
              ? tier === "pro"
                ? "Course + Interview Prep"
                : "Course Training"
              : tier === "pro"
                ? "Workshop + Toolkit"
                : "Workshop Ticket",
          content_category: product === "course" ? "course" : "workshop",
        },
      });
    }

    const toEmail =
      session.customer_details?.email ?? session.customer_email ?? "";
    const toName =
      session.customer_details?.name ??
      session.metadata?.customer_name ??
      "";

    if (toEmail) {
      try {
        if (product === "course" && courseSlug) {
          const course = getCourseBySlug(courseSlug);
          if (course) {
            await sendCourseConfirmation({
              toEmail,
              toName,
              courseTitle: course.title,
              tier,
              schedulingUrl: course.schedulingUrl ?? "",
            });
          }
        } else {
          await sendWorkshopConfirmation({ toEmail, toName, tier });
        }
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }

  }

  return NextResponse.json({ received: true });
}
