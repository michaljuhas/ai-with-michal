#!/usr/bin/env node
/**
 * PostHog funnel analytics — workshop ticket flows live under /workshops/[slug]/tickets
 * (legacy /tickets redirect is included where relevant).
 * Usage: node --env-file=.env scripts/analytics.mjs
 *
 * Requires: POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID
 */

import { CAMPAIGN_START } from './config.mjs';

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
  const now = new Date();
  const dateEnd = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateStart = new Date(CAMPAIGN_START).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log(`║     POSTHOG FUNNEL (${dateStart} – ${dateEnd})`.padEnd(51) + "║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("  Fetching event counts...\n");

  const FUNNEL_EVENTS = [
    {
      key: "$pageview:workshop-tickets",
      label: "Page views (workshop ticket pages /workshops/…/tickets)",
    },
    { key: "$pageview:/register", label: "Visited sign-up page (/register)" },
    {
      key: "ticket_tier_viewed",
      label: "Ticket page engaged (PostHog event on /workshops/…/tickets)",
    },
    { key: "checkout_initiated", label: "Clicked checkout" },
    { key: "payment_completed", label: "Payment completed (workshop Stripe)" },
  ];

  // Named events only (filtered $pageview steps are injected below)
  const namedEvents = FUNNEL_EVENTS.filter((e) => !e.key.startsWith("$pageview"))
    .map((e) => `'${e.key}'`)
    .join(", ");

  let rows = [];
  try {
    rows = await hogql(
      `SELECT event, count() AS cnt
       FROM events
       WHERE timestamp >= '${CAMPAIGN_START}'
         AND event IN (${namedEvents})
       GROUP BY event`,
    );
  } catch (err) {
    console.error(`  Error fetching funnel: ${err.message}\n`);
    process.exit(1);
  }

  // Workshop ticket URLs: /workshops/<slug>/tickets (plus legacy /tickets)
  let workshopTicketPageviews = 0;
  try {
    const pvRows = await hogql(
      `SELECT count() AS cnt
       FROM events
       WHERE event = '$pageview'
         AND timestamp >= '${CAMPAIGN_START}'
         AND (
           properties.$pathname LIKE '/workshops/%/tickets%'
           OR properties.$pathname = '/tickets'
         )`,
    );
    workshopTicketPageviews = Number(pvRows?.[0]?.[0] ?? 0);
  } catch {
    // leave as 0
  }

  // Fetch /register pageviews separately (filtered pageview)
  let registerCount = 0;
  try {
    const registerRows = await hogql(
      `SELECT count() AS cnt
       FROM events
       WHERE event = '$pageview'
         AND timestamp >= '${CAMPAIGN_START}'
         AND properties.$pathname LIKE '/register%'`,
    );
    registerCount = Number(registerRows?.[0]?.[0] ?? 0);
  } catch {
    // leave as 0
  }

  // Build a map: key → count
  const countMap = Object.fromEntries(rows.map(([event, cnt]) => [event, Number(cnt)]));
  countMap["$pageview:workshop-tickets"] = workshopTicketPageviews;
  countMap["$pageview:/register"] = registerCount;

  const counts = FUNNEL_EVENTS.map(({ key, label }) => ({
    label,
    count: countMap[key] ?? 0,
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

  console.log(
    "  Note: % and drop-offs use workshop ticket pageviews as baseline; /register and",
  );
  console.log(
    "  other steps are site-wide counts and can exceed that baseline (not a strict funnel).\n",
  );

  // Top referrers via ref property on checkout_initiated
  console.log("  TOP REFERRAL SOURCES (ref= param)");
  try {
    const refRows = await hogql(
      `SELECT properties.ref AS ref, count() AS cnt
       FROM events
       WHERE event = 'checkout_initiated'
         AND timestamp >= '${CAMPAIGN_START}'
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

  // Pageviews per workshop ticket path
  console.log("  WORKSHOP TICKET PAGEVIEWS BY PATH ($pageview)");
  try {
    const pathRows = await hogql(
      `SELECT properties.$pathname AS path, count() AS cnt
       FROM events
       WHERE event = '$pageview'
         AND timestamp >= '${CAMPAIGN_START}'
         AND properties.$pathname LIKE '/workshops/%/tickets%'
       GROUP BY path
       ORDER BY cnt DESC
       LIMIT 15`,
    );
    if (pathRows.length === 0) {
      console.log("  No /workshops/…/tickets pageviews in range.\n");
    } else {
      for (const [path, cnt] of pathRows) {
        console.log(`  ├─ ${path || "?"}: ${cnt}`);
      }
      console.log("");
    }
  } catch {
    console.log("  (unable to fetch path breakdown)\n");
  }

  // Per-workshop engagement (requires workshop_slug on events — ticket page sends this)
  console.log("  TICKET PAGE VIEWS BY WORKSHOP (ticket_tier_viewed.workshop_slug)");
  try {
    const tvRows = await hogql(
      `SELECT properties.workshop_slug AS slug, count() AS cnt
       FROM events
       WHERE event = 'ticket_tier_viewed'
         AND timestamp >= '${CAMPAIGN_START}'
         AND properties.workshop_slug IS NOT NULL
         AND toString(properties.workshop_slug) != ''
       GROUP BY slug
       ORDER BY cnt DESC
       LIMIT 15`,
    );
    if (tvRows.length === 0) {
      console.log("  No workshop_slug on ticket_tier_viewed yet (newer captures only).\n");
    } else {
      for (const [slug, cnt] of tvRows) {
        console.log(`  ├─ ${slug}: ${cnt}`);
      }
      console.log("");
    }
  } catch {
    console.log("  (unable to fetch ticket_tier_viewed by workshop)\n");
  }

  console.log("  CHECKOUT CLICKS BY WORKSHOP (checkout_initiated.workshop_slug)");
  try {
    const coRows = await hogql(
      `SELECT properties.workshop_slug AS slug, count() AS cnt
       FROM events
       WHERE event = 'checkout_initiated'
         AND timestamp >= '${CAMPAIGN_START}'
         AND properties.workshop_slug IS NOT NULL
         AND toString(properties.workshop_slug) != ''
       GROUP BY slug
       ORDER BY cnt DESC
       LIMIT 15`,
    );
    if (coRows.length === 0) {
      console.log("  No workshop_slug on checkout_initiated yet (newer captures only).\n");
    } else {
      for (const [slug, cnt] of coRows) {
        console.log(`  ├─ ${slug}: ${cnt}`);
      }
      console.log("");
    }
  } catch {
    console.log("  (unable to fetch checkout by workshop)\n");
  }

  console.log("  CHECKOUT CLICKS BY PATH (checkout_initiated — legacy / unnamed)");
  try {
    const pathCoRows = await hogql(
      `SELECT properties.$pathname AS path, count() AS cnt
       FROM events
       WHERE event = 'checkout_initiated'
         AND timestamp >= '${CAMPAIGN_START}'
         AND (properties.workshop_slug IS NULL OR toString(properties.workshop_slug) = '')
         AND properties.$pathname IS NOT NULL
         AND properties.$pathname != ''
       GROUP BY path
       ORDER BY cnt DESC
       LIMIT 10`,
    );
    if (pathCoRows.length === 0) {
      console.log("  (none without workshop_slug, or no events)\n");
    } else {
      for (const [path, cnt] of pathCoRows) {
        console.log(`  ├─ ${path}: ${cnt}`);
      }
      console.log("");
    }
  } catch {
    console.log("  (unable to fetch checkout path breakdown)\n");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
