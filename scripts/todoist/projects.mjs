/**
 * Todoist Projects resource module.
 * Pure ESM, no external dependencies.
 */

export async function listProjects(client) {
  return client.get('/projects');
}

export async function getProject(client, id) {
  return client.get(`/projects/${id}`);
}

export async function addProject(client, body) {
  return client.post('/projects', body);
}

export async function updateProject(client, id, body) {
  return client.post(`/projects/${id}`, body);
}

export async function deleteProject(client, id) {
  return client.delete(`/projects/${id}`);
}

export async function archiveProject(client, id) {
  return client.post(`/projects/${id}/archive`, {});
}

export async function unarchiveProject(client, id) {
  return client.post(`/projects/${id}/unarchive`, {});
}
