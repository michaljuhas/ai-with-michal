#!/usr/bin/env node
/**
 * Workshop status dashboard
 * Usage: node --env-file=.env scripts/status.mjs
 */

import { createClient } from './meta-ads/client.mjs';
import { getInsights } from './meta-ads/insights.mjs';
import { CAMPAIGN_START } from './config.mjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKSHOP_DATE = new Date("2026-04-02T15:00:00Z");
const CAPACITY = parseInt(process.env.WORKSHOP_CAPACITY || "50", 10);

async function fetchMetaInsights() {
  const token = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
  const rawId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawId) return null;
  const accountId = rawId.startsWith('act_') ? rawId : `act_${rawId}`;
  try {
    const client = createClient(token, accountId);
    const rows = await getInsights(client, accountId, {
      since: CAMPAIGN_START,
      until: new Date().toISOString().slice(0, 10),
      level: 'account',
      fields: 'impressions,clicks,spend,cpm,ctr',
    });
    return rows[0] ?? null;
  } catch {
    return null;
  }
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

  const [registrations, orders, metaInsights] = await Promise.all([
    supabaseGet("registrations?select=id,created_at"),
    supabaseGet("orders?select=id,tier,amount_eur,status,created_at&status=eq.paid"),
    fetchMetaInsights(),
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

  const metaDateEnd = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const metaDateStart = new Date(CAMPAIGN_START).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  console.log(`  META ADS (${metaDateStart} – ${metaDateEnd})`);
  if (metaInsights) {
    const spend = parseFloat(metaInsights.spend || 0).toFixed(2);
    const impressions = parseInt(metaInsights.impressions || 0).toLocaleString("en");
    const clicks = parseInt(metaInsights.clicks || 0).toLocaleString("en");
    const ctr = parseFloat(metaInsights.ctr || 0).toFixed(2);
    const cpm = parseFloat(metaInsights.cpm || 0).toFixed(2);
    console.log(`  ├─ Spend:       €${spend}`);
    console.log(`  ├─ Impressions: ${impressions}`);
    console.log(`  ├─ Clicks:      ${clicks}`);
    console.log(`  ├─ CTR:         ${ctr}%`);
    console.log(`  └─ CPM:         €${cpm}`);
  } else {
    console.log("  └─ (no data — check META_SYSTEM_USER_ACCESS_TOKEN / META_AD_ACCOUNT_ID)");
  }
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
  console.log("  node --env-file=.env scripts/analytics.mjs                              # PostHog funnel");
  console.log("  node --env-file=.env scripts/stripe-report.mjs                          # Stripe details");
  console.log("  node --env-file=.env scripts/meta-ads/index.mjs campaigns list --pretty # Meta Ads campaigns");
  console.log("  node --env-file=.env scripts/send-reminders.mjs                         # Email attendees");
  console.log('  ./scripts/deploy.sh "message"                                            # Deploy changes');
  console.log("");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
