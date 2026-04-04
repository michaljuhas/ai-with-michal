import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe, findCustomerByClerkId } from "@/lib/stripe";
import type Stripe from "stripe";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await findCustomerByClerkId(userId);

  if (!customerId) {
    return NextResponse.json({ payments: [] });
  }

  const stripe = getStripe();
  const result = await stripe.charges.list({
    customer: customerId,
    limit: 50,
    expand: ["data.invoice"],
  });

  const payments = result.data
    .filter((ch) => ch.status === "succeeded")
    .map((ch) => {
      const inv = ch.invoice as Stripe.Invoice | null;
      return {
        id: ch.id,
        created: ch.created,
        amount: ch.amount,
        currency: ch.currency,
        description: ch.description,
        receipt_url: ch.receipt_url,
        invoice_number: inv?.number ?? null,
        invoice_pdf: inv?.invoice_pdf ?? null,
        hosted_invoice_url: inv?.hosted_invoice_url ?? null,
        metadata: ch.metadata,
      };
    });

  return NextResponse.json({ payments });
}
