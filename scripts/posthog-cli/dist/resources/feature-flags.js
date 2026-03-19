"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFlags = listFlags;
exports.retrieveFlag = retrieveFlag;
exports.createFlag = createFlag;
exports.updateFlag = updateFlag;
exports.deleteFlag = deleteFlag;
async function listFlags(client, params = {}) {
    const { limit = 20, offset, active, search } = params;
    return client.request(`/projects/${client.projectId}/feature_flags/`, {
        query: { limit, offset, active, search },
    });
}
async function retrieveFlag(client, id) {
    return client.request(`/projects/${client.projectId}/feature_flags/${id}/`);
}
async function createFlag(client, params) {
    const body = { name: params.name, key: params.key };
    if (params.filters !== undefined)
        body['filters'] = params.filters;
    if (params.active !== undefined)
        body['active'] = params.active;
    if (params.rollout_percentage !== undefined) {
        body['filters'] = {
            ...(params.filters ?? {}),
            groups: [{ properties: [], rollout_percentage: params.rollout_percentage }],
        };
    }
    return client.request(`/projects/${client.projectId}/feature_flags/`, { method: 'POST', body });
}
async function updateFlag(client, id, params) {
    return client.request(`/projects/${client.projectId}/feature_flags/${id}/`, { method: 'PATCH', body: params });
}
async function deleteFlag(client, id) {
    return client.request(`/projects/${client.projectId}/feature_flags/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=feature-flags.js.map