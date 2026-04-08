#!/usr/bin/env node
/**
 * Launch a Meta Ads campaign for the LinkedIn Sourcing Tools creative.
 *
 * Uses /public/images/linkedin-sourcing-tools.jpeg (single image, uploaded once).
 * Runs 6 ad variations: 2 headline variants × 3 primary text variants.
 * CTA: LEARN_MORE (not SIGN_UP).
 * Otherwise identical settings to launch-campaign.mjs.
 *
 * Usage:
 *   node --env-file=.env scripts/launch-linkedin-sourcing.mjs
 *   node --env-file=.env scripts/launch-linkedin-sourcing.mjs --dry-run
 *   node --env-file=.env scripts/launch-linkedin-sourcing.mjs --budget 2000  # €20/day
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TOKEN = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
const RAW_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID ?? '';
const ACCOUNT_ID = RAW_ACCOUNT_ID.replace(/^act_/, '');

const BASE_URL = 'https://graph.facebook.com/v25.0';

const WEBSITE_URL = 'https://aiwithmichal.com';
const URL_TAGS = 'utm_source=Meta&utm_medium={{placement}}&utm_campaign={{campaign.name}}&utm_content={{adset.name}}&utm_term={{ad.name}}';

const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  'GB', 'CH', 'NO',
];

const WORKSHOP_END_UNIX = Math.floor(new Date('2026-04-02T15:30:00Z').getTime() / 1000);

const CAMPAIGN_FOLDER = 'campaigns/2026-03-28-linkedin-sourcing';
const IMAGE_PATH = join(ROOT, 'public/images/linkedin-sourcing-tools.jpeg');
const IMAGE_FILENAME = 'linkedin-sourcing-tools.jpeg';

function log(msg) {
  process.stdout.write(`[launch-linkedin-sourcing] ${msg}\n`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };
  return {
    dryRun: args.includes('--dry-run'),
    dailyBudget: get('--budget') ? parseInt(get('--budget'), 10) : 1000,
  };
}

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

async function uploadJpeg(buffer, filename) {
  const form = new FormData();
  form.append(filename, new Blob([buffer], { type: 'image/jpeg' }), filename);

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
  if (!page) throw new Error('No Facebook page found.');
  log(`Page: "${page.name}" (${page.id})`);
  return page.id;
}

async function getPixelId() {
  const data = await apiGet(`/act_${ACCOUNT_ID}/adspixels?fields=id,name`);
  const pixel = data.data?.[0];
  if (!pixel) throw new Error('No Meta Pixel found.');
  log(`Pixel: "${pixel.name}" (${pixel.id})`);
  return pixel.id;
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error('[launch-linkedin-sourcing] Error: META_SYSTEM_USER_ACCESS_TOKEN and META_AD_ACCOUNT_ID must be set.');
    process.exit(1);
  }

  const { dryRun, dailyBudget } = parseArgs();

  // Load copy
  const copy = JSON.parse(readFileSync(join(ROOT, CAMPAIGN_FOLDER, 'copy.json'), 'utf8'));
  log(`Copy loaded — ${copy.headlines.length} variations`);

  // Load image
  const imageBuffer = readFileSync(IMAGE_PATH);
  log(`Image: ${IMAGE_FILENAME} (${Math.round(imageBuffer.length / 1024)} KB)`);

  if (dryRun) {
    log('');
    log('--- DRY RUN — nothing will be created ---');
    log(`Campaign:  "Workshop – linkedin-sourcing-tools"  (OUTCOME_SALES, PAUSED)`);
    log(`Ad Set:    daily budget €${(dailyBudget / 100).toFixed(2)}, EU only, age 25–45, ends Apr 2 2026`);
    log(`CTA:       LEARN_MORE`);
    log(`Website URL:    ${WEBSITE_URL}`);
    log(`Image:     ${IMAGE_FILENAME}`);
    log(`${copy.headlines.length} ad variations:`);
    for (let i = 0; i < copy.headlines.length; i++) {
      log(`  v${i + 1}: "${copy.headlines[i]}" | "${copy.primary_texts[i].slice(0, 70)}…"`);
    }
    log('');
    log('Re-run without --dry-run to create.');
    return;
  }

  const [pageId, pixelId] = await Promise.all([getPageId(), getPixelId()]);

  // Campaign
  log('Creating campaign...');
  const campaign = await apiPost(`/act_${ACCOUNT_ID}/campaigns`, {
    name: 'Workshop – linkedin-sourcing-tools',
    objective: 'OUTCOME_SALES',
    status: 'PAUSED',
    special_ad_categories: [],
    is_adset_budget_sharing_enabled: false,
  });
  log(`  id: ${campaign.id}`);

  // Ad Set
  log('Creating ad set...');
  const adSet = await apiPost(`/act_${ACCOUNT_ID}/adsets`, {
    name: 'Ad Set – linkedin-sourcing-tools',
    campaign_id: campaign.id,
    daily_budget: dailyBudget,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'OFFSITE_CONVERSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    promoted_object: {
      pixel_id: pixelId,
      custom_event_type: 'PURCHASE',
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

  // Upload image once
  log('Uploading image...');
  const imageHash = await uploadJpeg(imageBuffer, IMAGE_FILENAME);
  log(`  ${IMAGE_FILENAME} → ${imageHash}`);

  // Create 6 creatives + ads
  log(`Creating ${copy.headlines.length} creatives and ads...`);
  const createdAds = [];

  for (let i = 0; i < copy.headlines.length; i++) {
    const headline = copy.headlines[i];
    const primaryText = copy.primary_texts[i];
    const varLabel = `v${i + 1}`;

    const creative = await apiPost(`/act_${ACCOUNT_ID}/adcreatives`, {
      name: `Creative – linkedin-sourcing – ${varLabel}`,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          image_hash: imageHash,
          link: WEBSITE_URL,
          message: primaryText,
          name: headline,
          call_to_action: {
            type: 'LEARN_MORE',
            value: { link: WEBSITE_URL },
          },
        },
      },
      url_tags: URL_TAGS,
    });

    const ad = await apiPost(`/act_${ACCOUNT_ID}/ads`, {
      name: `Ad – linkedin-sourcing – ${varLabel}`,
      adset_id: adSet.id,
      creative: { creative_id: creative.id },
      status: 'PAUSED',
      tracking_specs: [
        { 'action.type': ['offsite_conversion'], fb_pixel: [pixelId] },
      ],
    });

    log(`  ${ad.id}  ← ${varLabel}: "${headline}"`);
    createdAds.push(ad.id);
  }

  log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('All done — everything is PAUSED.');
  log('Review + activate: https://adsmanager.facebook.com/');
  log(`  Campaign ID : ${campaign.id}`);
  log(`  Ad Set ID   : ${adSet.id}`);
  log(`  Ad IDs      : ${createdAds.join(', ')}`);
  log('');
  log(`${createdAds.length} ads created — 1 image × ${createdAds.length} copy variations.`);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch((err) => {
  console.error(`[launch-linkedin-sourcing] Fatal: ${err.message}`);
  process.exit(1);
});
