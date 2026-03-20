import { createClient } from './client.mjs';
import { listTasks, getTask, addTask, updateTask, deleteTask, closeTask, reopenTask, moveTask, filterTasks, quickAddTask } from './tasks.mjs';
import { listProjects, getProject, addProject, updateProject, deleteProject, archiveProject, unarchiveProject } from './projects.mjs';
import { listSections, getSection, addSection, updateSection, deleteSection } from './sections.mjs';
import { listLabels, getLabel, addLabel, updateLabel, deleteLabel } from './labels.mjs';
import { listComments, getComment, addComment, updateComment, deleteComment } from './comments.mjs';
import { listActivity } from './activities.mjs';
import { listReminders, getReminder, addReminder, updateReminder, deleteReminder } from './reminders.mjs';
import { formatOutput, printError } from './output.mjs';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const resource = argv[0];
  let subcommand = argv[1];
  let id = null;
  const flags = {};

  const ID_SUBCOMMANDS = ['get', 'update', 'delete', 'close', 'reopen', 'move', 'archive', 'unarchive'];

  let i = 2;
  if (ID_SUBCOMMANDS.includes(subcommand) && argv[2] && !argv[2].startsWith('--')) {
    id = argv[2];
    i = 3;
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

function kebabToSnake(key) {
  return key.replace(/-/g, '_');
}

function pickFlags(flags, keys) {
  const result = {};
  for (const key of keys) {
    const val = flags[key];
    if (val !== undefined) {
      result[kebabToSnake(key)] = val;
    }
  }
  return result;
}

export async function run(argv = process.argv.slice(2)) {
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    process.stderr.write('Missing TODOIST_API_TOKEN env var\n');
    process.exit(1);
    return;
  }

  const { resource, subcommand, id, flags } = parseArgs(argv);
  const client = createClient(token);

  try {
    let result;

    if (resource === 'tasks') {
      if (subcommand === 'list') {
        result = await listTasks(client, pickFlags(flags, ['project-id', 'section-id', 'label', 'filter', 'lang', 'ids']));
      } else if (subcommand === 'get') {
        result = await getTask(client, id);
      } else if (subcommand === 'add') {
        result = await addTask(client, pickFlags(flags, ['content', 'description', 'project-id', 'section-id', 'parent-id', 'order', 'labels', 'priority', 'due-string', 'due-date', 'due-datetime', 'due-lang', 'assignee-id', 'duration', 'duration-unit']));
      } else if (subcommand === 'update') {
        result = await updateTask(client, id, pickFlags(flags, ['content', 'description', 'project-id', 'section-id', 'parent-id', 'order', 'labels', 'priority', 'due-string', 'due-date', 'due-datetime', 'due-lang', 'assignee-id', 'duration', 'duration-unit']));
      } else if (subcommand === 'delete') {
        result = await deleteTask(client, id);
      } else if (subcommand === 'close') {
        result = await closeTask(client, id);
      } else if (subcommand === 'reopen') {
        result = await reopenTask(client, id);
      } else if (subcommand === 'move') {
        result = await moveTask(client, id, pickFlags(flags, ['project-id', 'section-id', 'parent-id']));
      } else if (subcommand === 'filter') {
        result = await filterTasks(client, flags.filter, pickFlags(flags, ['lang']));
      } else if (subcommand === 'quick') {
        result = await quickAddTask(client, flags.text, pickFlags(flags, ['note', 'reminder', 'meta']));
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'projects') {
      if (subcommand === 'list') {
        result = await listProjects(client);
      } else if (subcommand === 'get') {
        result = await getProject(client, id);
      } else if (subcommand === 'add') {
        result = await addProject(client, pickFlags(flags, ['name', 'parent-id', 'color', 'is-favorite', 'view-style']));
      } else if (subcommand === 'update') {
        result = await updateProject(client, id, pickFlags(flags, ['name', 'color', 'is-favorite', 'view-style']));
      } else if (subcommand === 'delete') {
        result = await deleteProject(client, id);
      } else if (subcommand === 'archive') {
        result = await archiveProject(client, id);
      } else if (subcommand === 'unarchive') {
        result = await unarchiveProject(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'sections') {
      if (subcommand === 'list') {
        result = await listSections(client, pickFlags(flags, ['project-id']));
      } else if (subcommand === 'get') {
        result = await getSection(client, id);
      } else if (subcommand === 'add') {
        result = await addSection(client, pickFlags(flags, ['name', 'project-id', 'order']));
      } else if (subcommand === 'update') {
        result = await updateSection(client, id, pickFlags(flags, ['name']));
      } else if (subcommand === 'delete') {
        result = await deleteSection(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'labels') {
      if (subcommand === 'list') {
        result = await listLabels(client);
      } else if (subcommand === 'get') {
        result = await getLabel(client, id);
      } else if (subcommand === 'add') {
        result = await addLabel(client, pickFlags(flags, ['name', 'order', 'color', 'is-favorite']));
      } else if (subcommand === 'update') {
        result = await updateLabel(client, id, pickFlags(flags, ['name', 'order', 'color', 'is-favorite']));
      } else if (subcommand === 'delete') {
        result = await deleteLabel(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'comments') {
      if (subcommand === 'list') {
        result = await listComments(client, pickFlags(flags, ['task-id', 'project-id']));
      } else if (subcommand === 'get') {
        result = await getComment(client, id);
      } else if (subcommand === 'add') {
        result = await addComment(client, pickFlags(flags, ['task-id', 'project-id', 'content']));
      } else if (subcommand === 'update') {
        result = await updateComment(client, id, pickFlags(flags, ['content']));
      } else if (subcommand === 'delete') {
        result = await deleteComment(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'activities') {
      if (subcommand === 'list') {
        result = await listActivity(client, pickFlags(flags, ['object-type', 'object-id', 'event-type', 'parent-project-id', 'parent-item-id', 'initiator-id', 'since', 'until', 'limit', 'offset']));
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else if (resource === 'reminders') {
      if (subcommand === 'list') {
        result = await listReminders(client, pickFlags(flags, ['task-id']));
      } else if (subcommand === 'get') {
        result = await getReminder(client, id);
      } else if (subcommand === 'add') {
        result = await addReminder(client, pickFlags(flags, ['task-id', 'type', 'due-date', 'minute-offset', 'service']));
      } else if (subcommand === 'update') {
        result = await updateReminder(client, id, pickFlags(flags, ['minute-offset', 'due', 'service']));
      } else if (subcommand === 'delete') {
        result = await deleteReminder(client, id);
      } else {
        printUsage();
        process.exit(1);
        return;
      }
    } else {
      printUsage();
      process.exit(1);
      return;
    }

    console.log(formatOutput(result, { pretty: flags.pretty === true || flags.pretty === 'true' }));
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}

function printUsage() {
  process.stderr.write(`Usage: node --env-file=.env scripts/todoist/index.mjs <resource> <command> [options]

Resources and commands:
  tasks list [--project-id <id>] [--section-id <id>] [--label <name>] [--filter <expr>] [--pretty]
  tasks get <id> [--pretty]
  tasks add --content <text> [--due-string <str>] [--priority <1-4>] [--project-id <id>] [--pretty]
  tasks update <id> [--content <text>] [--due-string <str>] [--priority <1-4>] [--pretty]
  tasks delete <id>
  tasks close <id>
  tasks reopen <id>
  tasks move <id> --project-id <id> | --section-id <id> | --parent-id <id>
  tasks filter --filter <expr> [--lang <lang>] [--pretty]
  tasks quick --text <text> [--pretty]

  projects list [--pretty]
  projects get <id> [--pretty]
  projects add --name <name> [--color <color>] [--is-favorite true] [--pretty]
  projects update <id> [--name <name>] [--color <color>] [--pretty]
  projects delete <id>
  projects archive <id>
  projects unarchive <id>

  sections list [--project-id <id>] [--pretty]
  sections get <id> [--pretty]
  sections add --name <name> --project-id <id> [--order <n>] [--pretty]
  sections update <id> --name <name> [--pretty]
  sections delete <id>

  labels list [--pretty]
  labels get <id> [--pretty]
  labels add --name <name> [--color <color>] [--order <n>] [--pretty]
  labels update <id> [--name <name>] [--color <color>] [--pretty]
  labels delete <id>

  comments list --task-id <id> | --project-id <id> [--pretty]
  comments get <id> [--pretty]
  comments add --task-id <id> --content <text> [--pretty]
  comments update <id> --content <text> [--pretty]
  comments delete <id>

  activities list [--object-type <type>] [--object-id <id>] [--event-type <type>] [--limit <n>] [--pretty]

  reminders list [--task-id <id>] [--pretty]
  reminders get <id> [--pretty]
  reminders add --task-id <id> --type <type> [--due-date <date>] [--minute-offset <n>] [--pretty]
  reminders update <id> [--minute-offset <n>] [--due <date>] [--service <svc>] [--pretty]
  reminders delete <id>
\n`);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run().catch(err => { printError(err); process.exit(1); });
}
