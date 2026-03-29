import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { getPostInsights, getAccountInsights } from '../insights.mjs';

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

function makeClient() {
  const mock = makeCapturingFetch({ json: { data: [] } });
  globalThis.fetch = mock;

  // Minimal client that mirrors the shape of createApiClient
  const authHeaders = { Authorization: `Bearer ${TOKEN}` };
  const client = {
    get: async (path, params) => {
      const qs = new URLSearchParams({ ...params, access_token: TOKEN });
      const url = `https://graph.threads.net/v1.0/${path}?${qs.toString()}`;
      const response = await fetch(url, { headers: authHeaders });
      const text = await response.text();
      return JSON.parse(text);
    },
    _mock: mock,
  };
  return client;
}

// ---------------------------------------------------------------------------
// Lifecycle hooks
// ---------------------------------------------------------------------------

let savedFetch;
beforeEach(() => { savedFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = savedFetch; });

// ---------------------------------------------------------------------------
// getPostInsights
// ---------------------------------------------------------------------------

describe('getPostInsights', () => {
  it('calls the correct URL path and metric param for explicit metrics', async () => {
    const client = makeClient();

    await getPostInsights(client, 'media123', ['views', 'likes']);

    assert.equal(client._mock.calls.length, 1);
    const { url } = client._mock.calls[0];
    const parsed = new URL(url);

    assert.ok(
      parsed.pathname.endsWith('/media123/insights'),
      `expected pathname to end with /media123/insights, got: ${parsed.pathname}`,
    );
    assert.equal(
      parsed.searchParams.get('metric'),
      'views,likes',
      'metric param should be a comma-separated string of the provided metrics',
    );
  });

  it('uses default metrics when no metrics argument is passed', async () => {
    const client = makeClient();

    await getPostInsights(client, 'media456');

    assert.equal(client._mock.calls.length, 1);
    const { url } = client._mock.calls[0];
    const parsed = new URL(url);

    assert.ok(
      parsed.pathname.endsWith('/media456/insights'),
      `expected pathname to end with /media456/insights, got: ${parsed.pathname}`,
    );

    const metric = parsed.searchParams.get('metric');
    assert.ok(metric, 'metric param should be present');
    const parts = metric.split(',');
    assert.ok(parts.includes('views'), 'defaults should include views');
    assert.ok(parts.includes('likes'), 'defaults should include likes');
    assert.ok(parts.includes('replies'), 'defaults should include replies');
    assert.ok(parts.includes('reposts'), 'defaults should include reposts');
    assert.ok(parts.includes('quotes'), 'defaults should include quotes');
    assert.ok(parts.includes('shares'), 'defaults should include shares');
  });
});

// ---------------------------------------------------------------------------
// getAccountInsights
// ---------------------------------------------------------------------------

describe('getAccountInsights', () => {
  it('calls the correct URL path with metric, since, and until params', async () => {
    const client = makeClient();

    await getAccountInsights(client, 'user123', ['views', 'likes'], 1712991600, 1713000000);

    assert.equal(client._mock.calls.length, 1);
    const { url } = client._mock.calls[0];
    const parsed = new URL(url);

    assert.ok(
      parsed.pathname.endsWith('/user123/threads_insights'),
      `expected pathname to end with /user123/threads_insights, got: ${parsed.pathname}`,
    );
    assert.equal(
      parsed.searchParams.get('metric'),
      'views,likes',
      'metric param should be a comma-separated string',
    );
    assert.equal(
      parsed.searchParams.get('since'),
      '1712991600',
      'since param should be present and correct',
    );
    assert.equal(
      parsed.searchParams.get('until'),
      '1713000000',
      'until param should be present and correct',
    );
  });

  it('uses default metrics and omits since/until when not provided', async () => {
    const client = makeClient();

    await getAccountInsights(client, 'user456');

    assert.equal(client._mock.calls.length, 1);
    const { url } = client._mock.calls[0];
    const parsed = new URL(url);

    assert.ok(
      parsed.pathname.endsWith('/user456/threads_insights'),
      `expected pathname to end with /user456/threads_insights, got: ${parsed.pathname}`,
    );

    const metric = parsed.searchParams.get('metric');
    assert.ok(metric, 'metric param should be present');
    const parts = metric.split(',');
    assert.ok(parts.includes('views'), 'defaults should include views');
    assert.ok(parts.includes('likes'), 'defaults should include likes');
    assert.ok(parts.includes('replies'), 'defaults should include replies');
    assert.ok(parts.includes('reposts'), 'defaults should include reposts');
    assert.ok(parts.includes('quotes'), 'defaults should include quotes');
    assert.ok(parts.includes('followers_count'), 'defaults should include followers_count');

    assert.equal(parsed.searchParams.get('since'), null, 'since should be absent when not provided');
    assert.equal(parsed.searchParams.get('until'), null, 'until should be absent when not provided');
  });
});
