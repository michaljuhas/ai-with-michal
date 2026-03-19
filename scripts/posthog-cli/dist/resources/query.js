"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuery = runQuery;
async function runQuery(client, params) {
    return client.request(`/projects/${client.projectId}/query/`, {
        method: 'POST',
        body: { query: { kind: 'HogQLQuery', query: params.query } },
    });
}
//# sourceMappingURL=query.js.map