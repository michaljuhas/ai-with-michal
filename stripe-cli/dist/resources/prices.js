"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.prices.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.prices.retrieve(id);
    },
    update(client, id, params) {
        return client.prices.update(id, params);
    },
    deactivate(client, id) {
        return client.prices.update(id, { active: false });
    },
    list(client, params) {
        return client.prices.list(params);
    },
    search(client, params) {
        return client.prices.search(params);
    },
};
//# sourceMappingURL=prices.js.map