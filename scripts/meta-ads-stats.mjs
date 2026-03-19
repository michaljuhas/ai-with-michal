#!/usr/bin/env node
/**
 * Meta Ads performance report
 * Usage: node --env-file=.env scripts/meta-ads-stats.mjs
 */

import { createClient } from './meta-ads/client.mjs';
import { listCampaigns } from './meta-ads/campaigns.mjs';
import { getInsights } from './meta-ads/insights.mjs';

const TOKEN = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

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

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║         META ADS PERFORMANCE REPORT              ║');
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

  // Fetch last-7d and last-30d insights for all campaigns in parallel
  const insightResults = await Promise.all(
    all.map(async (campaign) => {
      const [last7d, last30d] = await Promise.all([
        getInsights(client, campaign.id, { preset: 'last_7d', level: 'campaign', fields: INSIGHT_FIELDS }),
        getInsights(client, campaign.id, { preset: 'last_30d', level: 'campaign', fields: INSIGHT_FIELDS }),
      ]);
      return { campaign, last7d: last7d[0] ?? null, last30d: last30d[0] ?? null };
    })
  );

  // Summary totals (last 7d across all active campaigns)
  const totalSpend7d = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.last7d?.spend ?? 0), 0);
  const totalImpressions7d = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.last7d?.impressions ?? 0), 0);
  const totalClicks7d = insightResults
    .filter(r => active.find(c => c.id === r.campaign.id))
    .reduce((sum, r) => sum + Number(r.last7d?.clicks ?? 0), 0);

  if (active.length > 0) {
    console.log('  ACTIVE CAMPAIGNS — LAST 7 DAYS SUMMARY');
    console.log(`  ├─ Total spend:       ${fmtCurrency(totalSpend7d)}`);
    console.log(`  ├─ Total impressions: ${totalImpressions7d.toLocaleString()}`);
    console.log(`  └─ Total clicks:      ${totalClicks7d.toLocaleString()}`);
    console.log('');
  }

  // Per-campaign breakdown
  for (const { campaign, last7d, last30d } of insightResults) {
    const isActive = !!active.find(c => c.id === campaign.id);
    const statusLabel = isActive ? '🟢 ACTIVE' : '⏸  PAUSED';

    console.log(`  ─────────────────────────────────────────────────`);
    console.log(`  ${statusLabel}  ${campaign.name}`);
    console.log(`  ID: ${campaign.id}  |  Objective: ${campaign.objective}`);
    console.log('');

    if (!last7d && !last30d) {
      console.log('  No performance data available.\n');
      continue;
    }

    // 7-day stats
    if (last7d) {
      const ctr7d = fmt(last7d.ctr, 2);
      const cpm7d = fmtCurrency(last7d.cpm);
      const spend7d = fmtCurrency(last7d.spend);
      const clicks7d = Number(last7d.clicks ?? 0).toLocaleString();
      const impressions7d = Number(last7d.impressions ?? 0).toLocaleString();
      const leads7d = findAction(last7d.actions, 'lead');
      const purchases7d = findAction(last7d.actions, 'purchase');

      console.log('  Last 7 days:');
      console.log(`  ├─ Spend:       ${spend7d}`);
      console.log(`  ├─ Impressions: ${impressions7d}  |  CPM: ${cpm7d}`);
      console.log(`  ├─ Clicks:      ${clicks7d}  |  CTR: ${ctr7d}%`);
      if (Number(leads7d) > 0)    console.log(`  ├─ Leads:       ${leads7d}`);
      if (Number(purchases7d) > 0) console.log(`  ├─ Purchases:   ${purchases7d}`);
    } else {
      console.log('  Last 7 days:  no data');
    }

    // 30-day stats
    if (last30d) {
      const spend30d = fmtCurrency(last30d.spend);
      const clicks30d = Number(last30d.clicks ?? 0).toLocaleString();
      const ctr30d = fmt(last30d.ctr, 2);
      const leads30d = findAction(last30d.actions, 'lead');
      const purchases30d = findAction(last30d.actions, 'purchase');

      console.log('  Last 30 days:');
      console.log(`  ├─ Spend:       ${spend30d}`);
      console.log(`  ├─ Clicks:      ${clicks30d}  |  CTR: ${ctr30d}%`);
      if (Number(leads30d) > 0)    console.log(`  ├─ Leads:       ${leads30d}`);
      if (Number(purchases30d) > 0) console.log(`  ├─ Purchases:   ${purchases30d}`);
    } else {
      console.log('  Last 30 days: no data');
    }

    // Evaluation
    const spend7d = Number(last7d?.spend ?? 0);
    const ctr7d = Number(last7d?.ctr ?? 0);
    const leads7d = Number(findAction(last7d?.actions, 'lead'));
    const purchases7d = Number(findAction(last7d?.actions, 'purchase'));

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
