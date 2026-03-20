/**
 * Todoist Reminders resource module.
 * Pure ESM, no external dependencies.
 */

export async function listReminders(client, params) {
  return client.get('/reminders', params);
}

export async function getReminder(client, id) {
  return client.get(`/reminders/${id}`);
}

export async function addReminder(client, body) {
  return client.post('/reminders', body);
}

export async function updateReminder(client, id, body) {
  return client.post(`/reminders/${id}`, body);
}

export async function deleteReminder(client, id) {
  return client.delete(`/reminders/${id}`);
}
