/**
 * Todoist Labels resource module.
 * Pure ESM, no external dependencies.
 */

export async function listLabels(client) {
  return client.get('/labels');
}

export async function getLabel(client, id) {
  return client.get(`/labels/${id}`);
}

export async function addLabel(client, body) {
  return client.post('/labels', body);
}

export async function updateLabel(client, id, body) {
  return client.post(`/labels/${id}`, body);
}

export async function deleteLabel(client, id) {
  return client.delete(`/labels/${id}`);
}
