#!/usr/bin/env node
/**
 * Workshop status dashboard
 * Usage: node --env-file=.env scripts/status.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKSHOP_DATE = new Date("2026-04-02T15:00:00Z");
const CAPACITY = parseInt(process.env.WORKSHOP_CAPACITY || "50", 10);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((WORKSHOP_DATE - now) / (1000 * 60 * 60 * 24)));

  const [registrations, orders] = await Promise.all([
    supabaseGet("registrations?select=id,created_at"),
    supabaseGet("orders?select=id,tier,amount_eur,status,created_at&status=eq.paid"),
  ]);

  const totalReg = registrations.length;
  const totalPaid = orders.length;
  const basicOrders = orders.filter((o) => o.tier === "basic");
  const proOrders = orders.filter((o) => o.tier === "pro");
  const revenue = orders.reduce((sum, o) => sum + (o.amount_eur || 0), 0);
  const spotsLeft = CAPACITY - totalPaid;
  const convRate = totalReg > 0 ? ((totalPaid / totalReg) * 100).toFixed(1) : "0.0";
  const proMix = totalPaid > 0 ? ((proOrders.length / totalPaid) * 100).toFixed(0) : "0";

  // Recent orders (last 5)
  const recent = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║         WORKSHOP STATUS DASHBOARD                ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`  Date:        April 2, 2026 · ${daysLeft} days away`);
  console.log(`  Capacity:    ${totalPaid}/${CAPACITY} spots filled · ${spotsLeft} remaining`);
  console.log("");
  console.log("  REVENUE");
  console.log(`  ├─ Total:    €${revenue}`);
  console.log(`  ├─ Basic:    ${basicOrders.length} × €79 = €${basicOrders.length * 79}`);
  console.log(`  └─ Pro:      ${proOrders.length} × €129 = €${proOrders.length * 129}`);
  console.log("");
  console.log("  FUNNEL");
  console.log(`  ├─ Signups:       ${totalReg}`);
  console.log(`  ├─ Paid:          ${totalPaid}`);
  console.log(`  ├─ Conversion:    ${convRate}% (target: 3%)`);
  console.log(`  └─ Pro tier mix:  ${proMix}% (target: 50%)`);
  console.log("");

  if (recent.length > 0) {
    console.log("  RECENT ORDERS");
    for (const o of recent) {
      const date = new Date(o.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      console.log(`  ├─ ${o.tier.toUpperCase()} €${o.amount_eur} — ${date}`);
    }
    console.log("");
  }

  // Alerts
  const alerts = [];
  if (parseFloat(convRate) < 2) alerts.push("⚠️  Conversion below 2% — check funnel with analytics.mjs");
  if (spotsLeft <= 10 && spotsLeft > 0) alerts.push(`⚠️  Only ${spotsLeft} spots left — consider urgency push`);
  if (spotsLeft <= 0) alerts.push("🔴 SOLD OUT");
  if (parseInt(proMix) < 40) alerts.push("⚠️  Pro mix below 40% — consider promoting Pro tier");
  if (daysLeft <= 7 && daysLeft > 1) alerts.push(`📧 ${daysLeft} days to go — run send-reminders.mjs`);
  if (daysLeft === 1) alerts.push("📧 Tomorrow! Send day-before reminder with send-reminders.mjs --type=dayBefore");
  if (daysLeft === 0) alerts.push("📧 TODAY! Send day-of reminder with send-reminders.mjs --type=dayOf");

  if (alerts.length > 0) {
    console.log("  ACTIONS NEEDED");
    for (const a of alerts) console.log(`  ${a}`);
    console.log("");
  }

  console.log("  NEXT COMMANDS");
  console.log("  node --env-file=.env scripts/analytics.mjs    # PostHog funnel");
  console.log("  node --env-file=.env scripts/stripe-report.mjs  # Stripe details");
  console.log("  node --env-file=.env scripts/send-reminders.mjs # Email attendees");
  console.log('  ./scripts/deploy.sh "message"                    # Deploy changes');
  console.log("");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
