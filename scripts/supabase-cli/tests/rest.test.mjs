import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { restGet, restPost, restPatch, restDelete, restUpsert, restRpc } from '../commands/rest.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], patch: [], delete: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? []; },
    post: async (path, body, extraHeaders) => { calls.post.push({ path, body, extraHeaders }); return responses.post ?? {}; },
    patch: async (path, body, params) => { calls.patch.push({ path, body, params }); return responses.patch ?? {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
}

describe('restGet', () => {
  it('calls client.get with /rest/v1/users for table users', async () => {
    const client = makeClient();
    await restGet(client, 'users');
    assert.equal(client._calls.get[0].path, '/rest/v1/users');
  });

  it('passes select param when provided', async () => {
    const client = makeClient();
    await restGet(client, 'users', { select: 'id,email' });
    assert.equal(client._calls.get[0].params?.select, 'id,email');
  });

  it('parses filter col=op.val into params', async () => {
    const client = makeClient();
    await restGet(client, 'users', { filter: 'id=eq.123' });
    assert.equal(client._calls.get[0].params?.id, 'eq.123');
  });

  it('passes limit param', async () => {
    const client = makeClient();
    await restGet(client, 'users', { limit: '10' });
    assert.equal(client._calls.get[0].params?.limit, '10');
  });

  it('passes order param', async () => {
    const client = makeClient();
    await restGet(client, 'users', { order: 'created_at.desc' });
    assert.equal(client._calls.get[0].params?.order, 'created_at.desc');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ id: '1' }];
    const client = makeClient({ get: expected });
    const result = await restGet(client, 'users');
    assert.deepEqual(result, expected);
  });
});

describe('restPost', () => {
  it('calls client.post with /rest/v1/users', async () => {
    const client = makeClient();
    await restPost(client, 'users', { email: 'a@b.com' });
    assert.equal(client._calls.post[0].path, '/rest/v1/users');
  });

  it('passes data as body', async () => {
    const client = makeClient();
    await restPost(client, 'users', { email: 'a@b.com' });
    assert.deepEqual(client._calls.post[0].body, { email: 'a@b.com' });
  });
});

describe('restPatch', () => {
  it('calls client.patch with /rest/v1/users', async () => {
    const client = makeClient();
    await restPatch(client, 'users', 'id=eq.123', { email: 'new@b.com' });
    assert.equal(client._calls.patch[0].path, '/rest/v1/users');
  });

  it('passes the filter as params', async () => {
    const client = makeClient();
    await restPatch(client, 'users', 'id=eq.123', { email: 'new@b.com' });
    assert.equal(client._calls.patch[0].params?.id, 'eq.123');
  });
});

describe('restDelete', () => {
  it('calls client.delete with filter in path or as param', async () => {
    const client = makeClient();
    await restDelete(client, 'users', 'id=eq.123');
    const call = client._calls.delete[0];
    assert.ok(call.path.includes('users'), 'path should include table name');
    assert.ok(call.path.includes('id') && call.path.includes('eq.123'), 'filter should be in path as query string');
  });
});

describe('restUpsert', () => {
  it('calls client.post with /rest/v1/users', async () => {
    const client = makeClient();
    await restUpsert(client, 'users', { id: '1', email: 'a@b.com' });
    assert.ok(client._calls.post[0].path.includes('/rest/v1/users'));
  });

  it('passes data as body', async () => {
    const client = makeClient();
    const data = { id: '1', email: 'a@b.com' };
    await restUpsert(client, 'users', data);
    assert.deepEqual(client._calls.post[0].body, data);
  });
});

describe('restRpc', () => {
  it('calls client.post with /rest/v1/rpc/my_function', async () => {
    const client = makeClient();
    await restRpc(client, 'my_function', { arg: 'val' });
    assert.equal(client._calls.post[0].path, '/rest/v1/rpc/my_function');
  });

  it('passes data as body', async () => {
    const client = makeClient();
    await restRpc(client, 'fn', { x: 1 });
    assert.deepEqual(client._calls.post[0].body, { x: 1 });
  });

  it('sends empty object when no data provided', async () => {
    const client = makeClient();
    await restRpc(client, 'fn');
    assert.deepEqual(client._calls.post[0].body, {});
  });
});
