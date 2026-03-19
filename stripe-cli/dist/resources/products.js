"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idempotency_1 = require("../lib/idempotency");
exports.default = {
    create(client, params) {
        return client.products.create(params, { idempotencyKey: (0, idempotency_1.generateKey)() });
    },
    retrieve(client, id) {
        return client.products.retrieve(id);
    },
    update(client, id, params) {
        return client.products.update(id, params);
    },
    del(client, id) {
        return client.products.del(id);
    },
    list(client, params) {
        return client.products.list(params);
    },
    search(client, params) {
        return client.products.search(params);
    },
};
//# sourceMappingURL=products.js.map