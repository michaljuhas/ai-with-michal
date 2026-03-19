import { createClient } from './client.mjs';
import { listCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign } from './campaigns.mjs';
import { listAdSets, getAdSet } from './adsets.mjs';
import { listAds, getAd } from './ads.mjs';
import { getInsights } from './insights.mjs';
import { formatOutput, printError } from './output.mjs';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const resource = argv[0];
  let subcommand = argv[1];
  let id = null;
  const flags = {};

  let i = 2;
  // For `get`, `update`, `delete` subcommands, argv[2] might be positional ID
  if (['get', 'update', 'delete'].includes(subcommand) && argv[2] && !argv[2].startsWith('--')) {
    id = argv[2];
    i = 3;
  }
  // For `insights`, argv[1] is the id
  if (resource === 'insights') {
    id = subcommand;
    subcommand = null;
    i = 2;
  }

  while (i < argv.length) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        flags[key] = argv[i + 1];
        i += 2;
      } else {
        flags[key] = true;
        i += 1;
      }
    } else {
      i++;
    }
  }
  return { resource, subcommand, id, flags };
}

export async function run(argv = process.argv.slice(2)) {
  const TOKEN = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
  const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
  if (!TOKEN || !ACCOUNT_ID) {
    process.stderr.write('Missing META_SYSTEM_USER_ACCESS_TOKEN or META_AD_ACCOUNT_ID env vars\n');
    process.exit(1);
    return; // for test stubs
  }

  const { resource, subcommand, id, flags } = parseArgs(argv);
  const client = createClient(TOKEN, ACCOUNT_ID);
  const pretty = flags.pretty === true;

  try {
    let result;

    if (resource === 'campaigns') {
      if (subcommand === 'list') {
        result = await listCampaigns(client, { status: flags.status });
      } else if (subcommand === 'get') {
        result = await getCampaign(client, id);
      } else if (subcommand === 'create') {
        result = await createCampaign(client, { name: flags.name, objective: flags.objective, status: flags.status });
      } else if (subcommand === 'update') {
        result = await updateCampaign(client, id, { name: flags.name, status: flags.status });
      } else if (subcommand === 'delete') {
        result = await deleteCampaign(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'adsets') {
      if (subcommand === 'list') {
        result = await listAdSets(client, flags.campaign);
      } else if (subcommand === 'get') {
        result = await getAdSet(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'ads') {
      if (subcommand === 'list') {
        result = await listAds(client, { campaignId: flags.campaign, adSetId: flags.adset });
      } else if (subcommand === 'get') {
        result = await getAd(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'insights') {
      result = await getInsights(client, id, { preset: flags.preset, level: flags.level, fields: flags.fields });
    } else {
      printUsage();
      process.exit(1);
      return;
    }

    console.log(formatOutput(result, { pretty }));
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}

function printUsage() {
  process.stderr.write(`Usage: node --env-file=.env scripts/meta-ads/index.mjs <resource> <command> [options]

Resources and commands:
  campaigns list [--status ACTIVE|PAUSED|ALL] [--pretty]
  campaigns get <id> [--pretty]
  campaigns create --name <name> --objective <objective> [--status PAUSED] [--pretty]
  campaigns update <id> --status <status> [--name <name>] [--pretty]
  campaigns delete <id>

  adsets list --campaign <campaign-id> [--pretty]
  adsets get <id> [--pretty]

  ads list [--campaign <id>] [--adset <id>] [--pretty]
  ads get <id> [--pretty]

  insights <object-id> [--preset last_7d|last_30d] [--level campaign|adset|ad] [--fields f1,f2] [--pretty]
\n`);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run().catch(err => { printError(err); process.exit(1); });
}
