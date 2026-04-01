import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Named export kept for backwards compat in route files
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
};

/**
 * Find an existing Stripe customer by email or create a new one.
 * Returns the customer ID to use in checkout sessions (required by
 * Stripe API 2026-02-25.clover when tax_id_collection is enabled).
 */
export async function findOrCreateCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>,
): Promise<string> {
  const s = getStripe();
  const existing = await s.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0].id;
  }
  const customer = await s.customers.create({
    email,
    ...(name ? { name } : {}),
    ...(metadata ? { metadata } : {}),
  });
  return customer.id;
}

export const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
} as const;

export type PriceTier = keyof typeof PRICE_IDS;

// ---------------------------------------------------------------------------
// Mentoring subscriptions
// ---------------------------------------------------------------------------

export const MENTORING_PRICE_IDS = {
  group: process.env.STRIPE_PRICE_MENTORING_GROUP!,
  vip: process.env.STRIPE_PRICE_MENTORING_VIP!,
} as const;

export type MentoringTier = keyof typeof MENTORING_PRICE_IDS;

export const MENTORING_OPTIONS = [
  {
    id: "group" as MentoringTier,
    name: "Group Mentoring",
    price: 397,
    currency: "EUR",
    interval: "month",
    includes: [
      "Access to weekly implementation calls",
      "Support in a dedicated private group",
      "Monthly 1-on-1 call with Michal",
    ],
    recommended: false,
  },
  {
    id: "vip" as MentoringTier,
    name: "VIP Mentoring",
    price: 697,
    currency: "EUR",
    interval: "month",
    includes: [
      "Access to weekly implementation calls",
      "Support in a dedicated private group",
      "Two 1-on-1 calls with Michal every month",
      "Two 1-on-1 calls with a mentor every month",
    ],
    recommended: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Workshop tickets
// ---------------------------------------------------------------------------

export const TICKET_OPTIONS = [
  {
    id: "basic" as PriceTier,
    name: "Workshop Ticket",
    price: 79,
    currency: "EUR",
    includes: [
      "Members-area pre-training",
      "Live 90-minute workshop",
      "Live Q&A with Michal",
    ],
    recommended: false,
  },
  {
    id: "pro" as PriceTier,
    name: "Workshop + Toolkit",
    price: 129,
    currency: "EUR",
    includes: [
      "Everything in Workshop Ticket",
      "Full recording — rewatch forever",
      "Private work group access",
      "Bonus workflow examples and notes",
      "Extra recruiting automation resources",
    ],
    recommended: true,
  },
] as const;
