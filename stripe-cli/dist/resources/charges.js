"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    retrieve(client, id) {
        return client.charges.retrieve(id);
    },
    list(client, params) {
        return client.charges.list(params);
    },
    capture(client, id, params) {
        return client.charges.capture(id, params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    search(client, params) {
        return client.charges.search(params);
    },
};
//# sourceMappingURL=charges.js.map