import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { createApiClient, ThreadsApiError, THREADS_BASE_URL } from '../api.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockFetch({ ok = true, status = 200, json = {} } = {}) {
  return async () => ({
    ok,
    status,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify(json),
  });
}

function makeCapturingFetch({ ok = true, status = 200, json = {} } = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return makeMockFetch({ ok, status, json })(url, init);
  };
  fn.calls = calls;
  return fn;
}

const TOKEN = 'test-access-token-xyz';

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

let originalFetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; });

describe('THREADS_BASE_URL', () => {
  it('is the correct Threads Graph API base URL', () => {
    assert.equal(THREADS_BASE_URL, 'https://graph.threads.net/v1.0');
  });
});

describe('createApiClient', () => {
  // 1. Shape of returned object
  it('returns an object with get, post, and delete methods', () => {
    const client = createApiClient(TOKEN);
    assert.equal(typeof client.get, 'function', 'client.get should be a function');
    assert.equal(typeof client.post, 'function', 'client.post should be a function');
    assert.equal(typeof client.delete, 'function', 'client.delete should be a function');
  });

  // 2. GET — URL construction with params and access_token
  it('client.get builds correct URL with query string params and access_token', async () => {
    const mock = makeCapturingFetch({ json: { id: '123' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await client.get('me', { fields: 'id,name' });

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/me`);
    assert.equal(parsed.searchParams.get('fields'), 'id,name');
    assert.equal(parsed.searchParams.get('access_token'), TOKEN);
  });

  // 3. GET — Authorization header
  it('client.get sends Authorization: Bearer header', async () => {
    const mock = makeCapturingFetch({ json: { id: '123' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await client.get('me');

    const { init } = mock.calls[0];
    assert.equal(init.headers['Authorization'], `Bearer ${TOKEN}`);
  });

  // 4. POST — method, Content-Type, JSON body
  it('client.post sends POST method with Content-Type application/json and JSON body', async () => {
    const mock = makeCapturingFetch({ json: { id: 'post-123' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await client.post('me/threads', { media_type: 'TEXT', text: 'Hello' });

    assert.equal(mock.calls.length, 1);
    const { init } = mock.calls[0];
    assert.equal(init.method, 'POST');
    assert.equal(init.headers['Content-Type'], 'application/json');
    assert.equal(init.body, JSON.stringify({ media_type: 'TEXT', text: 'Hello' }));
  });

  // 5. POST — URL construction
  it('client.post builds correct URL with access_token', async () => {
    const mock = makeCapturingFetch({ json: { id: 'post-123' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await client.post('me/threads', {});

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/me/threads`);
    assert.equal(parsed.searchParams.get('access_token'), TOKEN);
  });

  // 6. DELETE — method
  it('client.delete sends DELETE method', async () => {
    const mock = makeCapturingFetch({ json: { success: true } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await client.delete('12345678');

    assert.equal(mock.calls.length, 1);
    assert.equal(mock.calls[0].init.method, 'DELETE');
  });

  // 7. Happy path — 200 returns parsed JSON
  it('returns parsed JSON on a successful 200 response', async () => {
    const payload = { id: 'thread-abc', text: 'Hello world' };
    globalThis.fetch = makeMockFetch({ ok: true, status: 200, json: payload });

    const client = createApiClient(TOKEN);
    const result = await client.get('me/threads/thread-abc');

    assert.deepEqual(result, payload);
  });

  // 8. API error — response JSON contains error.message → throws ThreadsApiError
  it('throws ThreadsApiError with message and code when response contains error field', async () => {
    const errorBody = {
      error: {
        message: 'Invalid OAuth access token.',
        code: 190,
        type: 'OAuthException',
      },
    };
    globalThis.fetch = makeMockFetch({ ok: false, status: 400, json: errorBody });

    const client = createApiClient(TOKEN);
    await assert.rejects(
      () => client.get('me'),
      (err) => {
        assert.ok(err instanceof ThreadsApiError, 'should be ThreadsApiError');
        assert.equal(err.message, 'Invalid OAuth access token.');
        assert.equal(err.code, 190);
        return true;
      },
    );
  });

  // 9. Non-JSON error body → throws ThreadsApiError with status code info
  it('throws ThreadsApiError with HTTP status info when body is not valid JSON', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 503,
      headers: { get: () => 'text/plain' },
      text: async () => 'Service Unavailable',
    });

    const client = createApiClient(TOKEN);
    await assert.rejects(
      () => client.get('me'),
      (err) => {
        assert.ok(err instanceof ThreadsApiError, 'should be ThreadsApiError');
        assert.ok(
          err.message.includes('503') || err.message.toLowerCase().includes('service unavailable'),
          `error message should reference status; got: ${err.message}`,
        );
        return true;
      },
    );
  });
});
