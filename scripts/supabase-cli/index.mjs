import { fileURLToPath } from 'node:url';
import { loadConfig } from './lib/config.mjs';
import { createManagementClient, createSupabaseClient } from './lib/api.mjs';
import { formatOutput, printError } from './lib/output.mjs';

import { dbQuery, dbMigrateList } from './commands/db.mjs';
import { restGet, restPost, restPatch, restDelete, restUpsert, restRpc } from './commands/rest.mjs';
import { authListUsers, authGetUser, authCreateUser, authDeleteUser } from './commands/auth.mjs';
import { storageBucketList, storageBucketCreate, storageBucketDelete, storageFileList, storageFileDelete } from './commands/storage.mjs';
import { functionsList, functionsInvoke } from './commands/functions.mjs';
import { projectsList, projectsGet } from './commands/projects.mjs';

export function parseArgs(argv) {
  const resource = argv[0];
  const subcommand = argv[1];
  const flags = {};
  const positionals = [];

  let i = 2;
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
      positionals.push(arg);
      i++;
    }
  }

  return { resource, subcommand, positionals, flags };
}

export async function run(argv = process.argv.slice(2)) {
  if (!argv.length) { printUsage(); process.exit(1); return; }

  const config = loadConfig();
  const supabaseClient = createSupabaseClient(config.supabaseUrl, config.serviceRoleKey);

  let managementClient = null;
  const getManagementClient = () => {
    if (!config.pat) {
      process.stderr.write('Error: SUPABASE_PAT env var is required for this command\n');
      process.exit(1);
    }
    if (!managementClient) managementClient = createManagementClient(config.pat);
    return managementClient;
  };

  const { resource, subcommand, positionals, flags } = parseArgs(argv);
  const pretty = flags.pretty === true || flags.pretty === 'true';

  try {
    let result;

    if (resource === 'db') {
      const mgmt = getManagementClient();
      if (subcommand === 'query') {
        result = await dbQuery(mgmt, config.projectRef, flags.sql);
      } else if (subcommand === 'migrate' && positionals[0] === 'list') {
        result = await dbMigrateList(mgmt, config.projectRef);
      } else { printUsage(); process.exit(1); return; }

    } else if (resource === 'rest') {
      const table = positionals[0];
      if (!table) { printUsage(); process.exit(1); return; }
      if (subcommand === 'get') {
        result = await restGet(supabaseClient, table, { select: flags.select, filter: flags.filter, limit: flags.limit, order: flags.order });
      } else if (subcommand === 'post') {
        result = await restPost(supabaseClient, table, JSON.parse(flags.data));
      } else if (subcommand === 'patch') {
        result = await restPatch(supabaseClient, table, flags.filter, JSON.parse(flags.data));
      } else if (subcommand === 'delete') {
        result = await restDelete(supabaseClient, table, flags.filter);
      } else if (subcommand === 'upsert') {
        result = await restUpsert(supabaseClient, table, JSON.parse(flags.data), { onConflict: flags['on-conflict'] });
      } else if (subcommand === 'rpc') {
        result = await restRpc(supabaseClient, table, flags.data ? JSON.parse(flags.data) : undefined);
      } else { printUsage(); process.exit(1); return; }

    } else if (resource === 'auth') {
      if (subcommand === 'users') {
        const action = positionals[0];
        if (action === 'list') {
          result = await authListUsers(supabaseClient, { page: flags.page, perPage: flags['per-page'] });
        } else if (action === 'get') {
          result = await authGetUser(supabaseClient, positionals[1]);
        } else if (action === 'create') {
          result = await authCreateUser(supabaseClient, { email: flags.email, password: flags.password, role: flags.role });
        } else if (action === 'delete') {
          result = await authDeleteUser(supabaseClient, positionals[1]);
        } else { printUsage(); process.exit(1); return; }
      } else { printUsage(); process.exit(1); return; }

    } else if (resource === 'storage') {
      if (subcommand === 'buckets') {
        const action = positionals[0];
        if (action === 'list') {
          result = await storageBucketList(supabaseClient);
        } else if (action === 'create') {
          result = await storageBucketCreate(supabaseClient, positionals[1], { isPublic: flags.public === true });
        } else if (action === 'delete') {
          result = await storageBucketDelete(supabaseClient, positionals[1]);
        } else { printUsage(); process.exit(1); return; }
      } else if (subcommand === 'files') {
        const action = positionals[0];
        const bucket = positionals[1];
        if (action === 'list') {
          result = await storageFileList(supabaseClient, bucket, { prefix: flags.prefix, limit: flags.limit });
        } else if (action === 'delete') {
          result = await storageFileDelete(supabaseClient, bucket, positionals[2]);
        } else { printUsage(); process.exit(1); return; }
      } else { printUsage(); process.exit(1); return; }

    } else if (resource === 'functions') {
      if (subcommand === 'list') {
        result = await functionsList(getManagementClient(), config.projectRef);
      } else if (subcommand === 'invoke') {
        result = await functionsInvoke(supabaseClient, positionals[0], {
          data: flags.data ? JSON.parse(flags.data) : undefined,
          method: flags.method,
        });
      } else { printUsage(); process.exit(1); return; }

    } else if (resource === 'projects') {
      const mgmt = getManagementClient();
      if (subcommand === 'list') {
        result = await projectsList(mgmt);
      } else if (subcommand === 'get') {
        result = await projectsGet(mgmt, positionals[0]);
      } else { printUsage(); process.exit(1); return; }

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
  process.stderr.write(`Usage: node --env-file=.env scripts/supabase-cli/index.mjs <resource> <subcommand> [args] [--flags]

Resources and commands:
  db query --sql <sql> [--pretty]
  db migrate list [--pretty]

  rest get <table> [--select <cols>] [--filter <col>=<op>.<val>] [--limit <n>] [--order <col>.<asc|desc>] [--pretty]
  rest post <table> --data <json> [--pretty]
  rest patch <table> --filter <col>=<op>.<val> --data <json> [--pretty]
  rest delete <table> --filter <col>=<op>.<val>
  rest upsert <table> --data <json> [--on-conflict <col>] [--pretty]
  rest rpc <function-name> [--data <json>] [--pretty]

  auth users list [--page <n>] [--per-page <n>] [--pretty]
  auth users get <id> [--pretty]
  auth users create --email <email> --password <pass> [--role <role>] [--pretty]
  auth users delete <id>

  storage buckets list [--pretty]
  storage buckets create <name> [--public] [--pretty]
  storage buckets delete <name>
  storage files list <bucket> [--prefix <path>] [--limit <n>] [--pretty]
  storage files delete <bucket> <remote-path>

  functions list [--pretty]
  functions invoke <name> [--data <json>] [--method GET|POST] [--pretty]

  projects list [--pretty]
  projects get <ref> [--pretty]
\n`);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run().catch(err => { printError(err); process.exit(1); });
}
