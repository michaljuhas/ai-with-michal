/**
 * Edge Functions management and invocation.
 */

export async function functionsList(managementClient, projectRef) {
  return managementClient.get(`/projects/${projectRef}/functions`);
}

export async function functionsInvoke(supabaseClient, name, { data, method = 'POST' } = {}) {
  if (method === 'GET') {
    return supabaseClient.get(`/functions/v1/${name}`);
  }
  return supabaseClient.post(`/functions/v1/${name}`, data ?? {});
}
