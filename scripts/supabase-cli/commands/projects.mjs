/**
 * Project management via the Supabase Management API.
 */

export async function projectsList(client) {
  return client.get('/projects');
}

export async function projectsGet(client, ref) {
  return client.get(`/projects/${ref}`);
}
