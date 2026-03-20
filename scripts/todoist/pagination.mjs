/**
 * Todoist pagination helpers
 * Pure ESM, no npm dependencies.
 *
 * Response envelope: { results: [...], next_cursor: "..." | null }
 */

/**
 * Async generator that yields each page's results array.
 * Stops when results are empty or next_cursor is null.
 */
export async function* paginate(client, path, params = {}) {
  let cursor = undefined;

  while (true) {
    const callParams = cursor !== undefined ? { ...params, cursor } : { ...params };
    const response = await client.get(path, callParams);

    const results = response.results ?? [];
    if (results.length === 0) break;

    yield results;

    if (!response.next_cursor) break;
    cursor = response.next_cursor;
  }
}

/**
 * Drains the paginate generator into a flat array of all results.
 */
export async function fetchAll(client, path, params = {}) {
  const all = [];
  for await (const page of paginate(client, path, params)) {
    all.push(...page);
  }
  return all;
}
