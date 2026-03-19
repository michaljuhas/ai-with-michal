"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const config_1 = require("./lib/config");
const client_1 = require("./lib/client");
const output_1 = require("./lib/output");
const errors_1 = require("./lib/errors");
const events = __importStar(require("./resources/events"));
const flags = __importStar(require("./resources/feature-flags"));
const persons = __importStar(require("./resources/persons"));
const query = __importStar(require("./resources/query"));
const insights = __importStar(require("./resources/insights"));
const dashboards = __importStar(require("./resources/dashboards"));
const annotations = __importStar(require("./resources/annotations"));
const cohorts = __importStar(require("./resources/cohorts"));
const projects = __importStar(require("./resources/projects"));
const program = new commander_1.Command();
exports.program = program;
program
    .name('posthog')
    .description('PostHog API CLI wrapper')
    .version('1.0.0')
    .option('--api-key <key>', 'Personal API key (overrides env/config)')
    .option('--project-id <id>', 'Project ID (overrides env/config)')
    .option('--host <host>', 'PostHog host URL (default: from config, then https://us.posthog.com)')
    .option('--format <format>', 'Output format: json or table', 'json');
function getClient(globalOpts) {
    const cfg = (0, config_1.loadConfig)();
    if (globalOpts['apiKey'])
        cfg.personalApiKey = globalOpts['apiKey'];
    if (globalOpts['projectId'])
        cfg.projectId = globalOpts['projectId'];
    if (globalOpts['host'])
        cfg.host = globalOpts['host'];
    return (0, client_1.createClient)(cfg);
}
async function run(fn, format) {
    try {
        const result = await fn();
        console.log((0, output_1.formatOutput)(result, format));
    }
    catch (err) {
        console.error((0, errors_1.formatError)(err));
        process.exit(1);
    }
}
function parseData(dataStr) {
    if (!dataStr)
        return {};
    try {
        return JSON.parse(dataStr);
    }
    catch {
        console.error('[ERROR] --data must be valid JSON');
        process.exit(1);
    }
}
// ── CONFIG ──────────────────────────────────────────────────────────────────
const configCmd = program.command('config').description('Manage CLI configuration');
configCmd
    .command('set <key> <value>')
    .description('Set a config value (personalApiKey, projectId, host)')
    .action((key, value) => {
    (0, config_1.setConfigValue)(key, value);
    console.log(`Set ${key}`);
});
// ── EVENTS ───────────────────────────────────────────────────────────────────
const eventsCmd = program.command('events').description('List captured events');
eventsCmd
    .command('list')
    .description('List events')
    .option('--event <name>', 'Filter by event name')
    .option('--distinct-id <id>', 'Filter by distinct ID')
    .option('--limit <n>', 'Number of results', '10')
    .option('--after <iso>', 'Events after this ISO datetime')
    .option('--before <iso>', 'Events before this ISO datetime')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => events.listEvents(client, {
        event: opts.event,
        distinct_id: opts.distinctId,
        limit: parseInt(opts.limit, 10),
        after: opts.after,
        before: opts.before,
    }), g.format ?? 'json');
});
// ── FEATURE FLAGS ──────────────────────────────────────────────────────────
const flagsCmd = program.command('flags').description('Manage feature flags');
flagsCmd
    .command('list')
    .description('List feature flags')
    .option('--limit <n>', 'Number of results', '20')
    .option('--search <query>', 'Search by name or key')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => flags.listFlags(client, { limit: parseInt(opts.limit, 10), search: opts.search }), g.format ?? 'json');
});
flagsCmd
    .command('get <id>')
    .description('Retrieve a feature flag')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => flags.retrieveFlag(client, id), g.format ?? 'json');
});
flagsCmd
    .command('create')
    .description('Create a feature flag')
    .requiredOption('--name <name>', 'Flag name')
    .requiredOption('--key <key>', 'Flag key (unique identifier)')
    .option('--rollout <pct>', 'Rollout percentage (0-100)')
    .option('--disabled', 'Create as inactive', false)
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    const extra = parseData(opts.data);
    await run(() => flags.createFlag(client, {
        name: opts.name,
        key: opts.key,
        active: !opts.disabled,
        rollout_percentage: opts.rollout ? parseInt(opts.rollout, 10) : undefined,
        ...extra,
    }), g.format ?? 'json');
});
flagsCmd
    .command('update <id>')
    .description('Update a feature flag')
    .option('--name <name>', 'New name')
    .option('--enable', 'Set active=true')
    .option('--disable', 'Set active=false')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    const params = { ...parseData(opts.data) };
    if (opts.name)
        params['name'] = opts.name;
    if (opts.enable)
        params['active'] = true;
    if (opts.disable)
        params['active'] = false;
    await run(() => flags.updateFlag(client, id, params), g.format ?? 'json');
});
flagsCmd
    .command('delete <id>')
    .description('Delete a feature flag')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => flags.deleteFlag(client, id), g.format ?? 'json');
});
// ── PERSONS ───────────────────────────────────────────────────────────────
const personsCmd = program.command('persons').description('Manage persons');
personsCmd
    .command('list')
    .description('List persons')
    .option('--limit <n>', 'Number of results', '20')
    .option('--search <query>', 'Search by name or email')
    .option('--distinct-id <id>', 'Filter by distinct ID')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => persons.listPersons(client, { limit: parseInt(opts.limit, 10), search: opts.search, distinct_id: opts.distinctId }), g.format ?? 'json');
});
personsCmd
    .command('get <id>')
    .description('Retrieve a person')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => persons.retrievePerson(client, id), g.format ?? 'json');
});
personsCmd
    .command('delete <id>')
    .description('Delete a person')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => persons.deletePerson(client, id), g.format ?? 'json');
});
// ── QUERY ──────────────────────────────────────────────────────────────────
const queryCmd = program.command('query').description('Run HogQL queries');
queryCmd
    .command('run')
    .description('Run a HogQL SQL query')
    .requiredOption('--sql <sql>', 'HogQL SQL query string')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => query.runQuery(client, { query: opts.sql }), g.format ?? 'json');
});
// ── INSIGHTS ───────────────────────────────────────────────────────────────
const insightsCmd = program.command('insights').description('Manage insights');
insightsCmd
    .command('list')
    .description('List insights')
    .option('--limit <n>', 'Number of results', '20')
    .option('--search <query>', 'Search by name')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => insights.listInsights(client, { limit: parseInt(opts.limit, 10), search: opts.search }), g.format ?? 'json');
});
insightsCmd
    .command('get <id>')
    .description('Retrieve an insight')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => insights.retrieveInsight(client, id), g.format ?? 'json');
});
insightsCmd
    .command('create')
    .description('Create an insight')
    .requiredOption('--name <name>', 'Insight name')
    .option('--data <json>', 'Additional params as JSON (e.g. filters)')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => insights.createInsight(client, { name: opts.name, ...parseData(opts.data) }), g.format ?? 'json');
});
insightsCmd
    .command('update <id>')
    .description('Update an insight')
    .option('--name <name>', 'New name')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    const params = { ...parseData(opts.data) };
    if (opts.name)
        params['name'] = opts.name;
    await run(() => insights.updateInsight(client, id, params), g.format ?? 'json');
});
insightsCmd
    .command('delete <id>')
    .description('Delete an insight')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => insights.deleteInsight(client, id), g.format ?? 'json');
});
// ── DASHBOARDS ──────────────────────────────────────────────────────────────
const dashboardsCmd = program.command('dashboards').description('Manage dashboards');
dashboardsCmd
    .command('list')
    .option('--limit <n>', 'Number of results', '20')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => dashboards.listDashboards(client, { limit: parseInt(opts.limit, 10) }), g.format ?? 'json');
});
dashboardsCmd
    .command('get <id>')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => dashboards.retrieveDashboard(client, id), g.format ?? 'json');
});
dashboardsCmd
    .command('create')
    .requiredOption('--name <name>', 'Dashboard name')
    .option('--description <desc>', 'Description')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => dashboards.createDashboard(client, { name: opts.name, description: opts.description }), g.format ?? 'json');
});
dashboardsCmd
    .command('update <id>')
    .option('--name <name>', 'New name')
    .option('--description <desc>', 'New description')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => dashboards.updateDashboard(client, id, { name: opts.name, description: opts.description }), g.format ?? 'json');
});
dashboardsCmd
    .command('delete <id>')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => dashboards.deleteDashboard(client, id), g.format ?? 'json');
});
// ── ANNOTATIONS ──────────────────────────────────────────────────────────────
const annotationsCmd = program.command('annotations').description('Manage annotations');
annotationsCmd
    .command('list')
    .option('--limit <n>', 'Number of results', '20')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => annotations.listAnnotations(client, { limit: parseInt(opts.limit, 10) }), g.format ?? 'json');
});
annotationsCmd
    .command('create')
    .requiredOption('--content <text>', 'Annotation text')
    .option('--date <iso>', 'Date marker (ISO 8601)')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => annotations.createAnnotation(client, { content: opts.content, date_marker: opts.date }), g.format ?? 'json');
});
annotationsCmd
    .command('update <id>')
    .option('--content <text>', 'New text')
    .option('--date <iso>', 'New date marker')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => annotations.updateAnnotation(client, id, { content: opts.content, date_marker: opts.date }), g.format ?? 'json');
});
annotationsCmd
    .command('delete <id>')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => annotations.deleteAnnotation(client, id), g.format ?? 'json');
});
// ── COHORTS ───────────────────────────────────────────────────────────────
const cohortsCmd = program.command('cohorts').description('Manage cohorts');
cohortsCmd
    .command('list')
    .option('--limit <n>', 'Number of results', '20')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => cohorts.listCohorts(client, { limit: parseInt(opts.limit, 10) }), g.format ?? 'json');
});
cohortsCmd
    .command('get <id>')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => cohorts.retrieveCohort(client, id), g.format ?? 'json');
});
cohortsCmd
    .command('create')
    .requiredOption('--name <name>', 'Cohort name')
    .option('--data <json>', 'Additional params as JSON (e.g. filters)')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => cohorts.createCohort(client, { name: opts.name, ...parseData(opts.data) }), g.format ?? 'json');
});
cohortsCmd
    .command('update <id>')
    .option('--name <name>', 'New name')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => cohorts.updateCohort(client, id, { name: opts.name, ...parseData(opts.data) }), g.format ?? 'json');
});
cohortsCmd
    .command('delete <id>')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => cohorts.deleteCohort(client, id), g.format ?? 'json');
});
// ── PROJECTS ──────────────────────────────────────────────────────────────
const projectsCmd = program.command('projects').description('List and inspect projects');
projectsCmd
    .command('list')
    .description('List all accessible projects')
    .action(async (opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => projects.listProjects(client), g.format ?? 'json');
});
projectsCmd
    .command('get <id>')
    .description('Retrieve a project')
    .action(async (id, opts, cmd) => {
    const g = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(g);
    await run(() => projects.retrieveProject(client, id), g.format ?? 'json');
});
if (require.main === module) {
    program.parseAsync(process.argv).catch((err) => {
        console.error((0, errors_1.formatError)(err));
        process.exit(1);
    });
}
//# sourceMappingURL=cli.js.map