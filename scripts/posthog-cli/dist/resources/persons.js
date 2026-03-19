"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPersons = listPersons;
exports.retrievePerson = retrievePerson;
exports.deletePerson = deletePerson;
async function listPersons(client, params = {}) {
    const { limit = 20, offset, search, distinct_id } = params;
    return client.request(`/projects/${client.projectId}/persons/`, {
        query: { limit, offset, search, distinct_id },
    });
}
async function retrievePerson(client, id) {
    return client.request(`/projects/${client.projectId}/persons/${id}/`);
}
async function deletePerson(client, id) {
    return client.request(`/projects/${client.projectId}/persons/${id}/`, { method: 'DELETE' });
}
//# sourceMappingURL=persons.js.map