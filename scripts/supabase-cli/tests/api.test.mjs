import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createManagementClient, createSupabaseClient, SupabaseApiError } from '../lib/api.mjs';

function makeMockFetch(status, body, headers = {}) {
  return async (url, init) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name?.toLowerCase()] ?? null },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function makeCapturingFetch(status, body, headers = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: (name) => headers[name?.toLowerCase()] ?? null },
      text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    };
  };
  fn.calls = calls;
  return fn;
}

describe('createManagementClient', () => {
  it('returns object with get, post, delete methods', () => {
    const client = createManagementClient('test-pat', makeMockFetch(200, []));
    assert.equal(typeof client.get, 'function');
    assert.equal(typeof client.post, 'function');
    assert.equal(typeof client.delete, 'function');
  });

  it('get builds correct URL for /projects', async () => {
    const fetch = makeCapturingFetch(200, []);
    const client = createManagementClient('test-pat', fetch);
    await client.get('/projects');
    assert.ok(fetch.calls[0].url.includes('api.supabase.com/v1/projects'));
  });

  it('get sends Authorization: Bearer header', async () => {
    const fetch = makeCapturingFetch(200, []);
    const client = createManagementClient('my-pat', fetch);
    await client.get('/projects');
    assert.equal(fetch.calls[0].init.headers['Authorization'], 'Bearer my-pat');
  });

  it('get appends query params', async () => {
    const fetch = makeCapturingFetch(200, []);
    const client = createManagementClient('test-pat', fetch);
    await client.get('/projects', { foo: 'bar' });
    assert.ok(fetch.calls[0].url.includes('foo=bar'));
  });

  it('post sends method POST with JSON body', async () => {
    const fetch = makeCapturingFetch(200, { id: '1' });
    const client = createManagementClient('test-pat', fetch);
    await client.post('/projects', { name: 'test' });
    assert.equal(fetch.calls[0].init.method, 'POST');
    assert.equal(fetch.calls[0].init.headers['Content-Type'], 'application/json');
    assert.equal(fetch.calls[0].init.body, JSON.stringify({ name: 'test' }));
  });

  it('delete sends method DELETE', async () => {
    const fetch = makeCapturingFetch(204, '');
    const client = createManagementClient('test-pat', fetch);
    await client.delete('/projects/abc');
    assert.equal(fetch.calls[0].init.method, 'DELETE');
  });

  it('non-2xx response throws SupabaseApiError with httpStatus', async () => {
    const client = createManagementClient('test-pat', makeMockFetch(404, { message: 'not found' }));
    await assert.rejects(() => client.get('/projects/bad'), (err) => {
      assert.ok(err instanceof SupabaseApiError);
      assert.equal(err.httpStatus, 404);
      return true;
    });
  });

  it('204 empty body returns { success: true }', async () => {
    const client = createManagementClient('test-pat', makeMockFetch(204, ''));
    const result = await client.delete('/projects/abc');
    assert.deepEqual(result, { success: true });
  });
});

describe('createSupabaseClient', () => {
  it('returns object with get, post, patch, delete methods', () => {
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', makeMockFetch(200, []));
    assert.equal(typeof client.get, 'function');
    assert.equal(typeof client.post, 'function');
    assert.equal(typeof client.patch, 'function');
    assert.equal(typeof client.delete, 'function');
  });

  it('get builds correct URL', async () => {
    const fetch = makeCapturingFetch(200, []);
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', fetch);
    await client.get('/rest/v1/users');
    assert.ok(fetch.calls[0].url.includes('abctest.supabase.co/rest/v1/users'));
  });

  it('get sends apikey and Authorization headers', async () => {
    const fetch = makeCapturingFetch(200, []);
    const client = createSupabaseClient('https://abctest.supabase.co', 'my-svc-key', fetch);
    await client.get('/rest/v1/users');
    assert.equal(fetch.calls[0].init.headers['apikey'], 'my-svc-key');
    assert.equal(fetch.calls[0].init.headers['Authorization'], 'Bearer my-svc-key');
  });

  it('post sends method POST with apikey and Authorization headers', async () => {
    const fetch = makeCapturingFetch(200, {});
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', fetch);
    await client.post('/rest/v1/users', { email: 'a@b.com' });
    assert.equal(fetch.calls[0].init.method, 'POST');
    assert.equal(fetch.calls[0].init.headers['apikey'], 'svc-key');
  });

  it('patch sends method PATCH', async () => {
    const fetch = makeCapturingFetch(200, {});
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', fetch);
    await client.patch('/rest/v1/users', { email: 'b@b.com' });
    assert.equal(fetch.calls[0].init.method, 'PATCH');
  });

  it('delete sends method DELETE', async () => {
    const fetch = makeCapturingFetch(204, '');
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', fetch);
    await client.delete('/rest/v1/users?id=eq.1');
    assert.equal(fetch.calls[0].init.method, 'DELETE');
  });

  it('non-2xx throws SupabaseApiError', async () => {
    const client = createSupabaseClient('https://abctest.supabase.co', 'svc-key', makeMockFetch(401, { message: 'Unauthorized' }));
    await assert.rejects(() => client.get('/rest/v1/secret'), (err) => {
      assert.ok(err instanceof SupabaseApiError);
      assert.equal(err.httpStatus, 401);
      return true;
    });
  });
});
