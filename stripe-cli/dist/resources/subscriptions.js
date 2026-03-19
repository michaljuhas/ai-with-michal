"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.subscriptions.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.subscriptions.retrieve(id);
    },
    update(client, id, params) {
        return client.subscriptions.update(id, params);
    },
    cancel(client, id) {
        return client.subscriptions.cancel(id);
    },
    list(client, params) {
        return client.subscriptions.list(params);
    },
    resume(client, id, params) {
        return client.subscriptions.resume(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    search(client, params) {
        return client.subscriptions.search(params);
    },
};
//# sourceMappingURL=subscriptions.js.map