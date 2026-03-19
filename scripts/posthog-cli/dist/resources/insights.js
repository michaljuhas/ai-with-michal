"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInsights = listInsights;
exports.retrieveInsight = retrieveInsight;
exports.createInsight = createInsight;
exports.updateInsight = updateInsight;
exports.deleteInsight = deleteInsight;
async function listInsights(client, params = {}) {
    const { limit = 20, offset, search } = params;
    return client.request(`/projects/${client.projectId}/insights/`, { query: { limit, offset, search } });
}
async function retrieveInsight(client, id) {
    return client.request(`/projects/${client.projectId}/insights/${id}/`);
}
async function createInsight(client, params) {
    return client.request(`/projects/${client.projectId}/insights/`, { method: 'POST', body: params });
}
async function updateInsight(client, id, params) {
    return client.request(`/projects/${client.projectId}/insights/${id}/`, { method: 'PATCH', body: params });
}
async function deleteInsight(client, id) {
    return client.request(`/projects/${client.projectId}/insights/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=insights.js.map