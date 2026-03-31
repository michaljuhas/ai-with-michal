/**
 * Creates the two inbound LemList campaigns (workshop + integration) and
 * prints the campaign IDs to set in .env.
 *
 * Usage: node --env-file=.env scripts/setup-inbound-campaigns.mjs
 *
 * Note: Email sequence steps must be added manually in the LemList UI.
 * The email copy is in campaigns/inbound-sequences.md.
 */

import { createClient } from './lemlist/client.mjs';

const apiKey = process.env.LEMLIST_API_KEY;
if (!apiKey) {
  console.error('Error: LEMLIST_API_KEY is not set.');
  process.exit(1);
}

const client = createClient(apiKey);

async function createCampaign(name) {
  const result = await client.request({
    method: 'POST',
    path: '/campaigns',
    body: { name },
  });
  return result;
}

async function main() {
  const workshopName = 'Inbound - Workshops for Teams';
  const integrationName = 'Inbound - AI Integrations';

  console.log('Creating inbound campaigns in LemList...\n');

  let workshopCampaign, integrationCampaign;

  try {
    workshopCampaign = await createCampaign(workshopName);
    console.log(`✓ Created: "${workshopName}"`);
    console.log(`  ID: ${workshopCampaign._id}`);
  } catch (err) {
    console.error(`✗ Failed to create workshop campaign: ${err.message}`);
    process.exit(1);
  }

  try {
    integrationCampaign = await createCampaign(integrationName);
    console.log(`✓ Created: "${integrationName}"`);
    console.log(`  ID: ${integrationCampaign._id}`);
  } catch (err) {
    console.error(`✗ Failed to create integration campaign: ${err.message}`);
    process.exit(1);
  }

  console.log('\n─────────────────────────────────────────────────────────');
  console.log('Add these to your .env file:\n');
  console.log(`LEMLIST_INBOUND_WORKSHOP_CAMPAIGN_ID=${workshopCampaign._id}`);
  console.log(`LEMLIST_INBOUND_INTEGRATION_CAMPAIGN_ID=${integrationCampaign._id}`);
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nNext: add email steps in the LemList UI using the copy in:');
  console.log('  campaigns/inbound-sequences.md\n');
}

main();
