/**
 * Cursor-based pagination helpers for the Meta Graph API client.
 * Pure ESM, no npm dependencies.
 */

/**
 * Async generator that yields each page's data array.
 * Stops when paging.next is absent/falsy or data is empty.
 *
 * @param {object} client - createClient() result
 * @param {string} path   - API path
 * @param {object} params - base query params
 */
export async function* paginate(client, path, params = {}) {
  let cursor = undefined;

  while (true) {
    const requestParams = cursor !== undefined
      ? { ...params, after: cursor }
      : { ...params };

    const response = await client.get(path, requestParams);

    const data = response.data ?? [];
    if (data.length === 0) break;

    yield data;

    const next = response.paging?.next;
    if (!next) break;

    cursor = response.paging?.cursors?.after;
    if (!cursor) break;
  }
}

/**
 * Drains the paginate() generator into a flat array and returns it.
 *
 * @param {object} client - createClient() result
 * @param {string} path   - API path
 * @param {object} params - base query params
 * @returns {Promise<Array>}
 */
export async function fetchAll(client, path, params = {}) {
  const results = [];
  for await (const page of paginate(client, path, params)) {
    results.push(...page);
  }
  return results;
}
