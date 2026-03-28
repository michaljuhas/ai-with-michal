import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { functionsList, functionsInvoke } from '../commands/functions.mjs';

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

describe('functionsList', () => {
  it('calls managementClient.get with the correct path', async () => {
    const mgmtClient = makeClient({ get: [] });
    await functionsList(mgmtClient, 'test-ref');
    assert.equal(mgmtClient._calls.get[0].path, '/projects/test-ref/functions');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ slug: 'hello-world' }];
    const mgmtClient = makeClient({ get: expected });
    const result = await functionsList(mgmtClient, 'test-ref');
    assert.deepEqual(result, expected);
  });
});

describe('functionsInvoke', () => {
  it('calls supabaseClient.post with /functions/v1/my-function', async () => {
    const supabaseClient = makeClient({ post: { result: 'ok' } });
    await functionsInvoke(supabaseClient, 'my-function', { data: { name: 'World' } });
    assert.equal(supabaseClient._calls.post[0].path, '/functions/v1/my-function');
  });

  it('passes data as body', async () => {
    const supabaseClient = makeClient({ post: {} });
    await functionsInvoke(supabaseClient, 'my-function', { data: { name: 'World' } });
    assert.deepEqual(supabaseClient._calls.post[0].body, { name: 'World' });
  });

  it('calls client.get when method is GET', async () => {
    const supabaseClient = makeClient({ get: { result: 'ok' } });
    await functionsInvoke(supabaseClient, 'my-function', { method: 'GET' });
    assert.equal(supabaseClient._calls.get[0].path, '/functions/v1/my-function');
  });

  it('sends empty object body when no data provided', async () => {
    const supabaseClient = makeClient({ post: {} });
    await functionsInvoke(supabaseClient, 'my-function');
    assert.deepEqual(supabaseClient._calls.post[0].body, {});
  });
});
