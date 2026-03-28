import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dbQuery, dbMigrateList } from '../commands/db.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], patch: [], delete: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? []; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? {}; },
    patch: async (path, body, params) => { calls.patch.push({ path, body, params }); return responses.patch ?? {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
}

describe('dbQuery', () => {
  it('calls client.post with the correct path', async () => {
    const client = makeClient({ post: { rows: [] } });
    await dbQuery(client, 'test-ref', 'SELECT now()');
    assert.equal(client._calls.post[0].path, '/projects/test-ref/database/query');
  });

  it('sends body with query field', async () => {
    const client = makeClient({ post: {} });
    await dbQuery(client, 'test-ref', 'SELECT 1');
    assert.deepEqual(client._calls.post[0].body, { query: 'SELECT 1' });
  });

  it('returns the value from client.post', async () => {
    const expected = { rows: [{ now: '2026-01-01' }] };
    const client = makeClient({ post: expected });
    const result = await dbQuery(client, 'test-ref', 'SELECT now()');
    assert.deepEqual(result, expected);
  });

  it('throws if sql is empty string', async () => {
    const client = makeClient();
    await assert.rejects(() => dbQuery(client, 'test-ref', ''), /sql|required/i);
  });
});

describe('dbMigrateList', () => {
  it('calls client.get with the correct path', async () => {
    const client = makeClient({ get: [] });
    await dbMigrateList(client, 'test-ref');
    assert.equal(client._calls.get[0].path, '/projects/test-ref/database/migrations');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ version: '20260101', name: 'init' }];
    const client = makeClient({ get: expected });
    const result = await dbMigrateList(client, 'test-ref');
    assert.deepEqual(result, expected);
  });
});
