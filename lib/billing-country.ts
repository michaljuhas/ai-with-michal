/** Normalize Stripe Checkout `customer_details.address.country` to ISO 3166-1 alpha-2. */
export function normalizeBillingCountryCode(
  raw: string | null | undefined
): string | null {
  if (!raw || typeof raw !== "string") return null;
  const c = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
}
