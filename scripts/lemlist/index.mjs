import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

import { createClient } from './client.mjs';
import { printOutput, printError } from './format.mjs';
import { listCampaigns, getCampaign, createCampaign, duplicateCampaign, startCampaign, pauseCampaign, getCampaignStats, getCampaignReports } from './campaigns.mjs';
import { listLeads, getLead, createLead, updateLead, deleteLead, pauseLead, resumeLead, markLeadInterested, markLeadNotInterested } from './leads.mjs';
import { upsertContact, listContacts, getContact } from './contacts.mjs';
import { listActivities } from './activities.mjs';
import { listUnsubscribes, addUnsubscribe, removeUnsubscribe } from './unsubscribes.mjs';
import { listWebhooks, createWebhook, deleteWebhook } from './webhooks.mjs';
import { getTeam, getTeamCredits, getTeamSenders } from './team.mjs';
import { listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule } from './schedules.mjs';

export const USAGE = `Lemlist CLI — wrapper for the Lemlist API

Usage: node --env-file=.env scripts/lemlist/index.mjs <resource> <subcommand> [flags]

Resources:
  campaigns list [--status <s>] [--sort-by <f>] [--sort-order asc|desc] [--created-by <id>] [--limit N] [--offset N]
  campaigns get <campaign-id>
  campaigns create --name <name>
  campaigns duplicate <campaign-id>
  campaigns start <campaign-id>
  campaigns pause <campaign-id>
  campaigns stats <campaign-id> [--from <date>] [--to <date>]
  campaigns reports <campaign-id>

  leads list --campaign-id <id> [--limit N] [--offset N]
  leads get <email>
  leads create --campaign-id <id> --email <email> [--first-name <n>] [--last-name <n>] [--company-name <n>] [--job-title <t>] [--linkedin-url <u>] [--phone <p>] [--deduplicate]
  leads update <lead-id> --campaign-id <id> [--first-name <n>] [--last-name <n>] [--company-name <n>] [--job-title <t>] [--linkedin-url <u>] [--phone <p>]
  leads delete <lead-id> --campaign-id <id>
  leads pause <lead-id> --campaign-id <id>
  leads resume <lead-id> --campaign-id <id>
  leads interested <lead-id> --campaign-id <id>
  leads not-interested <lead-id> --campaign-id <id>

  contacts upsert --json <json> | --file <path>
  contacts list [--limit N] [--offset N]
  contacts get <contact-id>

  activities list [--type <t>] [--campaign-id <id>] [--lead-id <id>] [--limit N] [--offset N]

  unsubscribes list [--limit N] [--offset N]
  unsubscribes add --email <email>
  unsubscribes remove --email <email>

  webhooks list
  webhooks create --url <url> [--events <type1,type2>]
  webhooks delete <hook-id>

  team info
  team credits
  team senders

  schedules list
  schedules get <schedule-id>
  schedules create --json <json> | --file <path>
  schedules update <schedule-id> --json <json> | --file <path>
  schedules delete <schedule-id>

Global flags:
  --pretty    Human-readable output (default: compact JSON)
  --help, -h  Show this help

Environment variables:
  LEMLIST_API_KEY  Required for all commands
`;

function buildQuery(obj) {
  const q = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== false) q[k] = v;
  }
  return q;
}

function parseJsonInput(values) {
  if (values.json) return JSON.parse(values.json);
  if (values.file) return JSON.parse(readFileSync(values.file, 'utf8'));
  return null;
}

export async function run(argv = process.argv) {
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    allowPositionals: true,
    strict: false,
    options: {
      pretty: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
      // campaigns
      name: { type: 'string' },
      status: { type: 'string' },
      'sort-by': { type: 'string' },
      'sort-order': { type: 'string' },
      'created-by': { type: 'string' },
      from: { type: 'string' },
      to: { type: 'string' },
      // leads
      email: { type: 'string' },
      'campaign-id': { type: 'string' },
      'lead-id': { type: 'string' },
      'first-name': { type: 'string' },
      'last-name': { type: 'string' },
      'company-name': { type: 'string' },
      'job-title': { type: 'string' },
      'linkedin-url': { type: 'string' },
      phone: { type: 'string' },
      deduplicate: { type: 'boolean', default: false },
      // contacts / schedules
      json: { type: 'string' },
      file: { type: 'string' },
      // activities
      type: { type: 'string' },
      // pagination
      limit: { type: 'string' },
      offset: { type: 'string' },
      // webhooks
      url: { type: 'string' },
      events: { type: 'string' },
    },
  });

  const [resource, subcommand, positionalArg] = positionals;
  const pretty = values.pretty;

  if (values.help || !resource) {
    process.stdout.write(USAGE);
    process.exit(0);
    return;
  }

  const apiKey = process.env.LEMLIST_API_KEY;
  if (!apiKey) {
    process.stderr.write('Error: LEMLIST_API_KEY is not set in environment\n');
    process.exit(1);
    return;
  }

  const client = createClient(apiKey);
  const limit = values.limit !== undefined ? Number(values.limit) : undefined;
  const offset = values.offset !== undefined ? Number(values.offset) : undefined;

  try {
    let result;

    if (resource === 'campaigns') {
      if (subcommand === 'list') {
        const query = buildQuery({
          status: values.status,
          sortBy: values['sort-by'],
          sortOrder: values['sort-order'],
          createdBy: values['created-by'],
          limit,
          offset,
        });
        result = await listCampaigns(client, query);

      } else if (subcommand === 'get') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns get\n');
          process.exit(1);
          return;
        }
        result = await getCampaign(client, positionalArg);

      } else if (subcommand === 'create') {
        if (!values.name) {
          process.stderr.write('Error: --name is required for campaigns create\n');
          process.exit(1);
          return;
        }
        result = await createCampaign(client, values.name);

      } else if (subcommand === 'duplicate') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns duplicate\n');
          process.exit(1);
          return;
        }
        result = await duplicateCampaign(client, positionalArg);

      } else if (subcommand === 'start') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns start\n');
          process.exit(1);
          return;
        }
        result = await startCampaign(client, positionalArg);

      } else if (subcommand === 'pause') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns pause\n');
          process.exit(1);
          return;
        }
        result = await pauseCampaign(client, positionalArg);

      } else if (subcommand === 'stats') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns stats\n');
          process.exit(1);
          return;
        }
        const query = buildQuery({ startDate: values.from, endDate: values.to });
        result = await getCampaignStats(client, positionalArg, query);

      } else if (subcommand === 'reports') {
        if (!positionalArg) {
          process.stderr.write('Error: <campaign-id> is required for campaigns reports\n');
          process.exit(1);
          return;
        }
        result = await getCampaignReports(client, [positionalArg]);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'leads') {
      if (subcommand === 'list') {
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads list\n');
          process.exit(1);
          return;
        }
        result = await listLeads(client, values['campaign-id'], buildQuery({ limit, offset }));

      } else if (subcommand === 'get') {
        if (!positionalArg) {
          process.stderr.write('Error: <email> is required for leads get\n');
          process.exit(1);
          return;
        }
        result = await getLead(client, positionalArg);

      } else if (subcommand === 'create') {
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads create\n');
          process.exit(1);
          return;
        }
        if (!values.email) {
          process.stderr.write('Error: --email is required for leads create\n');
          process.exit(1);
          return;
        }
        const leadData = buildQuery({
          email: values.email,
          firstName: values['first-name'],
          lastName: values['last-name'],
          companyName: values['company-name'],
          jobTitle: values['job-title'],
          linkedinUrl: values['linkedin-url'],
          phone: values.phone,
        });
        result = await createLead(client, values['campaign-id'], leadData, buildQuery({ deduplicate: values.deduplicate }));

      } else if (subcommand === 'update') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads update\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads update\n');
          process.exit(1);
          return;
        }
        const updates = buildQuery({
          firstName: values['first-name'],
          lastName: values['last-name'],
          companyName: values['company-name'],
          jobTitle: values['job-title'],
          linkedinUrl: values['linkedin-url'],
          phone: values.phone,
        });
        result = await updateLead(client, values['campaign-id'], positionalArg, updates);

      } else if (subcommand === 'delete') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads delete\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads delete\n');
          process.exit(1);
          return;
        }
        result = await deleteLead(client, values['campaign-id'], positionalArg);

      } else if (subcommand === 'pause') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads pause\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads pause\n');
          process.exit(1);
          return;
        }
        result = await pauseLead(client, values['campaign-id'], positionalArg);

      } else if (subcommand === 'resume') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads resume\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads resume\n');
          process.exit(1);
          return;
        }
        result = await resumeLead(client, values['campaign-id'], positionalArg);

      } else if (subcommand === 'interested') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads interested\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads interested\n');
          process.exit(1);
          return;
        }
        result = await markLeadInterested(client, values['campaign-id'], positionalArg);

      } else if (subcommand === 'not-interested') {
        if (!positionalArg) {
          process.stderr.write('Error: <lead-id> is required for leads not-interested\n');
          process.exit(1);
          return;
        }
        if (!values['campaign-id']) {
          process.stderr.write('Error: --campaign-id is required for leads not-interested\n');
          process.exit(1);
          return;
        }
        result = await markLeadNotInterested(client, values['campaign-id'], positionalArg);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'contacts') {
      if (subcommand === 'upsert') {
        const contactData = parseJsonInput(values);
        if (!contactData) {
          process.stderr.write('Error: --json or --file is required for contacts upsert\n');
          process.exit(1);
          return;
        }
        result = await upsertContact(client, contactData);

      } else if (subcommand === 'list') {
        result = await listContacts(client, buildQuery({ limit, offset }));

      } else if (subcommand === 'get') {
        if (!positionalArg) {
          process.stderr.write('Error: <contact-id> is required for contacts get\n');
          process.exit(1);
          return;
        }
        result = await getContact(client, positionalArg);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'activities') {
      if (subcommand === 'list') {
        const query = buildQuery({
          type: values.type,
          campaignId: values['campaign-id'],
          leadId: values['lead-id'],
          limit,
          offset,
        });
        result = await listActivities(client, query);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'unsubscribes') {
      if (subcommand === 'list') {
        result = await listUnsubscribes(client, buildQuery({ limit, offset }));

      } else if (subcommand === 'add') {
        if (!values.email) {
          process.stderr.write('Error: --email is required for unsubscribes add\n');
          process.exit(1);
          return;
        }
        result = await addUnsubscribe(client, values.email);

      } else if (subcommand === 'remove') {
        if (!values.email) {
          process.stderr.write('Error: --email is required for unsubscribes remove\n');
          process.exit(1);
          return;
        }
        result = await removeUnsubscribe(client, values.email);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'webhooks') {
      if (subcommand === 'list') {
        result = await listWebhooks(client);

      } else if (subcommand === 'create') {
        if (!values.url) {
          process.stderr.write('Error: --url is required for webhooks create\n');
          process.exit(1);
          return;
        }
        result = await createWebhook(client, values.url, values.events);

      } else if (subcommand === 'delete') {
        if (!positionalArg) {
          process.stderr.write('Error: <hook-id> is required for webhooks delete\n');
          process.exit(1);
          return;
        }
        result = await deleteWebhook(client, positionalArg);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'team') {
      if (subcommand === 'info') {
        result = await getTeam(client);
      } else if (subcommand === 'credits') {
        result = await getTeamCredits(client);
      } else if (subcommand === 'senders') {
        result = await getTeamSenders(client);
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'schedules') {
      if (subcommand === 'list') {
        result = await listSchedules(client);

      } else if (subcommand === 'get') {
        if (!positionalArg) {
          process.stderr.write('Error: <schedule-id> is required for schedules get\n');
          process.exit(1);
          return;
        }
        result = await getSchedule(client, positionalArg);

      } else if (subcommand === 'create') {
        const scheduleData = parseJsonInput(values);
        if (!scheduleData) {
          process.stderr.write('Error: --json or --file is required for schedules create\n');
          process.exit(1);
          return;
        }
        result = await createSchedule(client, scheduleData);

      } else if (subcommand === 'update') {
        if (!positionalArg) {
          process.stderr.write('Error: <schedule-id> is required for schedules update\n');
          process.exit(1);
          return;
        }
        const updates = parseJsonInput(values);
        if (!updates) {
          process.stderr.write('Error: --json or --file is required for schedules update\n');
          process.exit(1);
          return;
        }
        result = await updateSchedule(client, positionalArg, updates);

      } else if (subcommand === 'delete') {
        if (!positionalArg) {
          process.stderr.write('Error: <schedule-id> is required for schedules delete\n');
          process.exit(1);
          return;
        }
        result = await deleteSchedule(client, positionalArg);

      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else {
      process.stdout.write(USAGE);
      process.exit(0);
      return;
    }

    printOutput(result, { pretty });
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run(process.argv).catch((err) => {
    printError(err);
    process.exit(1);
  });
}
