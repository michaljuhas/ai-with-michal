#!/usr/bin/env node
/**
 * Meta Ads performance report
 * Usage: node --env-file=.env scripts/meta-ads-stats.mjs
 */

import { createClient } from './meta-ads/client.mjs';
import { listCampaigns } from './meta-ads/campaigns.mjs';
import { getInsights } from './meta-ads/insights.mjs';
import { CAMPAIGN_START } from './config.mjs';

const TOKEN = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const TODAY = new Date().toISOString().slice(0, 10);

if (!TOKEN || !ACCOUNT_ID) {
  console.error('Missing META_SYSTEM_USER_ACCESS_TOKEN or META_AD_ACCOUNT_ID');
  process.exit(1);
}

const INSIGHT_FIELDS = 'impressions,clicks,spend,cpm,ctr,actions,cost_per_action_type';

function fmt(n, decimals = 2) {
  return Number(n ?? 0).toFixed(decimals);
}

function fmtCurrency(n) {
  return `€${fmt(n)}`;
}

function findAction(actions = [], type) {
  return actions.find(a => a.action_type === type)?.value ?? '0';
}

async function main() {
  const client = createClient(TOKEN, ACCOUNT_ID);

  const labelStart = new Date(CAMPAIGN_START).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const labelEnd = new Date(TODAY).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║   META ADS PERFORMANCE (${labelStart} – ${labelEnd})`.padEnd(51) + '║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Fetch all campaigns (ACTIVE + PAUSED) to give full picture
  const [activeCampaigns, pausedCampaigns] = await Promise.all([
    listCampaigns(client, { status: 'ACTIVE' }),
    listCampaigns(client, { status: 'PAUSED' }),
  ]);

  const active = activeCampaigns.data ?? [];
  const paused = pausedCampaigns.data ?? [];
  const all = [...active, ...paused];

  console.log(`  Campaigns: ${active.length} active, ${paused.length} paused\n`);

  if (all.length === 0) {
    console.log('  No campaigns found.\n');
    return;
  }

  // Fetch insights since campaign start for all campaigns in parallel
  const insightResults = await Promise.all(
    all.map(async (campaign) => {
      const sinceStart = await getInsights(client, campaign.id, {
        since: CAMPAIGN_START, until: TODAY, level: 'campaign', fields: INSIGHT_FIELDS,
      });
      return { campaign, sinceStart: sinceStart[0] ?? null };
    })
  );

  // Summary totals (since campaign start, active campaigns only)
  const totalSpend = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.sinceStart?.spend ?? 0), 0);
  const totalImpressions = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.sinceStart?.impressions ?? 0), 0);
  const totalClicks = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.sinceStart?.clicks ?? 0), 0);

  if (active.length > 0) {
    console.log(`  ACTIVE CAMPAIGNS — SINCE LAUNCH (${labelStart})`);
    console.log(`  ├─ Total spend:       ${fmtCurrency(totalSpend)}`);
    console.log(`  ├─ Total impressions: ${totalImpressions.toLocaleString()}`);
    console.log(`  └─ Total clicks:      ${totalClicks.toLocaleString()}`);
    console.log('');
  }

  // Per-campaign breakdown
  for (const { campaign, sinceStart } of insightResults) {
    const isActive = !!active.find(c => c.id === campaign.id);
    const statusLabel = isActive ? '🟢 ACTIVE' : '⏸  PAUSED';

    console.log(`  ─────────────────────────────────────────────────`);
    console.log(`  ${statusLabel}  ${campaign.name}`);
    console.log(`  ID: ${campaign.id}  |  Objective: ${campaign.objective}`);
    console.log('');

    if (!sinceStart) {
      console.log('  No performance data available.\n');
      continue;
    }

    const ctr = fmt(sinceStart.ctr, 2);
    const cpm = fmtCurrency(sinceStart.cpm);
    const spend = fmtCurrency(sinceStart.spend);
    const clicks = Number(sinceStart.clicks ?? 0).toLocaleString();
    const impressions = Number(sinceStart.impressions ?? 0).toLocaleString();
    const leads = findAction(sinceStart.actions, 'lead');
    const purchases = findAction(sinceStart.actions, 'purchase');

    console.log(`  Since launch (${labelStart}–${labelEnd}):`);
    console.log(`  ├─ Spend:       ${spend}`);
    console.log(`  ├─ Impressions: ${impressions}  |  CPM: ${cpm}`);
    console.log(`  ├─ Clicks:      ${clicks}  |  CTR: ${ctr}%`);
    if (Number(leads) > 0)     console.log(`  ├─ Leads:       ${leads}`);
    if (Number(purchases) > 0) console.log(`  ├─ Purchases:   ${purchases}`);

    // Evaluation
    const spend7d = Number(sinceStart?.spend ?? 0);
    const ctr7d = Number(sinceStart?.ctr ?? 0);
    const leads7d = Number(findAction(sinceStart?.actions, 'lead'));
    const purchases7d = Number(findAction(sinceStart?.actions, 'purchase'));

    const alerts = [];
    if (isActive && spend7d === 0)   alerts.push('⚠️  Active but no spend in 7d — check budget/schedule');
    if (isActive && ctr7d < 0.5)    alerts.push('⚠️  CTR < 0.5% — ad creative may need refresh');
    if (isActive && ctr7d > 3)      alerts.push('✅ CTR > 3% — strong engagement');
    if (isActive && spend7d > 0 && leads7d === 0 && purchases7d === 0)
      alerts.push('⚠️  Spend with no leads/purchases — check conversion tracking or landing page');
    if (isActive && purchases7d > 0) alerts.push(`✅ ${purchases7d} purchase(s) tracked — campaign converting`);

    if (alerts.length > 0) {
      console.log('');
      for (const a of alerts) console.log(`  ${a}`);
    }

    console.log('');
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
