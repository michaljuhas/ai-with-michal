"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    retrieve(client, id) {
        return client.events.retrieve(id);
    },
    list(client, params) {
        return client.events.list(params);
    },
};
//# sourceMappingURL=events.js.map