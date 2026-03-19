"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const client_1 = require("./lib/client");
const config_1 = require("./lib/config");
const output_1 = require("./lib/output");
const errors_1 = require("./lib/errors");
const customers_1 = __importDefault(require("./resources/customers"));
const payment_intents_1 = __importDefault(require("./resources/payment-intents"));
const charges_1 = __importDefault(require("./resources/charges"));
const subscriptions_1 = __importDefault(require("./resources/subscriptions"));
const products_1 = __importDefault(require("./resources/products"));
const prices_1 = __importDefault(require("./resources/prices"));
const invoices_1 = __importDefault(require("./resources/invoices"));
const refunds_1 = __importDefault(require("./resources/refunds"));
const events_1 = __importDefault(require("./resources/events"));
const webhook_endpoints_1 = __importDefault(require("./resources/webhook-endpoints"));
const program = new commander_1.Command();
exports.program = program;
program
    .name('stripe-cli')
    .description('Stripe API CLI wrapper')
    .version('1.0.0')
    .option('--api-key <key>', 'Stripe API key (overrides env/config)')
    .option('--live', 'Use live mode', false)
    .option('--format <format>', 'Output format: json or table', 'json');
function getClient(opts) {
    const key = opts.apiKey ?? (0, config_1.getApiKey)();
    return (0, client_1.createClient)(key, { live: opts.live ?? false });
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
// ── CUSTOMERS ──────────────────────────────────────────────────────────────
const customersCmd = program.command('customers').description('Manage customers');
customersCmd
    .command('create')
    .description('Create a customer')
    .option('--email <email>', 'Customer email')
    .option('--name <name>', 'Customer name')
    .option('--phone <phone>', 'Customer phone')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.email && { email: opts.email }), ...(opts.name && { name: opts.name }), ...(opts.phone && { phone: opts.phone }) };
    await run(() => customers_1.default.create(client, params), globalOpts.format ?? 'json');
});
customersCmd
    .command('retrieve <id>')
    .description('Retrieve a customer')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => customers_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
customersCmd
    .command('update <id>')
    .description('Update a customer')
    .option('--name <name>', 'Customer name')
    .option('--email <email>', 'Customer email')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.name && { name: opts.name }), ...(opts.email && { email: opts.email }) };
    await run(() => customers_1.default.update(client, id, params), globalOpts.format ?? 'json');
});
customersCmd
    .command('delete <id>')
    .description('Delete a customer')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => customers_1.default.del(client, id), globalOpts.format ?? 'json');
});
customersCmd
    .command('list')
    .description('List customers')
    .option('--limit <n>', 'Number of results', '10')
    .option('--starting-after <id>', 'Cursor for pagination')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), limit: parseInt(opts.limit, 10), ...(opts.startingAfter && { starting_after: opts.startingAfter }) };
    await run(() => customers_1.default.list(client, params), globalOpts.format ?? 'json');
});
customersCmd
    .command('search')
    .description('Search customers')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => customers_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── PAYMENT INTENTS ────────────────────────────────────────────────────────
const paymentIntentsCmd = program.command('payment-intents').description('Manage payment intents');
paymentIntentsCmd
    .command('create')
    .description('Create a payment intent')
    .requiredOption('--amount <n>', 'Amount in smallest currency unit')
    .requiredOption('--currency <currency>', 'Currency code (e.g. usd)')
    .option('--customer <id>', 'Customer ID')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), amount: parseInt(opts.amount, 10), currency: opts.currency, ...(opts.customer && { customer: opts.customer }) };
    await run(() => payment_intents_1.default.create(client, params), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('retrieve <id>')
    .description('Retrieve a payment intent')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('update <id>')
    .description('Update a payment intent')
    .option('--data <json>', 'Params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.update(client, id, parseData(opts.data)), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('list')
    .description('List payment intents')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.list(client, { limit: parseInt(opts.limit, 10) }), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('confirm <id>')
    .description('Confirm a payment intent')
    .option('--data <json>', 'Params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.confirm(client, id, parseData(opts.data)), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('capture <id>')
    .description('Capture a payment intent')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.capture(client, id), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('cancel <id>')
    .description('Cancel a payment intent')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.cancel(client, id), globalOpts.format ?? 'json');
});
paymentIntentsCmd
    .command('search')
    .description('Search payment intents')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => payment_intents_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── CHARGES ────────────────────────────────────────────────────────────────
const chargesCmd = program.command('charges').description('Manage charges (read + capture only)');
chargesCmd
    .command('retrieve <id>')
    .description('Retrieve a charge')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => charges_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
chargesCmd
    .command('list')
    .description('List charges')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => charges_1.default.list(client, { limit: parseInt(opts.limit, 10) }), globalOpts.format ?? 'json');
});
chargesCmd
    .command('capture <id>')
    .description('Capture a charge')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => charges_1.default.capture(client, id), globalOpts.format ?? 'json');
});
chargesCmd
    .command('search')
    .description('Search charges')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => charges_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── SUBSCRIPTIONS ──────────────────────────────────────────────────────────
const subscriptionsCmd = program.command('subscriptions').description('Manage subscriptions');
subscriptionsCmd
    .command('create')
    .description('Create a subscription')
    .requiredOption('--customer <id>', 'Customer ID')
    .option('--data <json>', 'Additional params as JSON (must include items array)')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { customer: opts.customer, ...parseData(opts.data) };
    await run(() => subscriptions_1.default.create(client, params), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('retrieve <id>')
    .description('Retrieve a subscription')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => subscriptions_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('update <id>')
    .description('Update a subscription')
    .option('--data <json>', 'Params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => subscriptions_1.default.update(client, id, parseData(opts.data)), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('cancel <id>')
    .description('Cancel a subscription')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => subscriptions_1.default.cancel(client, id), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('list')
    .description('List subscriptions')
    .option('--customer <id>', 'Filter by customer')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...(opts.customer && { customer: opts.customer }) };
    await run(() => subscriptions_1.default.list(client, params), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('resume <id>')
    .description('Resume a subscription')
    .option('--billing-cycle-anchor <value>', 'Billing cycle anchor (now or unchanged)', 'now')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => subscriptions_1.default.resume(client, id, { billing_cycle_anchor: opts.billingCycleAnchor }), globalOpts.format ?? 'json');
});
subscriptionsCmd
    .command('search')
    .description('Search subscriptions')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => subscriptions_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── PRODUCTS ───────────────────────────────────────────────────────────────
const productsCmd = program.command('products').description('Manage products');
productsCmd
    .command('create')
    .description('Create a product')
    .requiredOption('--name <name>', 'Product name')
    .option('--description <desc>', 'Product description')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { name: opts.name, ...parseData(opts.data), ...(opts.description && { description: opts.description }) };
    await run(() => products_1.default.create(client, params), globalOpts.format ?? 'json');
});
productsCmd
    .command('retrieve <id>')
    .description('Retrieve a product')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => products_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
productsCmd
    .command('update <id>')
    .description('Update a product')
    .option('--name <name>', 'Product name')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.name && { name: opts.name }) };
    await run(() => products_1.default.update(client, id, params), globalOpts.format ?? 'json');
});
productsCmd
    .command('delete <id>')
    .description('Delete a product')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => products_1.default.del(client, id), globalOpts.format ?? 'json');
});
productsCmd
    .command('list')
    .description('List products')
    .option('--active <bool>', 'Filter by active status')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...(opts.active !== undefined && { active: opts.active === 'true' }) };
    await run(() => products_1.default.list(client, params), globalOpts.format ?? 'json');
});
productsCmd
    .command('search')
    .description('Search products')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => products_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── PRICES ─────────────────────────────────────────────────────────────────
const pricesCmd = program.command('prices').description('Manage prices');
pricesCmd
    .command('create')
    .description('Create a price')
    .requiredOption('--currency <currency>', 'Currency code')
    .requiredOption('--unit-amount <n>', 'Amount in smallest currency unit')
    .requiredOption('--product <id>', 'Product ID')
    .option('--recurring-interval <interval>', 'Recurring interval (day/week/month/year)')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { currency: opts.currency, unit_amount: parseInt(opts.unitAmount, 10), product: opts.product, ...parseData(opts.data) };
    if (opts.recurringInterval)
        params.recurring = { interval: opts.recurringInterval };
    await run(() => prices_1.default.create(client, params), globalOpts.format ?? 'json');
});
pricesCmd
    .command('retrieve <id>')
    .description('Retrieve a price')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => prices_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
pricesCmd
    .command('update <id>')
    .description('Update a price (metadata only — most fields immutable)')
    .option('--data <json>', 'Params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => prices_1.default.update(client, id, parseData(opts.data)), globalOpts.format ?? 'json');
});
pricesCmd
    .command('deactivate <id>')
    .description('Deactivate a price (sets active: false)')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => prices_1.default.deactivate(client, id), globalOpts.format ?? 'json');
});
pricesCmd
    .command('list')
    .description('List prices')
    .option('--product <id>', 'Filter by product')
    .option('--active <bool>', 'Filter by active status')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...(opts.product && { product: opts.product }), ...(opts.active !== undefined && { active: opts.active === 'true' }) };
    await run(() => prices_1.default.list(client, params), globalOpts.format ?? 'json');
});
pricesCmd
    .command('search')
    .description('Search prices')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => prices_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── INVOICES ───────────────────────────────────────────────────────────────
const invoicesCmd = program.command('invoices').description('Manage invoices');
invoicesCmd
    .command('create')
    .description('Create an invoice (draft)')
    .requiredOption('--customer <id>', 'Customer ID')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { customer: opts.customer, ...parseData(opts.data) };
    await run(() => invoices_1.default.create(client, params), globalOpts.format ?? 'json');
});
invoicesCmd
    .command('retrieve <id>')
    .description('Retrieve an invoice')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
invoicesCmd
    .command('update <id>')
    .description('Update an invoice')
    .option('--description <desc>', 'Invoice description')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.description && { description: opts.description }) };
    await run(() => invoices_1.default.update(client, id, params), globalOpts.format ?? 'json');
});
invoicesCmd
    .command('delete <id>')
    .description('Delete a draft invoice')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.del(client, id), globalOpts.format ?? 'json');
});
invoicesCmd
    .command('list')
    .description('List invoices')
    .option('--customer <id>', 'Filter by customer')
    .option('--status <status>', 'Filter by status (draft, open, paid, void)')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...(opts.customer && { customer: opts.customer }), ...(opts.status && { status: opts.status }) };
    await run(() => invoices_1.default.list(client, params), globalOpts.format ?? 'json');
});
invoicesCmd.command('finalize <id>').description('Finalize an invoice').action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.finalize(client, id), globalOpts.format ?? 'json');
});
invoicesCmd.command('pay <id>').description('Pay an invoice').action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.pay(client, id), globalOpts.format ?? 'json');
});
invoicesCmd.command('send <id>').description('Send an invoice').action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.sendInvoice(client, id), globalOpts.format ?? 'json');
});
invoicesCmd.command('void <id>').description('Void an invoice').action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.voidInvoice(client, id), globalOpts.format ?? 'json');
});
invoicesCmd
    .command('search')
    .description('Search invoices')
    .requiredOption('--query <query>', 'Search query')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => invoices_1.default.search(client, { query: opts.query }), globalOpts.format ?? 'json');
});
// ── REFUNDS ────────────────────────────────────────────────────────────────
const refundsCmd = program.command('refunds').description('Manage refunds');
refundsCmd
    .command('create')
    .description('Create a refund')
    .option('--charge <id>', 'Charge ID to refund')
    .option('--payment-intent <id>', 'Payment intent ID to refund')
    .option('--amount <n>', 'Amount to refund in smallest currency unit')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.charge && { charge: opts.charge }), ...(opts.paymentIntent && { payment_intent: opts.paymentIntent }), ...(opts.amount && { amount: parseInt(opts.amount, 10) }) };
    await run(() => refunds_1.default.create(client, params), globalOpts.format ?? 'json');
});
refundsCmd
    .command('retrieve <id>')
    .description('Retrieve a refund')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => refunds_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
refundsCmd
    .command('update <id>')
    .description('Update a refund')
    .option('--data <json>', 'Params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => refunds_1.default.update(client, id, parseData(opts.data)), globalOpts.format ?? 'json');
});
refundsCmd
    .command('list')
    .description('List refunds')
    .option('--charge <id>', 'Filter by charge')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...(opts.charge && { charge: opts.charge }) };
    await run(() => refunds_1.default.list(client, params), globalOpts.format ?? 'json');
});
refundsCmd
    .command('cancel <id>')
    .description('Cancel a refund')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => refunds_1.default.cancel(client, id), globalOpts.format ?? 'json');
});
// ── EVENTS ─────────────────────────────────────────────────────────────────
const eventsCmd = program.command('events').description('List and retrieve events (read-only)');
eventsCmd
    .command('retrieve <id>')
    .description('Retrieve an event')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => events_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
eventsCmd
    .command('list')
    .description('List events')
    .option('--type <type>', 'Filter by event type')
    .option('--limit <n>', 'Number of results', '10')
    .option('--data <json>', 'Additional params as JSON (e.g. created filters)')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { limit: parseInt(opts.limit, 10), ...parseData(opts.data), ...(opts.type && { type: opts.type }) };
    await run(() => events_1.default.list(client, params), globalOpts.format ?? 'json');
});
// ── WEBHOOK ENDPOINTS ──────────────────────────────────────────────────────
const webhookEndpointsCmd = program.command('webhook-endpoints').description('Manage webhook endpoints');
webhookEndpointsCmd
    .command('create')
    .description('Create a webhook endpoint')
    .requiredOption('--url <url>', 'Webhook URL')
    .option('--events <events>', 'Comma-separated list of events (or * for all)', '*')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const enabledEvents = opts.events.split(',').map((e) => e.trim());
    const params = { url: opts.url, enabled_events: enabledEvents, ...parseData(opts.data) };
    await run(() => webhook_endpoints_1.default.create(client, params), globalOpts.format ?? 'json');
});
webhookEndpointsCmd
    .command('retrieve <id>')
    .description('Retrieve a webhook endpoint')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => webhook_endpoints_1.default.retrieve(client, id), globalOpts.format ?? 'json');
});
webhookEndpointsCmd
    .command('update <id>')
    .description('Update a webhook endpoint')
    .option('--url <url>', 'New webhook URL')
    .option('--events <events>', 'Comma-separated list of events')
    .option('--data <json>', 'Additional params as JSON')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    const params = { ...parseData(opts.data), ...(opts.url && { url: opts.url }), ...(opts.events && { enabled_events: opts.events.split(',').map((e) => e.trim()) }) };
    await run(() => webhook_endpoints_1.default.update(client, id, params), globalOpts.format ?? 'json');
});
webhookEndpointsCmd
    .command('delete <id>')
    .description('Delete a webhook endpoint')
    .action(async (id, opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => webhook_endpoints_1.default.del(client, id), globalOpts.format ?? 'json');
});
webhookEndpointsCmd
    .command('list')
    .description('List webhook endpoints')
    .option('--limit <n>', 'Number of results', '10')
    .action(async (opts, cmd) => {
    const globalOpts = cmd.parent?.parent?.opts() ?? {};
    const client = getClient(globalOpts);
    await run(() => webhook_endpoints_1.default.list(client, { limit: parseInt(opts.limit, 10) }), globalOpts.format ?? 'json');
});
if (require.main === module) {
    program.parseAsync(process.argv).catch((err) => {
        console.error((0, errors_1.formatError)(err));
        process.exit(1);
    });
}
//# sourceMappingURL=cli.js.map