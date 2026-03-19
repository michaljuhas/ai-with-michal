/**
 * Tests for scripts/todoist/pagination.mjs
 * Run: node --test scripts/todoist/tests/pagination.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchAll, paginate } from '../pagination.mjs';

/**
 * Build a stub client whose .get() returns pages in sequence.
 * Each element in `pages` is the full response object the API would return,
 * e.g. { results: [...], next_cursor: "abc" } or { results: [...], next_cursor: null }
 */
function makeClient(pages) {
  let callIndex = 0;
  return {
    get: async (_path, _params) => {
      const page = pages[callIndex] ?? { results: [], next_cursor: null };
      callIndex++;
      return page;
    },
  };
}

/**
 * Like makeClient but also captures the params passed to each .get() call.
 */
function makeCapturingClient(pages) {
  const calls = [];
  let callIndex = 0;
  return {
    calls,
    get: async (path, params) => {
      calls.push({ path, params });
      const page = pages[callIndex] ?? { results: [], next_cursor: null };
      callIndex++;
      return page;
    },
  };
}

describe('fetchAll', () => {
  it('returns all results from a single page', async () => {
    const client = makeClient([
      { results: [{ id: '1' }, { id: '2' }], next_cursor: null },
    ]);
    const result = await fetchAll(client, '/tasks');
    assert.deepEqual(result, [{ id: '1' }, { id: '2' }]);
  });

  it('follows next_cursor across multiple pages', async () => {
    const client = makeCapturingClient([
      { results: [{ id: '1' }], next_cursor: 'cursor_abc' },
      { results: [{ id: '2' }], next_cursor: 'cursor_def' },
      { results: [{ id: '3' }], next_cursor: null },
    ]);
    const result = await fetchAll(client, '/tasks', { project_id: 'p1' });
    assert.deepEqual(result, [{ id: '1' }, { id: '2' }, { id: '3' }]);
    // First call has no cursor
    assert.equal(client.calls[0].params.cursor, undefined);
    // Second call passes the cursor from page 1
    assert.equal(client.calls[1].params.cursor, 'cursor_abc');
    // Third call passes the cursor from page 2
    assert.equal(client.calls[2].params.cursor, 'cursor_def');
  });

  it('stops when next_cursor is null', async () => {
    const client = makeCapturingClient([
      { results: [{ id: '1' }], next_cursor: null },
      { results: [{ id: '2' }], next_cursor: null }, // should never be reached
    ]);
    const result = await fetchAll(client, '/tasks');
    assert.deepEqual(result, [{ id: '1' }]);
    assert.equal(client.calls.length, 1);
  });

  it('returns empty array when first response has empty results', async () => {
    const client = makeCapturingClient([
      { results: [], next_cursor: null },
    ]);
    const result = await fetchAll(client, '/tasks');
    assert.deepEqual(result, []);
    assert.equal(client.calls.length, 1);
  });
});

describe('paginate', () => {
  it('yields each page separately', async () => {
    const page1 = [{ id: '1' }, { id: '2' }];
    const page2 = [{ id: '3' }];
    const client = makeClient([
      { results: page1, next_cursor: 'cursor_xyz' },
      { results: page2, next_cursor: null },
    ]);

    const pages = [];
    for await (const page of paginate(client, '/tasks')) {
      pages.push(page);
    }

    assert.equal(pages.length, 2);
    assert.deepEqual(pages[0], page1);
    assert.deepEqual(pages[1], page2);
  });

  it('stops immediately on empty results', async () => {
    const client = makeClient([
      { results: [], next_cursor: 'cursor_xyz' },
    ]);
    const pages = [];
    for await (const page of paginate(client, '/tasks')) {
      pages.push(page);
    }
    assert.equal(pages.length, 0);
  });
});
