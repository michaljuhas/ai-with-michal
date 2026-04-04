import type Stripe from "stripe";

/**
 * Map Checkout Session totals to integer EUR columns on `orders`.
 * `amount_eur` = gross paid (incl. tax); `amount_net_eur` = ex-VAT net for margin (Stripe total − amount_tax).
 */
export function orderAmountsFromCheckoutSession(
  session: Pick<Stripe.Checkout.Session, "amount_total" | "total_details">
): { amount_eur: number; amount_net_eur: number } {
  const totalCents = session.amount_total ?? 0;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const netCents = Math.max(0, totalCents - taxCents);
  return {
    amount_eur: Math.round(totalCents / 100),
    // Whole EUR, conservative vs invoice (e.g. €104.88 net → 104; avoids overstating margin)
    amount_net_eur: Math.floor(netCents / 100),
  };
}
