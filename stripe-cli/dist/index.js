"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.formatError = exports.formatOutput = exports.getApiKey = exports.createClient = exports.webhookEndpoints = exports.events = exports.refunds = exports.invoices = exports.prices = exports.products = exports.subscriptions = exports.charges = exports.paymentIntents = exports.customers = exports.StripeCLI = void 0;
const client_1 = require("./lib/client");
const config_1 = require("./lib/config");
const customers_1 = __importDefault(require("./resources/customers"));
exports.customers = customers_1.default;
const payment_intents_1 = __importDefault(require("./resources/payment-intents"));
exports.paymentIntents = payment_intents_1.default;
const charges_1 = __importDefault(require("./resources/charges"));
exports.charges = charges_1.default;
const subscriptions_1 = __importDefault(require("./resources/subscriptions"));
exports.subscriptions = subscriptions_1.default;
const products_1 = __importDefault(require("./resources/products"));
exports.products = products_1.default;
const prices_1 = __importDefault(require("./resources/prices"));
exports.prices = prices_1.default;
const invoices_1 = __importDefault(require("./resources/invoices"));
exports.invoices = invoices_1.default;
const refunds_1 = __importDefault(require("./resources/refunds"));
exports.refunds = refunds_1.default;
const events_1 = __importDefault(require("./resources/events"));
exports.events = events_1.default;
const webhook_endpoints_1 = __importDefault(require("./resources/webhook-endpoints"));
exports.webhookEndpoints = webhook_endpoints_1.default;
class StripeCLI {
    constructor(options = {}) {
        const key = options.apiKey ?? (0, config_1.getApiKey)();
        this.client = (0, client_1.createClient)(key, options);
        this.format = options.format ?? 'json';
    }
    get customers() {
        const c = this.client;
        return {
            create: (p) => customers_1.default.create(c, p),
            retrieve: (id) => customers_1.default.retrieve(c, id),
            update: (id, p) => customers_1.default.update(c, id, p),
            del: (id) => customers_1.default.del(c, id),
            list: (p) => customers_1.default.list(c, p),
            search: (p) => customers_1.default.search(c, p),
        };
    }
    get paymentIntents() {
        const c = this.client;
        return {
            create: (p) => payment_intents_1.default.create(c, p),
            retrieve: (id) => payment_intents_1.default.retrieve(c, id),
            update: (id, p) => payment_intents_1.default.update(c, id, p),
            list: (p) => payment_intents_1.default.list(c, p),
            confirm: (id, p) => payment_intents_1.default.confirm(c, id, p),
            capture: (id, p) => payment_intents_1.default.capture(c, id, p),
            cancel: (id, p) => payment_intents_1.default.cancel(c, id, p),
            search: (p) => payment_intents_1.default.search(c, p),
        };
    }
    get charges() {
        const c = this.client;
        return {
            retrieve: (id) => charges_1.default.retrieve(c, id),
            list: (p) => charges_1.default.list(c, p),
            capture: (id, p) => charges_1.default.capture(c, id, p),
            search: (p) => charges_1.default.search(c, p),
        };
    }
    get subscriptions() {
        const c = this.client;
        return {
            create: (p) => subscriptions_1.default.create(c, p),
            retrieve: (id) => subscriptions_1.default.retrieve(c, id),
            update: (id, p) => subscriptions_1.default.update(c, id, p),
            cancel: (id) => subscriptions_1.default.cancel(c, id),
            list: (p) => subscriptions_1.default.list(c, p),
            resume: (id, p) => subscriptions_1.default.resume(c, id, p),
            search: (p) => subscriptions_1.default.search(c, p),
        };
    }
    get products() {
        const c = this.client;
        return {
            create: (p) => products_1.default.create(c, p),
            retrieve: (id) => products_1.default.retrieve(c, id),
            update: (id, p) => products_1.default.update(c, id, p),
            del: (id) => products_1.default.del(c, id),
            list: (p) => products_1.default.list(c, p),
            search: (p) => products_1.default.search(c, p),
        };
    }
    get prices() {
        const c = this.client;
        return {
            create: (p) => prices_1.default.create(c, p),
            retrieve: (id) => prices_1.default.retrieve(c, id),
            update: (id, p) => prices_1.default.update(c, id, p),
            deactivate: (id) => prices_1.default.deactivate(c, id),
            list: (p) => prices_1.default.list(c, p),
            search: (p) => prices_1.default.search(c, p),
        };
    }
    get invoices() {
        const c = this.client;
        return {
            create: (p) => invoices_1.default.create(c, p),
            retrieve: (id) => invoices_1.default.retrieve(c, id),
            update: (id, p) => invoices_1.default.update(c, id, p),
            del: (id) => invoices_1.default.del(c, id),
            list: (p) => invoices_1.default.list(c, p),
            finalize: (id) => invoices_1.default.finalize(c, id),
            pay: (id) => invoices_1.default.pay(c, id),
            sendInvoice: (id) => invoices_1.default.sendInvoice(c, id),
            voidInvoice: (id) => invoices_1.default.voidInvoice(c, id),
            search: (p) => invoices_1.default.search(c, p),
        };
    }
    get refunds() {
        const c = this.client;
        return {
            create: (p) => refunds_1.default.create(c, p),
            retrieve: (id) => refunds_1.default.retrieve(c, id),
            update: (id, p) => refunds_1.default.update(c, id, p),
            list: (p) => refunds_1.default.list(c, p),
            cancel: (id) => refunds_1.default.cancel(c, id),
        };
    }
    get events() {
        const c = this.client;
        return {
            retrieve: (id) => events_1.default.retrieve(c, id),
            list: (p) => events_1.default.list(c, p),
        };
    }
    get webhookEndpoints() {
        const c = this.client;
        return {
            create: (p) => webhook_endpoints_1.default.create(c, p),
            retrieve: (id) => webhook_endpoints_1.default.retrieve(c, id),
            update: (id, p) => webhook_endpoints_1.default.update(c, id, p),
            del: (id) => webhook_endpoints_1.default.del(c, id),
            list: (p) => webhook_endpoints_1.default.list(c, p),
        };
    }
}
exports.StripeCLI = StripeCLI;
var client_2 = require("./lib/client");
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return client_2.createClient; } });
var config_2 = require("./lib/config");
Object.defineProperty(exports, "getApiKey", { enumerable: true, get: function () { return config_2.getApiKey; } });
var output_1 = require("./lib/output");
Object.defineProperty(exports, "formatOutput", { enumerable: true, get: function () { return output_1.formatOutput; } });
var errors_1 = require("./lib/errors");
Object.defineProperty(exports, "formatError", { enumerable: true, get: function () { return errors_1.formatError; } });
var idempotency_1 = require("./lib/idempotency");
Object.defineProperty(exports, "generateKey", { enumerable: true, get: function () { return idempotency_1.generateKey; } });
//# sourceMappingURL=index.js.map