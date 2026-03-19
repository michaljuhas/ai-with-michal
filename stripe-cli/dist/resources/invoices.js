"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.invoices.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.invoices.retrieve(id);
    },
    update(client, id, params) {
        return client.invoices.update(id, params);
    },
    del(client, id) {
        return client.invoices.del(id);
    },
    list(client, params) {
        return client.invoices.list(params);
    },
    finalize(client, id, params) {
        return client.invoices.finalizeInvoice(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    pay(client, id, params) {
        return client.invoices.pay(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    sendInvoice(client, id) {
        return client.invoices.sendInvoice(id, undefined, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    voidInvoice(client, id) {
        return client.invoices.voidInvoice(id, undefined, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    search(client, params) {
        return client.invoices.search(params);
    },
};
//# sourceMappingURL=invoices.js.map