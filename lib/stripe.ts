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

export const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
} as const;

export type PriceTier = keyof typeof PRICE_IDS;

export const TICKET_OPTIONS = [
  {
    id: "basic" as PriceTier,
    name: "Workshop Ticket",
    price: 79,
    currency: "EUR",
    includes: ["Live 90-min workshop", "Build the system with me", "Q&A with Michal"],
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
      "10+ alternative candidate source list",
      "Copy-paste AI analysis prompts",
      "Ready-made talent pool database template",
      "Talent Discovery Workflow Blueprint",
    ],
    recommended: true,
  },
] as const;
