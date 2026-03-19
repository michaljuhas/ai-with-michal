"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.customers.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.customers.retrieve(id);
    },
    update(client, id, params) {
        return client.customers.update(id, params);
    },
    del(client, id) {
        return client.customers.del(id);
    },
    list(client, params) {
        return client.customers.list(params);
    },
    search(client, params) {
        return client.customers.search(params);
    },
};
//# sourceMappingURL=customers.js.map