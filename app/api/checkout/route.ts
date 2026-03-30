import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe, PRICE_IDS, PriceTier } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";

const CAPACITY = parseInt(process.env.WORKSHOP_CAPACITY || "50", 10);

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

  // Enforce capacity
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid");

  if ((count ?? 0) >= CAPACITY) {
    return NextResponse.json({ error: "sold_out" }, { status: 409 });
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
    automatic_tax: { enabled: true },
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description:
          tier === "pro"
            ? "AI with Michal Workshop + Toolkit — live 90-min workshop, full recording, private work group access, bonus workflow examples and notes, extra recruiting automation resources."
            : "AI with Michal Workshop Ticket — members-area pre-training, live 90-min workshop, live Q&A with Michal.",
        footer:
          "Juhas Digital Services s.r.o., Sukennicka 1, Bratislava 82109, Slovakia – AI with Michal – https://aiwithmichal.com – michal@michaljuhas.com",
        custom_fields: [{ name: "TAX ID", value: "SK2120815323" }],
        rendering_options: { amount_tax_display: "include_inclusive_tax" },
      },
    },
  });

  const ref = req.cookies.get("ref")?.value;

  await captureEvent(userId, "checkout_session_created", {
    tier,
    stripe_session_id: session.id,
    email: customerEmail,
    ...(ref ? { ref } : {}),
  });

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  // Fire-and-forget — never block the checkout response
  sendMetaEvent({
    event_name: "InitiateCheckout",
    event_source_url: `${appUrl}/tickets`,
    user_data: {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: clientIp,
    },
  });

  return NextResponse.json({ url: session.url });
}
