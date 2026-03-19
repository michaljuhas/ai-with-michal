"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCohorts = listCohorts;
exports.retrieveCohort = retrieveCohort;
exports.createCohort = createCohort;
exports.updateCohort = updateCohort;
exports.deleteCohort = deleteCohort;
async function listCohorts(client, params = {}) {
    return client.request(`/projects/${client.projectId}/cohorts/`, {
        query: { limit: params.limit ?? 20, offset: params.offset },
    });
}
async function retrieveCohort(client, id) {
    return client.request(`/projects/${client.projectId}/cohorts/${id}/`);
}
async function createCohort(client, params) {
    return client.request(`/projects/${client.projectId}/cohorts/`, { method: 'POST', body: params });
}
async function updateCohort(client, id, params) {
    return client.request(`/projects/${client.projectId}/cohorts/${id}/`, { method: 'PATCH', body: params });
}
async function deleteCohort(client, id) {
    return client.request(`/projects/${client.projectId}/cohorts/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=cohorts.js.map