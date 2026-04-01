import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe, MENTORING_PRICE_IDS, MentoringTier } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";

const INVOICE_DESCRIPTIONS: Record<MentoringTier, string> = {
  group:
    "AI with Michal — Group Mentoring (monthly): weekly implementation calls, dedicated private group, monthly 1-on-1 call with Michal.",
  vip:
    "AI with Michal — VIP Mentoring (monthly): weekly implementation calls, dedicated private group, two 1-on-1 calls with Michal, two 1-on-1 calls with a mentor.",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;
  const customerName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const body = await req.json();
  const tier = body.tier as MentoringTier;
  const cancelUrl = body.cancelUrl as string | undefined;

  if (!tier || !MENTORING_PRICE_IDS[tier]) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin =
    req.headers.get("origin") ??
    (req.headers.get("host")
      ? `https://${req.headers.get("host")}`
      : null) ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://aiwithmichal.com";
  const appUrl = origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    currency: "eur",
    line_items: [
      {
        price: MENTORING_PRICE_IDS[tier],
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    client_reference_id: userId,
    metadata: {
      clerk_user_id: userId,
      tier,
      product: "mentoring",
      customer_name: customerName,
    },
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
        tier,
        product: "mentoring",
      },
      description: INVOICE_DESCRIPTIONS[tier],
    },
    success_url: `${appUrl}/ai-mentoring/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}${cancelUrl || "/ai-mentoring/join"}`,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    custom_fields: [
      {
        key: "company_name",
        label: {
          type: "custom",
          custom: "Company name (optional, for invoice)",
        },
        type: "text",
        optional: true,
      },
    ],
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
  });

  const ref = req.cookies.get("ref")?.value;

  await captureEvent(userId, "mentoring_checkout_session_created", {
    tier,
    stripe_session_id: session.id,
    email: customerEmail,
    ...(ref ? { ref } : {}),
  });

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  sendMetaEvent({
    event_name: "InitiateCheckout",
    event_source_url: `${appUrl}/ai-mentoring/join`,
    user_data: {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: clientIp,
    },
  });

  return NextResponse.json({ url: session.url });
}
