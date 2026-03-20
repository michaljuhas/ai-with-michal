/**
 * Todoist Sections resource module.
 * Pure ESM, no external dependencies.
 */

export async function listSections(client, params) {
  return client.get('/sections', params);
}

export async function getSection(client, id) {
  return client.get(`/sections/${id}`);
}

export async function addSection(client, body) {
  return client.post('/sections', body);
}

export async function updateSection(client, id, body) {
  return client.post(`/sections/${id}`, body);
}

export async function deleteSection(client, id) {
  return client.delete(`/sections/${id}`);
}
