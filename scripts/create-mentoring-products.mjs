/**
 * One-shot script to create AI Mentoring products and recurring prices in Stripe.
 * Run once: node --env-file=.env scripts/create-mentoring-products.mjs
 * Then add the printed price IDs to .env.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  // Group Mentoring
  const groupProduct = await stripe.products.create({
    name: "AI Mentoring — Group",
    description:
      "Monthly group mentoring: weekly implementation calls, dedicated private group, monthly 1-on-1 call with Michal.",
  });
  const groupPrice = await stripe.prices.create({
    product: groupProduct.id,
    unit_amount: 39700,
    currency: "eur",
    recurring: { interval: "month" },
    tax_behavior: "inclusive",
  });
  console.log(`Group product: ${groupProduct.id}`);
  console.log(`STRIPE_PRICE_MENTORING_GROUP=${groupPrice.id}`);

  // VIP Mentoring
  const vipProduct = await stripe.products.create({
    name: "AI Mentoring — VIP",
    description:
      "Monthly VIP mentoring: weekly implementation calls, dedicated private group, two 1-on-1 calls with Michal, two 1-on-1 calls with a mentor.",
  });
  const vipPrice = await stripe.prices.create({
    product: vipProduct.id,
    unit_amount: 69700,
    currency: "eur",
    recurring: { interval: "month" },
    tax_behavior: "inclusive",
  });
  console.log(`VIP product: ${vipProduct.id}`);
  console.log(`STRIPE_PRICE_MENTORING_VIP=${vipPrice.id}`);

  console.log("\nAdd these to your .env file:");
  console.log(`STRIPE_PRICE_MENTORING_GROUP=${groupPrice.id}`);
  console.log(`STRIPE_PRICE_MENTORING_VIP=${vipPrice.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
