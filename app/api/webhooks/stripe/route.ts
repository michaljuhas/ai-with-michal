import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";

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

    if (!clerkUserId || !tier) {
      console.error("Missing metadata in checkout session", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("orders").upsert(
      {
        clerk_user_id: clerkUserId,
        stripe_session_id: session.id,
        price_id: session.line_items?.data[0]?.price?.id ?? "",
        tier,
        amount_eur: Math.round((session.amount_total ?? 0) / 100),
        status: "paid",
      },
      { onConflict: "stripe_session_id" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    await captureEvent(clerkUserId, "payment_completed", {
      tier,
      stripe_session_id: session.id,
      amount_eur: Math.round((session.amount_total ?? 0) / 100),
      customer_email: session.customer_email,
    });
  }

  return NextResponse.json({ received: true });
}
