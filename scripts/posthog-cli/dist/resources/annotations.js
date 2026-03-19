"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAnnotations = listAnnotations;
exports.createAnnotation = createAnnotation;
exports.updateAnnotation = updateAnnotation;
exports.deleteAnnotation = deleteAnnotation;
async function listAnnotations(client, params = {}) {
    return client.request(`/projects/${client.projectId}/annotations/`, {
        query: { limit: params.limit ?? 20, offset: params.offset },
    });
}
async function createAnnotation(client, params) {
    return client.request(`/projects/${client.projectId}/annotations/`, { method: 'POST', body: params });
}
async function updateAnnotation(client, id, params) {
    return client.request(`/projects/${client.projectId}/annotations/${id}/`, { method: 'PATCH', body: params });
}
async function deleteAnnotation(client, id) {
    return client.request(`/projects/${client.projectId}/annotations/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=annotations.js.map