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

async function hogql(query) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  if (!res.ok) throw new Error(`PostHog error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(`HogQL error: ${data.error}`);
  return data.results ?? [];
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║         POSTHOG FUNNEL (last 30 days)            ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("  Fetching event counts...\n");

  const FUNNEL_EVENTS = [
    ["$pageview",               "Page views (homepage)"],
    ["ticket_tier_viewed",      "Reached /tickets page"],
    ["checkout_initiated",      "Clicked checkout"],
    ["checkout_session_created","Stripe session created"],
    ["payment_completed",       "Payment completed"],
  ];

  // Fetch all event counts in one query
  const eventNames = FUNNEL_EVENTS.map(([e]) => `'${e}'`).join(", ");
  let rows = [];
  try {
    rows = await hogql(
      `SELECT event, count() AS cnt
       FROM events
       WHERE timestamp >= now() - interval 30 day
         AND event IN (${eventNames})
       GROUP BY event`
    );
  } catch (err) {
    console.error(`  Error fetching funnel: ${err.message}\n`);
    process.exit(1);
  }

  // Build a map: event → count
  const countMap = Object.fromEntries(rows.map(([event, cnt]) => [event, Number(cnt)]));
  const counts = FUNNEL_EVENTS.map(([name, label]) => ({
    name,
    label,
    count: countMap[name] ?? 0,
  }));

  const baseline = counts[0]?.count || 1;
  for (let i = 0; i < counts.length; i++) {
    const { label, count } = counts[i];
    const pct = ((count / baseline) * 100).toFixed(1);
    const bar = "█".repeat(Math.min(30, Math.round((count / baseline) * 30)));
    const dropoff =
      i > 0 && counts[i - 1].count > 0
        ? ` (${(100 - (count / counts[i - 1].count) * 100).toFixed(0)}% drop)`
        : "";
    console.log(`  ${label}`);
    console.log(`  ${bar} ${count} (${pct}%)${dropoff}`);
    console.log("");
  }

  // Top referrers via ref property on checkout_initiated
  console.log("  TOP REFERRAL SOURCES (ref= param)");
  try {
    const refRows = await hogql(
      `SELECT properties.ref AS ref, count() AS cnt
       FROM events
       WHERE event = 'checkout_initiated'
         AND timestamp >= now() - interval 30 day
         AND properties.ref IS NOT NULL
       GROUP BY ref
       ORDER BY cnt DESC
       LIMIT 5`
    );
    if (refRows.length === 0) {
      console.log("  No referral data yet.\n");
    } else {
      for (const [ref, cnt] of refRows) {
        console.log(`  ├─ ${ref || "direct"}: ${cnt} checkouts`);
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
