#!/usr/bin/env node
/**
 * Workshop portfolio status — paid orders per upcoming workshop + global funnel cue.
 * Meta + LinkedIn Ads (optional) + gross margin (Total Charged incl. tax vs Total Revenues ex-VAT; amount_net_eur when set).
 * Usage: node --env-file=.env scripts/status.mjs
 */

import { createClient } from './meta-ads/client.mjs';
import { getInsights } from './meta-ads/insights.mjs';
import { CAMPAIGN_START } from './config.mjs';
import { getUpcomingWorkshops, workshopLabel } from './workshop-registry.mjs';
import { loadToken, isTokenValid } from './linkedin/auth.mjs';
import { getAdsTokenFilePath } from './linkedin/config.mjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CAPACITY = parseInt(
  process.env.WORKSHOP_CAPACITY || process.env.NEXT_PUBLIC_WORKSHOP_CAPACITY || '20',
  10,
);
const PAID_TARGET = 20;

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

function resolveLinkedInAdsAccessToken() {
  const fromEnv = process.env.LINKEDIN_ADS_ACCESS_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const fileTok = loadToken(getAdsTokenFilePath());
  if (isTokenValid(fileTok)) return fileTok.accessToken;
  return '';
}

/** Sponsored Ad Account URN for LinkedIn Marketing API reporting */
function linkedInAdsAccountUrnFromEnv() {
  const full = process.env.LINKEDIN_ADS_ACCOUNT_URN?.trim();
  if (full) return full;
  const id = process.env.LINKEDIN_ADS_ACCOUNT_ID?.trim();
  if (id) return `urn:li:sponsoredAccount:${id}`;
  return null;
}

/** Rest.li dateRange for adAnalytics — aligned with CAMPAIGN_START through today (UTC calendar days). */
function buildLinkedInAdAnalyticsDateRange() {
  const start = new Date(`${CAMPAIGN_START}T00:00:00.000Z`);
  const end = new Date();
  const ymd = (d) => ({
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  });
  const s = ymd(start);
  const e = ymd(end);
  return `(start:(year:${s.year},month:${s.month},day:${s.day}),end:(year:${e.year},month:${e.month},day:${e.day}))`;
}

/**
 * LinkedIn Ads spend + optional metrics (same date window as Meta in this script).
 * API: LINKEDIN_ADS_ACCESS_TOKEN or ~/.linkedin-ads-token.json from `linkedin/index.mjs auth-ads`
 *       (r_ads_reporting) + LINKEDIN_ADS_ACCOUNT_URN or LINKEDIN_ADS_ACCOUNT_ID.
 * Fallback: LINKEDIN_ADS_SPEND_EUR — manual EUR for that window if API is unset or fails.
 */
async function fetchLinkedInAdsSummary() {
  const manualRaw = process.env.LINKEDIN_ADS_SPEND_EUR?.trim();
  let manualEur = null;
  if (manualRaw !== undefined && manualRaw !== '') {
    const p = parseFloat(manualRaw);
    if (Number.isFinite(p)) manualEur = p;
  }

  const token = resolveLinkedInAdsAccessToken();
  const accountUrn = linkedInAdsAccountUrnFromEnv();
  const apiVersion = process.env.LINKEDIN_API_VERSION?.trim() || '202505';

  if (!token || !accountUrn) {
    if (manualEur !== null) {
      return {
        spend: manualEur,
        impressions: null,
        clicks: null,
        source: 'manual',
        error: null,
      };
    }
    return null;
  }

  const dateRange = buildLinkedInAdAnalyticsDateRange();
  const fields = 'impressions,clicks,costInLocalCurrency,pivotValues';
  // Rest.li query: do not encode dateRange or fields — LinkedIn rejects over-encoded params ("Invalid query parameters").
  // Encode only the URN inside List(), per https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting
  const accountsList = `List(${encodeURIComponent(accountUrn)})`;
  const url =
    `https://api.linkedin.com/rest/adAnalytics?q=analytics` +
    `&dateRange=${dateRange}` +
    `&timeGranularity=ALL` +
    `&accounts=${accountsList}` +
    `&pivot=ACCOUNT` +
    `&fields=${fields}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'LinkedIn-Version': apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    if (!res.ok) {
      const msg = (data && (data.message || data.errorDetail)) || text.slice(0, 200);
      if (manualEur !== null) {
        return {
          spend: manualEur,
          impressions: null,
          clicks: null,
          source: 'manual (API failed)',
          error: String(msg),
        };
      }
      return {
        spend: null,
        impressions: null,
        clicks: null,
        source: 'error',
        error: String(msg),
      };
    }
    const elements = data?.elements ?? [];
    let spend = 0;
    let impressions = 0;
    let clicks = 0;
    for (const el of elements) {
      spend += parseFloat(String(el.costInLocalCurrency ?? 0)) || 0;
      impressions += parseInt(String(el.impressions ?? 0), 10) || 0;
      clicks += parseInt(String(el.clicks ?? 0), 10) || 0;
    }
    return {
      spend,
      impressions,
      clicks,
      source: 'api',
      error: null,
    };
  } catch (e) {
    if (manualEur !== null) {
      return {
        spend: manualEur,
        impressions: null,
        clicks: null,
        source: 'manual (request error)',
        error: e.message,
      };
    }
    return {
      spend: null,
      impressions: null,
      clicks: null,
      source: 'error',
      error: e.message,
    };
  }
}

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Net EUR for reporting / margin: ex-VAT when `amount_net_eur` is stored (Stripe webhook); else gross. */
function orderNetEur(o) {
  const n = o.amount_net_eur;
  if (n != null && Number.isFinite(n)) return n;
  return o.amount_eur || 0;
}

function summarizeOrders(orders) {
  const basicOrders = orders.filter((o) => o.tier === 'basic');
  const proOrders = orders.filter((o) => o.tier === 'pro');
  const revenue = orders.reduce((sum, o) => sum + orderNetEur(o), 0);
  const proMix = orders.length > 0 ? ((proOrders.length / orders.length) * 100).toFixed(0) : '0';
  return { basicOrders, proOrders, revenue, proMix };
}

async function main() {
  const now = new Date();
  const upcoming = getUpcomingWorkshops(now);
  const upcomingSlugs = new Set(upcoming.map((w) => w.slug));

  const [registrations, orders, metaInsights, linkedInAds] = await Promise.all([
    supabaseGet('registrations?select=id,created_at'),
    supabaseGet(
      'orders?select=id,tier,amount_eur,amount_net_eur,status,created_at,workshop_slug&status=eq.paid',
    ),
    fetchMetaInsights(),
    fetchLinkedInAdsSummary(),
  ]);

  const totalReg = registrations.length;
  const convRate = totalReg > 0 ? (((orders.length / totalReg) * 100).toFixed(1)) : '0.0';

  const campaignStart = new Date(`${CAMPAIGN_START}T00:00:00.000Z`);
  const ordersInMetaWindow = orders.filter((o) => new Date(o.created_at) >= campaignStart);
  const periodTotalCharged = ordersInMetaWindow.reduce((sum, o) => sum + (o.amount_eur || 0), 0);
  const periodTicketRevenue = ordersInMetaWindow.reduce((sum, o) => sum + orderNetEur(o), 0);

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║       WORKSHOP PORTFOLIO STATUS                  ║');
  console.log('╚══════════════════════════════════════════════════╝');

  let portfolioTickets = 0;
  let portfolioRevenue = 0;

  for (const w of upcoming) {
    const wOrders = orders.filter((o) => o.workshop_slug === w.slug);
    const { basicOrders, proOrders, revenue, proMix } = summarizeOrders(wOrders);
    portfolioTickets += wOrders.length;
    portfolioRevenue += revenue;

    const daysLeft = Math.max(0, Math.ceil((new Date(w.dateIso) - now) / (1000 * 60 * 60 * 24)));
    const spotsLeft = CAPACITY - wOrders.length;
    const targetGap = PAID_TARGET - wOrders.length;

    console.log('');
    console.log(`  ▶ ${workshopLabel(w)}`);
    console.log(`    slug:        ${w.slug}`);
    console.log(`    Date:        ${w.displayDate} · ${daysLeft} days away`);
    console.log(
      `    Capacity:    ${wOrders.length}/${CAPACITY} paid · ${spotsLeft} spots left (target ${PAID_TARGET}${targetGap > 0 ? ` · ${targetGap} to target` : ' · met'})`,
    );
    console.log('    REVENUE (ex-VAT when recorded; see amount_net_eur)');
    console.log(`    ├─ Total:    €${revenue}`);
    console.log(`    ├─ Basic:    ${basicOrders.length} tickets`);
    console.log(`    └─ Pro:      ${proOrders.length} tickets · Pro mix ${proMix}%`);

    const recent = [...wOrders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
    if (recent.length > 0) {
      console.log('    Recent paid');
      for (const o of recent) {
        const date = new Date(o.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const g = o.amount_eur;
        const n = orderNetEur(o);
        const amt = g !== n ? `${g} paid (${n} ex-VAT)` : `${g}`;
        console.log(`    ├─ ${o.tier.toUpperCase()} €${amt} — ${date}`);
      }
    }
  }

  const otherOrders = orders.filter(
    (o) => !o.workshop_slug || !upcomingSlugs.has(o.workshop_slug),
  );
  if (otherOrders.length > 0) {
    const { revenue } = summarizeOrders(otherOrders);
    console.log('');
    console.log('  ▶ Other / past workshops (not in upcoming list)');
    console.log(`    Paid tickets: ${otherOrders.length} · Revenue €${revenue} (ex-VAT when recorded)`);
  }

  if (upcoming.length === 0) {
    console.log('\n  (No upcoming workshops in registry — check workshop-registry.mjs)\n');
  }

  console.log('');
  console.log('  PORTFOLIO (upcoming workshops only)');
  console.log(`  ├─ Paid tickets: ${portfolioTickets}`);
  console.log(`  └─ Revenue:      €${portfolioRevenue} (ex-VAT when recorded)`);
  console.log('');
  console.log('  FUNNEL (global — signups are not attributed per workshop)');
  console.log(`  ├─ Signups:       ${totalReg}`);
  console.log(`  ├─ Paid (all):    ${orders.length}`);
  console.log(`  └─ Conversion:    ${convRate}% (target: 3%)`);
  console.log('');

  const metaDateEnd = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const metaDateStart = new Date(CAMPAIGN_START).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  console.log(`  META ADS (${metaDateStart} – ${metaDateEnd})`);
  let metaSpendNum = 0;
  if (metaInsights) {
    metaSpendNum = parseFloat(metaInsights.spend || 0);
    const spend = metaSpendNum.toFixed(2);
    const impressions = parseInt(metaInsights.impressions || 0).toLocaleString('en');
    const clicks = parseInt(metaInsights.clicks || 0).toLocaleString('en');
    const ctr = parseFloat(metaInsights.ctr || 0).toFixed(2);
    const cpm = parseFloat(metaInsights.cpm || 0).toFixed(2);
    console.log(`  ├─ Spend:       €${spend}`);
    console.log(`  ├─ Impressions: ${impressions}`);
    console.log(`  ├─ Clicks:      ${clicks}`);
    console.log(`  ├─ CTR:         ${ctr}%`);
    console.log(`  └─ CPM:         €${cpm}`);
  } else {
    console.log('  └─ (no data — check META_SYSTEM_USER_ACCESS_TOKEN / META_AD_ACCOUNT_ID)');
  }

  console.log('');
  console.log(`  LINKEDIN ADS (${metaDateStart} – ${metaDateEnd})`);
  let linkedInSpendNum = 0;
  if (linkedInAds && linkedInAds.source !== 'error' && typeof linkedInAds.spend === 'number') {
    linkedInSpendNum = linkedInAds.spend;
    const liSpend = linkedInSpendNum.toFixed(2);
    if (linkedInAds.source === 'api') {
      console.log(`  ├─ Spend:       €${liSpend}`);
      console.log(
        `  ├─ Impressions: ${parseInt(String(linkedInAds.impressions ?? 0), 10).toLocaleString('en')}`,
      );
      console.log(`  ├─ Clicks:      ${parseInt(String(linkedInAds.clicks ?? 0), 10).toLocaleString('en')}`);
      console.log('  └─ Source:      Marketing API');
    } else {
      console.log(`  ├─ Spend:       €${liSpend}`);
      console.log(`  └─ Source:      ${linkedInAds.source}`);
    }
  } else if (linkedInAds?.source === 'error') {
    console.log(`  └─ API error: ${linkedInAds.error || 'unknown'}`);
  } else {
    console.log(
      '  └─ (not configured — auth-ads token or LINKEDIN_ADS_ACCESS_TOKEN + account URN, or LINKEDIN_ADS_SPEND_EUR)',
    );
  }

  const totalAdsSpend = metaSpendNum + linkedInSpendNum;
  const contribution = periodTicketRevenue - totalAdsSpend;
  const marginPct =
    periodTicketRevenue > 0 ? ((contribution / periodTicketRevenue) * 100).toFixed(1) : null;

  const metaSpendLabel = metaInsights
    ? `€${metaSpendNum.toFixed(2)}`
    : '— (not loaded; €0 in total)';
  const linkedInSpendLabel =
    linkedInAds && linkedInAds.source !== 'error' && typeof linkedInAds.spend === 'number'
      ? `€${linkedInSpendNum.toFixed(2)}`
      : '— (not loaded; €0 in total)';
  const totalAdsLabel = `€${totalAdsSpend.toFixed(2)}`;

  console.log('');
  console.log('  GROSS MARGIN (contribution uses Total Revenues ex-VAT; same window as ads above)');
  console.log(
    `  ├─ Total charged:    €${periodTotalCharged} (${ordersInMetaWindow.length} paid since ${CAMPAIGN_START}; incl. taxes)`,
  );
  console.log(`  ├─ Total revenues:   €${periodTicketRevenue} (excl. taxes)`);
  console.log(`  ├─ Meta spend:       ${metaSpendLabel}`);
  console.log(`  ├─ LinkedIn spend:   ${linkedInSpendLabel}`);
  console.log(`  ├─ Total paid ads:   ${totalAdsLabel}`);
  console.log(`  ├─ Contribution:     €${contribution.toFixed(2)}  (Total Revenues minus paid ads above)`);
  console.log(
    `  └─ Gross margin:     ${marginPct !== null ? `${marginPct}%` : '— (no period revenues)'}  (contribution ÷ Total Revenues)`,
  );
  console.log('');

  const alerts = [];
  if (parseFloat(convRate) < 2) {
    alerts.push('⚠️  Conversion below 2% — check funnel with analytics.mjs');
  }
  if (parseFloat(convRate) === 0 && totalReg > 0 && orders.length === 0) {
    alerts.push('⚠️  Signups but no paid orders yet — review checkout and follow-up');
  }

  for (const w of upcoming) {
    const wOrders = orders.filter((o) => o.workshop_slug === w.slug);
    const spotsLeft = CAPACITY - wOrders.length;
    const daysLeft = Math.max(0, Math.ceil((new Date(w.dateIso) - now) / (1000 * 60 * 60 * 24)));
    const { proMix } = summarizeOrders(wOrders);
    if (spotsLeft <= 10 && spotsLeft > 0) {
      alerts.push(`⚠️  ${w.displayDate}: only ${spotsLeft} spots left — urgency push (${w.slug})`);
    }
    if (spotsLeft <= 0) {
      alerts.push(`🔴 ${w.displayDate}: SOLD OUT (${w.slug})`);
    }
    if (wOrders.length > 0 && parseInt(proMix, 10) < 40) {
      alerts.push(`⚠️  ${w.displayDate}: Pro mix ${proMix}% — promote Pro tier`);
    }
    if (daysLeft <= 7 && daysLeft > 1) {
      alerts.push(`📧 ${w.displayDate}: ${daysLeft} days — run send-reminders.mjs for paid attendees`);
    }
    if (daysLeft === 1) {
      alerts.push(`📧 ${w.displayDate}: tomorrow — send-reminders.mjs --type=dayBefore`);
    }
    if (daysLeft === 0) {
      alerts.push(`📧 ${w.displayDate}: TODAY — send-reminders.mjs --type=dayOf`);
    }
  }

  if (alerts.length > 0) {
    console.log('  ACTIONS NEEDED');
    for (const a of alerts) console.log(`  ${a}`);
    console.log('');
  }

  console.log('  NEXT COMMANDS');
  console.log('  node --env-file=.env scripts/analytics.mjs                              # PostHog funnel');
  console.log('  node --env-file=.env scripts/stripe-report.mjs                          # Stripe by workshop');
  console.log('  node --env-file=.env scripts/meta-ads/index.mjs campaigns list --pretty   # Meta Ads');
  console.log('  node --env-file=.env scripts/send-reminders.mjs                         # Email attendees');
  console.log('  ./scripts/deploy.sh "message"                                            # Deploy');
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
