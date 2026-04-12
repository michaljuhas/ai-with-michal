import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";
import { getStripe, findOrCreateCustomer } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { getClientIp } from "@/lib/client-ip";

export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_PRICE_ANNUAL_MEMBERSHIP?.trim();

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!priceId) {
    await captureEvent(userId, "membership_checkout_not_configured", {
      reason: "missing_stripe_price_annual_membership",
    });
    return NextResponse.json(
      { error: "Annual membership is not configured (missing STRIPE_PRICE_ANNUAL_MEMBERSHIP)." },
      { status: 503 }
    );
  }

  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;
  const customerName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  if (!customerEmail) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const cancelUrl = typeof body.cancelUrl === "string" ? body.cancelUrl : "/membership";

  try {
    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ??
      (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://aiwithmichal.com";
    const appUrl = origin.replace(/\/$/, "");

    const customerId = await findOrCreateCustomer(customerEmail, customerName, {
      clerk_user_id: userId,
    });

    const cancelPath = cancelUrl.startsWith("/") ? cancelUrl : "/membership";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      client_reference_id: userId,
      metadata: {
        product: "annual_membership",
        clerk_user_id: userId,
        customer_name: customerName,
        price_id: priceId,
      },
      success_url: `${appUrl}/thank-you/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${cancelPath.startsWith("/") ? cancelPath : "/membership"}`,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      custom_fields: [
        {
          key: "company_name",
          label: { type: "custom", custom: "Company name (optional, for invoice)" },
          type: "text",
          optional: true,
        },
      ],
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description:
            "AI with Michal — AI Recruiting Systems annual membership (12 months): all live workshops, recordings, workgroups, templates, and First Principles in Talent Sourcing course access.",
          footer: `Juhas Digital Services s.r.o., Sukennicka 1, Bratislava 82109, Slovakia – AI with Michal – https://aiwithmichal.com – ${PUBLIC_CONTACT_EMAIL}`,
          custom_fields: [{ name: "TAX ID", value: "SK2120815323" }],
          rendering_options: { amount_tax_display: "include_inclusive_tax" },
        },
      },
    });

    const ref = req.cookies.get("ref")?.value;
    await captureEvent(userId, "membership_checkout_session_created", {
      stripe_session_id: session.id,
      email: customerEmail,
      ...(ref ? { ref } : {}),
    });

    sendMetaEvent({
      event_name: "InitiateCheckout",
      event_source_url: `${appUrl}${cancelPath}`,
      user_data: {
        client_user_agent: req.headers.get("user-agent") ?? undefined,
        client_ip_address: getClientIp(req),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("membership checkout error:", err);
    await captureEvent(userId, "membership_checkout_session_failed", {
      error_message: message.slice(0, 240),
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
