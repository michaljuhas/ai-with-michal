/**
 * Auth admin operations via Supabase Auth API.
 * Requires service role key (bypasses RLS).
 */

export async function authListUsers(client, { page, perPage } = {}) {
  const params = {};
  if (page !== undefined) params.page = String(page);
  if (perPage !== undefined) params.per_page = String(perPage);
  return client.get('/auth/v1/admin/users', Object.keys(params).length ? params : undefined);
}

export async function authGetUser(client, id) {
  return client.get(`/auth/v1/admin/users/${id}`);
}

export async function authCreateUser(client, { email, password, role } = {}) {
  const body = { email, password };
  if (role) body.role = role;
  return client.post('/auth/v1/admin/users', body);
}

export async function authDeleteUser(client, id) {
  return client.delete(`/auth/v1/admin/users/${id}`);
}
