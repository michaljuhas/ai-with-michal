/**
 * Todoist Activity resource module.
 * Pure ESM, no external dependencies.
 */

export async function listActivity(client, params) {
  return client.get('/activity/events', params);
}
