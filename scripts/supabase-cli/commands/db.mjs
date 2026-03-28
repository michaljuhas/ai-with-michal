/**
 * db query and db migrate commands.
 * Uses the Supabase Management API client.
 */

export async function dbQuery(client, projectRef, sql) {
  if (!sql || !sql.trim()) throw new Error('--sql is required and cannot be empty');
  return client.post(`/projects/${projectRef}/database/query`, { query: sql });
}

export async function dbMigrateList(client, projectRef) {
  return client.get(`/projects/${projectRef}/database/migrations`);
}
