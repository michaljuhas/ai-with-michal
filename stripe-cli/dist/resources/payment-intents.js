"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.paymentIntents.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.paymentIntents.retrieve(id);
    },
    update(client, id, params) {
        return client.paymentIntents.update(id, params);
    },
    list(client, params) {
        return client.paymentIntents.list(params);
    },
    confirm(client, id, params) {
        return client.paymentIntents.confirm(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    capture(client, id, params) {
        return client.paymentIntents.capture(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    cancel(client, id, params) {
        return client.paymentIntents.cancel(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    search(client, params) {
        return client.paymentIntents.search(params);
    },
};
//# sourceMappingURL=payment-intents.js.map