#!/usr/bin/env node
/**
 * Stripe revenue report
 * Usage: node --env-file=.env scripts/stripe-report.mjs
 */

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_KEY) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const authHeader = "Basic " + Buffer.from(STRIPE_KEY + ":").toString("base64");

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) throw new Error(`Stripe error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchAll(path) {
  let all = [];
  let startingAfter = null;
  while (true) {
    const url = startingAfter ? `${path}&starting_after=${startingAfter}` : path;
    const data = await stripeGet(url);
    all = all.concat(data.data);
    if (!data.has_more) break;
    startingAfter = data.data[data.data.length - 1].id;
  }
  return all;
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║         STRIPE REVENUE REPORT                    ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const sessions = await fetchAll(
    "checkout/sessions?limit=100&status=complete&expand[]=data.line_items"
  );

  const paid = sessions.filter((s) => s.payment_status === "paid");
  const totalRevenue = paid.reduce((sum, s) => sum + (s.amount_total || 0), 0) / 100;

  // Group by tier via metadata
  const byTier = { basic: [], pro: [], unknown: [] };
  for (const s of paid) {
    const tier = s.metadata?.tier;
    if (tier === "basic") byTier.basic.push(s);
    else if (tier === "pro") byTier.pro.push(s);
    else byTier.unknown.push(s);
  }

  const basicRev = byTier.basic.reduce((sum, s) => sum + s.amount_total, 0) / 100;
  const proRev = byTier.pro.reduce((sum, s) => sum + s.amount_total, 0) / 100;

  console.log(`  Total paid sessions:  ${paid.length}`);
  console.log(`  Gross revenue:        €${totalRevenue.toFixed(2)}`);
  console.log("");
  console.log("  BY TIER");
  console.log(`  ├─ Basic:   ${byTier.basic.length} tickets · €${basicRev.toFixed(2)}`);
  console.log(`  ├─ Pro:     ${byTier.pro.length} tickets · €${proRev.toFixed(2)}`);
  if (byTier.unknown.length > 0)
    console.log(`  └─ Unknown: ${byTier.unknown.length} tickets`);
  console.log("");

  // Coupons / discounts
  const withDiscount = paid.filter((s) => s.total_details?.amount_discount > 0);
  if (withDiscount.length > 0) {
    const discountTotal = withDiscount.reduce((sum, s) => sum + s.total_details.amount_discount, 0) / 100;
    console.log("  DISCOUNTS");
    console.log(`  ├─ Sessions with discount: ${withDiscount.length}`);
    console.log(`  └─ Total discount given:   €${discountTotal.toFixed(2)}`);
    console.log("");
  }

  // Recent 5
  const recent = [...paid]
    .sort((a, b) => b.created - a.created)
    .slice(0, 5);

  if (recent.length > 0) {
    console.log("  RECENT PAYMENTS");
    for (const s of recent) {
      const date = new Date(s.created * 1000).toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      const tier = s.metadata?.tier?.toUpperCase() || "?";
      const email = s.customer_details?.email || s.customer_email || "—";
      const amt = (s.amount_total / 100).toFixed(0);
      console.log(`  ├─ ${tier} €${amt} · ${email} · ${date}`);
    }
    console.log("");
  }

  // Active coupons
  try {
    const coupons = await stripeGet("coupons?limit=20");
    const active = coupons.data.filter((c) => c.valid);
    if (active.length > 0) {
      console.log("  ACTIVE COUPONS");
      for (const c of active) {
        const discount = c.percent_off ? `${c.percent_off}% off` : `€${(c.amount_off / 100).toFixed(0)} off`;
        const uses = `${c.times_redeemed} used${c.max_redemptions ? `/${c.max_redemptions}` : ""}`;
        console.log(`  ├─ ${c.id}: ${discount} · ${uses}`);
      }
      console.log("");
    }
  } catch {
    // skip
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
