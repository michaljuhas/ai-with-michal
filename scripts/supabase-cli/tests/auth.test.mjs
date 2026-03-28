import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authListUsers, authGetUser, authCreateUser, authDeleteUser } from '../commands/auth.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], patch: [], delete: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? []; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? {}; },
    patch: async (path, body, params) => { calls.patch.push({ path, body, params }); return {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
}

describe('authListUsers', () => {
  it('calls client.get with /auth/v1/admin/users', async () => {
    const client = makeClient();
    await authListUsers(client);
    assert.equal(client._calls.get[0].path, '/auth/v1/admin/users');
  });

  it('passes page and per_page params when provided', async () => {
    const client = makeClient();
    await authListUsers(client, { page: 1, perPage: 50 });
    assert.equal(client._calls.get[0].params?.page, '1');
    assert.equal(client._calls.get[0].params?.per_page, '50');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ id: 'user-1' }];
    const client = makeClient({ get: expected });
    const result = await authListUsers(client);
    assert.deepEqual(result, expected);
  });
});

describe('authGetUser', () => {
  it('calls client.get with the user id in the path', async () => {
    const client = makeClient();
    await authGetUser(client, 'user-uuid-123');
    assert.equal(client._calls.get[0].path, '/auth/v1/admin/users/user-uuid-123');
  });
});

describe('authCreateUser', () => {
  it('calls client.post with /auth/v1/admin/users', async () => {
    const client = makeClient();
    await authCreateUser(client, { email: 'test@example.com', password: 'secret' });
    assert.equal(client._calls.post[0].path, '/auth/v1/admin/users');
  });

  it('body contains email and password', async () => {
    const client = makeClient();
    await authCreateUser(client, { email: 'test@example.com', password: 'secret' });
    assert.equal(client._calls.post[0].body.email, 'test@example.com');
    assert.equal(client._calls.post[0].body.password, 'secret');
  });

  it('body includes role when provided', async () => {
    const client = makeClient();
    await authCreateUser(client, { email: 'a@b.com', password: 'p', role: 'admin' });
    assert.equal(client._calls.post[0].body.role, 'admin');
  });
});

describe('authDeleteUser', () => {
  it('calls client.delete with the user id in the path', async () => {
    const client = makeClient();
    await authDeleteUser(client, 'user-uuid-123');
    assert.equal(client._calls.delete[0].path, '/auth/v1/admin/users/user-uuid-123');
  });
});
