"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.refunds.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.refunds.retrieve(id);
    },
    update(client, id, params) {
        return client.refunds.update(id, params);
    },
    list(client, params) {
        return client.refunds.list(params);
    },
    cancel(client, id) {
        return client.refunds.cancel(id, undefined, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
};
//# sourceMappingURL=refunds.js.map