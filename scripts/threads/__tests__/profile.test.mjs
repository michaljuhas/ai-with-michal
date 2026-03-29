import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { createApiClient, THREADS_BASE_URL } from '../api.mjs';
import { getMe, profileLookup, getPublishingLimit } from '../profile.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCapturingFetch({ ok = true, status = 200, json = {} } = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok,
      status,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify(json),
    };
  };
  fn.calls = calls;
  return fn;
}

const TOKEN = 'test-profile-token';

// ---------------------------------------------------------------------------
// Save/restore fetch
// ---------------------------------------------------------------------------

let originalFetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; });

// ---------------------------------------------------------------------------
// getMe
// ---------------------------------------------------------------------------

describe('getMe', () => {
  it('calls the /me path', async () => {
    const mock = makeCapturingFetch({ json: { id: '123', username: 'testuser' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getMe(client);

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      `${THREADS_BASE_URL}/me`,
      `Expected path ${THREADS_BASE_URL}/me, got ${parsed.origin + parsed.pathname}`,
    );
  });

  it('includes all required profile fields in the query string', async () => {
    const mock = makeCapturingFetch({ json: { id: '123' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getMe(client);

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    const fields = parsed.searchParams.get('fields') ?? '';
    for (const f of ['id', 'username', 'name', 'threads_profile_picture_url', 'threads_biography']) {
      assert.ok(fields.includes(f), `Expected field "${f}" in fields param, got: ${fields}`);
    }
  });
});

// ---------------------------------------------------------------------------
// profileLookup
// ---------------------------------------------------------------------------

describe('profileLookup', () => {
  it('calls the /profile_lookup path', async () => {
    const mock = makeCapturingFetch({ json: { username: 'someone' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await profileLookup(client, 'someone');

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      `${THREADS_BASE_URL}/profile_lookup`,
      `Expected path ${THREADS_BASE_URL}/profile_lookup, got ${parsed.origin + parsed.pathname}`,
    );
  });

  it('passes the username param and required lookup fields', async () => {
    const mock = makeCapturingFetch({ json: { username: 'someone' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await profileLookup(client, 'someone');

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('username'), 'someone', 'username param should be set');

    const fields = parsed.searchParams.get('fields') ?? '';
    for (const f of ['username', 'name', 'follower_count', 'biography', 'is_verified']) {
      assert.ok(fields.includes(f), `Expected field "${f}" in fields param, got: ${fields}`);
    }
  });
});

// ---------------------------------------------------------------------------
// getPublishingLimit
// ---------------------------------------------------------------------------

describe('getPublishingLimit', () => {
  it('calls the /{userId}/threads_publishing_limit path', async () => {
    const mock = makeCapturingFetch({ json: { quota_usage: 5 } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getPublishingLimit(client, 'user-99');

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      `${THREADS_BASE_URL}/user-99/threads_publishing_limit`,
      `Expected userId in path, got ${parsed.origin + parsed.pathname}`,
    );
  });

  it('includes all required publishing limit fields in the query string', async () => {
    const mock = makeCapturingFetch({ json: { quota_usage: 5 } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getPublishingLimit(client, 'user-99');

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    const fields = parsed.searchParams.get('fields') ?? '';
    for (const f of [
      'quota_usage', 'config',
      'reply_quota_usage', 'reply_config',
      'delete_quota_usage', 'delete_config',
    ]) {
      assert.ok(fields.includes(f), `Expected field "${f}" in fields param, got: ${fields}`);
    }
  });
});
