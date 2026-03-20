/**
 * Todoist Tasks resource module.
 * Pure ESM, no external dependencies.
 */

export async function listTasks(client, params) {
  return client.get('/tasks', params);
}

export async function getTask(client, id) {
  return client.get(`/tasks/${id}`);
}

export async function addTask(client, body) {
  return client.post('/tasks', body);
}

export async function updateTask(client, id, body) {
  return client.post(`/tasks/${id}`, body);
}

export async function deleteTask(client, id) {
  return client.delete(`/tasks/${id}`);
}

export async function closeTask(client, id) {
  return client.post(`/tasks/${id}/close`, {});
}

export async function reopenTask(client, id) {
  return client.post(`/tasks/${id}/reopen`, {});
}

export async function moveTask(client, id, body) {
  return client.post(`/tasks/${id}/move`, body);
}

export async function filterTasks(client, query, params) {
  return client.get('/tasks', { filter: query, ...params });
}

export async function quickAddTask(client, text, params) {
  return client.post('/tasks/quick', { text, ...params });
}
