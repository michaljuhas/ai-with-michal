#!/usr/bin/env node
/**
 * Launch a Meta Ads campaign from the most recent (or specified) campaign assets folder.
 *
 * Full flow:
 *   1. Create campaign  (OUTCOME_SALES, PAUSED)
 *   2. Create ad set    (EU countries, 25–45, pixel tracking via OFFSITE_CONVERSIONS)
 *   3. Upload 4 images  (square-1, square-2, portrait-1, portrait-2)
 *   4. Create 4 creatives + 4 ads — one per image, each seeded with headline[0] + primary_text[0]
 *   5. Print all remaining copy variations → paste them into Ads Manager's "Add another option"
 *
 * Usage:
 *   node --env-file=.env scripts/launch-campaign.mjs
 *   node --env-file=.env scripts/launch-campaign.mjs --folder campaigns/2026-03-19-21-13
 *   node --env-file=.env scripts/launch-campaign.mjs --dry-run
 *   node --env-file=.env scripts/launch-campaign.mjs --budget 2000   # €20/day (in cents)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TOKEN = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
const RAW_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID ?? '';
const ACCOUNT_ID = RAW_ACCOUNT_ID.replace(/^act_/, '');

const BASE_URL = 'https://graph.facebook.com/v25.0';

// Landing page — clean URL, no UTM params here
const WEBSITE_URL = 'https://aiwithmichal.com';
// URL parameters field (Tracking section in Ads Manager) — Meta resolves {{...}} at serve time
const URL_TAGS = 'utm_source=Meta&utm_medium={{placement}}&utm_campaign={{campaign.name}}&utm_content={{adset.name}}&utm_term={{ad.name}}';

// Instagram + Threads identity (michal.juhas.life) is resolved automatically by Meta
// from the page's connected accounts — no explicit actor ID needed in the creative.
// Both Instagram Feed/Stories and Threads placements will show as michal.juhas.life.

// EU27 + common associated European markets
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  'GB', 'CH', 'NO', // UK + Switzerland + Norway
];

// Workshop ends Apr 2 2026 15:00 UTC
const WORKSHOP_END_UNIX = Math.floor(new Date('2026-04-02T15:00:00Z').getTime() / 1000);

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function log(msg) {
  process.stdout.write(`[launch-campaign] ${msg}\n`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };
  return {
    folder: get('--folder'),
    dryRun: args.includes('--dry-run'),
    dailyBudget: get('--budget') ? parseInt(get('--budget'), 10) : 1000,
  };
}

function findMostRecentFolder() {
  const dir = join(ROOT, 'campaigns');
  const folders = readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(f))
    .sort()
    .reverse();
  if (folders.length === 0) throw new Error('No campaign folders found in campaigns/');
  return join(dir, folders[0]);
}

// ---------------------------------------------------------------------------
// Meta API
// ---------------------------------------------------------------------------

async function apiGet(path) {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}${path}${sep}access_token=${TOKEN}`);
  const data = await res.json();
  if (data.error) throw new Error(`[${data.error.code}] ${data.error.message}`);
  return data;
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Meta API returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }
  if (data.error) throw new Error(`[${data.error.code}/${data.error.error_subcode ?? ''}] ${data.error.message}`);
  return data;
}

async function uploadImage(buffer, filename) {
  const form = new FormData();
  form.append(filename, new Blob([buffer], { type: 'image/png' }), filename);

  const res = await fetch(`${BASE_URL}/act_${ACCOUNT_ID}/adimages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  });
  const data = await res.json();
  if (data.error) throw new Error(`[${data.error.code}] ${data.error.message}`);

  const entry = data.images?.[filename] ?? Object.values(data.images ?? {})[0];
  if (!entry?.hash) throw new Error(`No image hash for ${filename}: ${JSON.stringify(data)}`);
  return entry.hash;
}

async function getPageId() {
  const data = await apiGet('/me/accounts?fields=id,name');
  const page = data.data?.[0];
  if (!page) throw new Error('No Facebook page found. Ensure the token has pages_manage_ads permission.');
  log(`Page: "${page.name}" (${page.id})`);
  return page.id;
}

async function getPixelId() {
  const data = await apiGet(`/act_${ACCOUNT_ID}/adspixels?fields=id,name`);
  const pixel = data.data?.[0];
  if (!pixel) throw new Error('No Meta Pixel found. Create one in Events Manager first.');
  log(`Pixel: "${pixel.name}" (${pixel.id})`);
  return pixel.id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error('[launch-campaign] Error: META_SYSTEM_USER_ACCESS_TOKEN and META_AD_ACCOUNT_ID must be set.');
    process.exit(1);
  }

  const { folder, dryRun, dailyBudget } = parseArgs();

  // Resolve assets folder
  const campaignDir = folder ? join(ROOT, folder) : findMostRecentFolder();
  const folderName = campaignDir.split('/').pop();
  log(`Campaign assets: campaigns/${folderName}/`);

  // Load copy
  const copy = JSON.parse(readFileSync(join(campaignDir, 'copy.json'), 'utf8'));
  log(`Copy loaded — ${copy.headlines.length} headlines, ${copy.primary_texts.length} primary texts`);

  // Load images — only those that actually exist in the campaign folder
  const imageFiles = ['square-1.png', 'square-2.png', 'portrait-1.png', 'portrait-2.png']
    .filter((f) => existsSync(join(campaignDir, f)));
  if (imageFiles.length === 0) throw new Error('No image files found in campaign folder.');
  log(`Images found: ${imageFiles.join(', ')}`);
  const imageBuffers = Object.fromEntries(
    imageFiles.map((f) => [f, readFileSync(join(campaignDir, f))]),
  );

  // Dry-run preview
  if (dryRun) {
    log('');
    log('--- DRY RUN — nothing will be created ---');
    log(`Campaign:  "Workshop – ${folderName}"  (OUTCOME_LEADS, PAUSED)`);
    log(`Ad Set:    daily budget €${(dailyBudget / 100).toFixed(2)}, EU only, age 25–45, ends Apr 2 2026`);
    log(`Website URL:    ${WEBSITE_URL}`);
    log(`URL parameters: ${URL_TAGS}`);
    log(`Instagram/Threads: michal.juhas.life (resolved via page connection)`);
    log(`Images (${imageFiles.length}) × ${copy.headlines.length} copy variations = ${imageFiles.length * copy.headlines.length} ads:`);
    let adNum = 0;
    for (const f of imageFiles) {
      for (let i = 0; i < copy.headlines.length; i++) {
        adNum++;
        log(`  Ad ${adNum}: ${f}  |  "${copy.headlines[i]}"  |  "${copy.primary_texts[i].slice(0, 60)}…"`);
      }
    }
    log('');
    log('Re-run without --dry-run to create.');
    return;
  }

  // Prefetch page + pixel
  const [pageId, pixelId] = await Promise.all([getPageId(), getPixelId()]);

  // ---- Step 1: Campaign ------------------------------------------------
  log('Creating campaign...');
  const campaign = await apiPost(`/act_${ACCOUNT_ID}/campaigns`, {
    name: `Workshop – ${folderName}`,
    objective: 'OUTCOME_LEADS',
    status: 'PAUSED',
    special_ad_categories: [],
    is_adset_budget_sharing_enabled: false,
  });
  log(`  id: ${campaign.id}`);

  // ---- Step 2: Ad Set --------------------------------------------------
  log('Creating ad set...');
  const adSet = await apiPost(`/act_${ACCOUNT_ID}/adsets`, {
    name: `Ad Set – ${folderName}`,
    campaign_id: campaign.id,
    daily_budget: dailyBudget,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'OFFSITE_CONVERSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    promoted_object: {
      pixel_id: pixelId,
      custom_event_type: 'LEAD',
    },
    targeting: {
      geo_locations: { countries: EU_COUNTRIES },
      age_min: 25,
      age_max: 45,
      targeting_automation: { advantage_audience: 0 },
    },
    end_time: WORKSHOP_END_UNIX,
    status: 'PAUSED',
  });
  log(`  id: ${adSet.id}`);

  // ---- Step 3: Upload images -------------------------------------------
  log('Uploading images...');
  const imageHashes = {};
  for (const filename of imageFiles) {
    const hash = await uploadImage(imageBuffers[filename], filename);
    imageHashes[filename] = hash;
    log(`  ${filename} → ${hash}`);
  }

  // ---- Step 4: Creatives + Ads ----------------------------------------
  // One creative + ad per (image, copy variation) combination.
  // Each ad gets its own unique headline + primary text.
  const totalAds = imageFiles.length * copy.headlines.length;
  log(`Creating creatives and ads (${totalAds} ads — ${imageFiles.length} images × ${copy.headlines.length} copy variations)...`);
  const createdAds = [];

  for (const filename of imageFiles) {
    for (let i = 0; i < copy.headlines.length; i++) {
      const headline = copy.headlines[i];
      const primaryText = copy.primary_texts[i];
      const varLabel = `v${i + 1}`;

      const creative = await apiPost(`/act_${ACCOUNT_ID}/adcreatives`, {
        name: `Creative – ${filename.replace('.png', '')} – ${varLabel} – ${folderName}`,
        object_story_spec: {
          page_id: pageId,
          // instagram_user_id omitted — Meta resolves michal.juhas.life automatically
          // from the page's connected Instagram/Threads account for all placements.
          link_data: {
            image_hash: imageHashes[filename],
            link: WEBSITE_URL,
            message: primaryText,
            name: headline,
            call_to_action: {
              type: 'SIGN_UP',
              value: { link: WEBSITE_URL },
            },
          },
        },
        // "URL parameters" field in Ads Manager Tracking section — Meta resolves {{...}} at serve time
        url_tags: URL_TAGS,
        tracking_specs: [
          { 'action.type': ['offsite_conversion'], fb_pixel: [pixelId] },
        ],
      });

      const ad = await apiPost(`/act_${ACCOUNT_ID}/ads`, {
        name: `Ad – ${filename.replace('.png', '')} – ${varLabel} – ${folderName}`,
        adset_id: adSet.id,
        creative: { creative_id: creative.id },
        status: 'PAUSED',
        tracking_specs: [
          { 'action.type': ['offsite_conversion'], fb_pixel: [pixelId] },
        ],
      });

      log(`  ${ad.id}  ← ${filename} + ${varLabel}: "${headline}"`);
      createdAds.push(ad.id);
    }
  }

  log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('All done — everything is PAUSED.');
  log('Review + activate: https://adsmanager.facebook.com/');
  log(`  Campaign ID : ${campaign.id}`);
  log(`  Ad Set ID   : ${adSet.id}`);
  log(`  Ad IDs      : ${createdAds.join(', ')}`);
  log('');
  log(`${totalAds} ads created — each with its own image + headline + primary text.`);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch((err) => {
  console.error(`[launch-campaign] Fatal: ${err.message}`);
  process.exit(1);
});
