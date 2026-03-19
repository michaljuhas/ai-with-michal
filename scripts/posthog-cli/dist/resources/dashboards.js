"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDashboards = listDashboards;
exports.retrieveDashboard = retrieveDashboard;
exports.createDashboard = createDashboard;
exports.updateDashboard = updateDashboard;
exports.deleteDashboard = deleteDashboard;
async function listDashboards(client, params = {}) {
    return client.request(`/projects/${client.projectId}/dashboards/`, {
        query: { limit: params.limit ?? 20, offset: params.offset },
    });
}
async function retrieveDashboard(client, id) {
    return client.request(`/projects/${client.projectId}/dashboards/${id}/`);
}
async function createDashboard(client, params) {
    return client.request(`/projects/${client.projectId}/dashboards/`, { method: 'POST', body: params });
}
async function updateDashboard(client, id, params) {
    return client.request(`/projects/${client.projectId}/dashboards/${id}/`, { method: 'PATCH', body: params });
}
async function deleteDashboard(client, id) {
    return client.request(`/projects/${client.projectId}/dashboards/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=dashboards.js.map