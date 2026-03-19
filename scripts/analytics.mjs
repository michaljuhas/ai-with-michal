#!/usr/bin/env node
/**
 * PostHog funnel analytics
 * Usage: node --env-file=.env scripts/analytics.mjs
 *
 * Requires: POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID
 */

const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const HOST = "https://eu.posthog.com";

if (!API_KEY || !PROJECT_ID) {
  console.error("Missing POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID");
  process.exit(1);
}

async function phGet(path) {
  const res = await fetch(`${HOST}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(`PostHog error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function getEventCount(eventName, dateFrom = "-30d") {
  const params = new URLSearchParams({
    events: JSON.stringify([{ id: eventName, name: eventName, type: "events" }]),
    date_from: dateFrom,
    display: "ActionsTable",
  });
  const data = await phGet(`/api/projects/${PROJECT_ID}/insights/trend/?${params}`);
  const result = data.result?.[0];
  if (!result) return 0;
  return result.aggregated_value ?? result.count ?? 0;
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║         POSTHOG FUNNEL (last 30 days)            ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("  Fetching event counts...\n");

  const events = [
    ["$pageview", "Page views (homepage)"],
    ["ticket_tier_viewed", "Reached /tickets page"],
    ["checkout_initiated", "Clicked checkout"],
    ["checkout_session_created", "Stripe session created"],
    ["payment_completed", "Payment completed"],
  ];

  const counts = [];
  for (const [name, label] of events) {
    try {
      const count = await getEventCount(name);
      counts.push({ name, label, count });
    } catch {
      counts.push({ name, label, count: null });
    }
  }

  const baseline = counts[0]?.count || 1;
  for (let i = 0; i < counts.length; i++) {
    const { label, count } = counts[i];
    const pct = count != null ? ((count / baseline) * 100).toFixed(1) : "?";
    const bar = count != null ? "█".repeat(Math.min(30, Math.round((count / baseline) * 30))) : "";
    const dropoff =
      i > 0 && counts[i - 1].count && count != null
        ? ` (${(100 - (count / counts[i - 1].count) * 100).toFixed(0)}% drop)`
        : "";
    console.log(`  ${label}`);
    console.log(`  ${bar} ${count ?? "?"} (${pct}%)${dropoff}`);
    console.log("");
  }

  // Top referrers
  console.log("  TOP REFERRAL SOURCES (ref= param)");
  try {
    const params = new URLSearchParams({
      properties: JSON.stringify([{ key: "ref", type: "event" }]),
      date_from: "-30d",
      breakdown: "ref",
      events: JSON.stringify([{ id: "checkout_initiated", name: "checkout_initiated", type: "events" }]),
    });
    const data = await phGet(`/api/projects/${PROJECT_ID}/insights/trend/?${params}`);
    const results = (data.result || []).slice(0, 5);
    if (results.length === 0) {
      console.log("  No referral data yet.\n");
    } else {
      for (const r of results) {
        console.log(`  ├─ ${r.breakdown_value || "direct"}: ${r.aggregated_value ?? r.count} checkouts`);
      }
      console.log("");
    }
  } catch {
    console.log("  (unable to fetch referral breakdown)\n");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
