"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
exports.retrieveProject = retrieveProject;
async function listProjects(client) {
    return client.request('/projects/');
}
async function retrieveProject(client, id) {
    return client.request(`/projects/${id}/`);
}
//# sourceMappingURL=projects.js.map