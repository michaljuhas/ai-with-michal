/**
 * Todoist Comments resource module.
 * Pure ESM, no external dependencies.
 */

export async function listComments(client, params) {
  return client.get('/comments', params);
}

export async function getComment(client, id) {
  return client.get(`/comments/${id}`);
}

export async function addComment(client, body) {
  return client.post('/comments', body);
}

export async function updateComment(client, id, body) {
  return client.post(`/comments/${id}`, body);
}

export async function deleteComment(client, id) {
  return client.delete(`/comments/${id}`);
}
