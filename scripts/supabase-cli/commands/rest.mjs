/**
 * PostgREST operations via the Supabase hosted REST API.
 */

function parseFilter(filter) {
  if (!filter) return {};
  const eqIdx = filter.indexOf('=');
  if (eqIdx === -1) return {};
  const col = filter.slice(0, eqIdx);
  const val = filter.slice(eqIdx + 1);
  return { [col]: val };
}

export async function restGet(client, table, { select, filter, limit, order } = {}) {
  const params = {};
  if (select) params.select = select;
  if (limit) params.limit = limit;
  if (order) params.order = order;
  Object.assign(params, parseFilter(filter));
  return client.get(`/rest/v1/${table}`, Object.keys(params).length ? params : undefined);
}

export async function restPost(client, table, data) {
  return client.post(`/rest/v1/${table}`, data);
}

export async function restPatch(client, table, filter, data) {
  return client.patch(`/rest/v1/${table}`, data, parseFilter(filter));
}

export async function restDelete(client, table, filter) {
  const params = parseFilter(filter);
  const qs = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return client.delete(`/rest/v1/${table}${qs}`);
}

export async function restUpsert(client, table, data, { onConflict } = {}) {
  const params = onConflict ? { on_conflict: onConflict } : {};
  const qs = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return client.post(
    `/rest/v1/${table}${qs}`,
    data,
    { 'Prefer': 'resolution=merge-duplicates' }
  );
}

export async function restRpc(client, functionName, data) {
  return client.post(`/rest/v1/rpc/${functionName}`, data ?? {});
}
