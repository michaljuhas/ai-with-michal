import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { refreshToken } from '../auth.mjs';
import { ThreadsApiError, THREADS_BASE_URL } from '../api.mjs';

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

const TOKEN = 'test-long-lived-token-abc';

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

let savedFetch;
beforeEach(() => { savedFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = savedFetch; });

describe('refreshToken', () => {
  // 1. Correct endpoint + query params
  it('calls GET /refresh_access_token with grant_type=th_refresh_token and access_token', async () => {
    const mock = makeCapturingFetch({
      json: { access_token: 'new-token', token_type: 'bearer', expires_in: 5183944 },
    });
    globalThis.fetch = mock;

    await refreshToken(TOKEN);

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      `${THREADS_BASE_URL}/refresh_access_token`,
    );
    assert.equal(parsed.searchParams.get('grant_type'), 'th_refresh_token');
    assert.equal(parsed.searchParams.get('access_token'), TOKEN);
  });

  // 2. Returns access_token, token_type, and expires_in from response
  it('returns the response object with access_token, token_type, and expires_in', async () => {
    const payload = { access_token: 'refreshed-token-xyz', token_type: 'bearer', expires_in: 5183944 };
    globalThis.fetch = makeMockFetch({ json: payload });

    const result = await refreshToken(TOKEN);

    assert.deepEqual(result, payload);
    assert.equal(result.access_token, 'refreshed-token-xyz');
    assert.equal(result.token_type, 'bearer');
    assert.equal(result.expires_in, 5183944);
  });

  // 3. Propagates ThreadsApiError on API error response
  it('throws ThreadsApiError when the API returns an error body', async () => {
    const errorBody = {
      error: {
        message: 'Invalid OAuth access token — Cannot parse access token',
        code: 190,
        type: 'OAuthException',
      },
    };
    globalThis.fetch = makeMockFetch({ ok: false, status: 400, json: errorBody });

    await assert.rejects(
      () => refreshToken(TOKEN),
      (err) => {
        assert.ok(err instanceof ThreadsApiError, `expected ThreadsApiError, got ${err.constructor.name}`);
        assert.equal(err.message, 'Invalid OAuth access token — Cannot parse access token');
        assert.equal(err.code, 190);
        return true;
      },
    );
  });
});
