"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.webhookEndpoints.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.webhookEndpoints.retrieve(id);
    },
    update(client, id, params) {
        return client.webhookEndpoints.update(id, params);
    },
    del(client, id) {
        return client.webhookEndpoints.del(id);
    },
    list(client, params) {
        return client.webhookEndpoints.list(params);
    },
};
//# sourceMappingURL=webhook-endpoints.js.map