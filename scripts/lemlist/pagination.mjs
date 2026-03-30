/**
 * Fetches all pages from a paginated Lemlist endpoint.
 * @param {object} client - from createClient
 * @param {string} path - API path
 * @param {object} query - base query params
 * @param {object} opts
 * @param {(data: any) => any[]} opts.extractRows - extract row array from response
 * @param {number} [opts.limit=100] - page size
 * @returns {Promise<any[]>}
 */
export async function fetchPaged(client, path, query = {}, { extractRows, limit = 100 } = {}) {
  const results = [];
  let offset = 0;

  while (true) {
    const data = await client.request({
      path,
      query: { ...query, limit, offset },
    });
    const rows = extractRows ? extractRows(data) : (Array.isArray(data) ? data : [data]);
    results.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
  }

  return results;
}
