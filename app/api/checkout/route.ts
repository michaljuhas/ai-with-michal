import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe, PRICE_IDS, PriceTier } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;
  const customerName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const body = await req.json();
  const tier = body.tier as PriceTier;

  if (!tier || !PRICE_IDS[tier]) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = req.headers.get("origin") ??
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://aiwithmichal.com";
  const appUrl = origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "eur",
    line_items: [
      {
        price: PRICE_IDS[tier],
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    client_reference_id: userId,
    metadata: {
      clerk_user_id: userId,
      tier,
      customer_name: customerName,
    },
    success_url: `${appUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/tickets`,
    allow_promotion_codes: true,
  });

  await captureEvent(userId, "checkout_session_created", {
    tier,
    stripe_session_id: session.id,
    email: customerEmail,
  });

  return NextResponse.json({ url: session.url });
}
