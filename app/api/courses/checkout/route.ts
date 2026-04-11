import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";
import { getStripe, findOrCreateCustomer } from "@/lib/stripe";
import { getCourseBySlug } from "@/lib/courses";
import type { CoursePriceTier } from "@/lib/courses";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { getClientIp } from "@/lib/client-ip";
import { safeCheckoutCancelPath } from "@/lib/safe-cancel-path";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const customerEmail = user?.emailAddresses[0]?.emailAddress;
  const customerName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const body = await req.json();
  const tier = body.tier as CoursePriceTier;
  const courseSlug = body.courseSlug as string | undefined;
  const cancelUrl = body.cancelUrl as string | undefined;

  if (!tier || (tier !== "basic" && tier !== "pro")) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!courseSlug) {
    return NextResponse.json({ error: "Missing courseSlug" }, { status: 400 });
  }

  const course = getCourseBySlug(courseSlug);
  if (!course || !course.published) {
    return NextResponse.json({ error: "Invalid course" }, { status: 400 });
  }

  const priceId = course.priceIds[tier];
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 400 });
  }

  const ticketOption = course.ticketOptions.find((o) => o.id === tier);

  try {
    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ??
      (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://aiwithmichal.com";
    const appUrl = origin;

    const customerId = await findOrCreateCustomer(customerEmail!, customerName, {
      clerk_user_id: userId,
    });

    const cancelPath = safeCheckoutCancelPath(
      cancelUrl,
      `/training/${courseSlug}/tickets`
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      customer_update: {
        address: "auto",
        name: "auto",
      },
      client_reference_id: userId,
      metadata: {
        product: "course",
        clerk_user_id: userId,
        tier,
        customer_name: customerName,
        course_slug: courseSlug,
        price_id: priceId,
      },
      success_url: `${appUrl}/thank-you/course?session_id={CHECKOUT_SESSION_ID}&course_slug=${encodeURIComponent(courseSlug)}&tier=${tier}`,
      cancel_url: `${appUrl}${cancelPath}`,
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
          description: ticketOption
            ? `AI with Michal — ${course.title} (${ticketOption.name})`
            : `AI with Michal — ${course.title}`,
          footer: `Juhas Digital Services s.r.o., Sukennicka 1, Bratislava 82109, Slovakia – AI with Michal – https://aiwithmichal.com – ${PUBLIC_CONTACT_EMAIL}`,
          custom_fields: [{ name: "TAX ID", value: "SK2120815323" }],
          rendering_options: { amount_tax_display: "include_inclusive_tax" },
        },
      },
    });

    const ref = req.cookies.get("ref")?.value;

    await captureEvent(userId, "course_checkout_session_created", {
      tier,
      course_slug: courseSlug,
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
    console.error("course checkout error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
