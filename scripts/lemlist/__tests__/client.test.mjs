import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '../client.mjs';
import { LemlistApiError } from '../errors.mjs';

function makeCapturingFetch({ ok = true, status = 200, body = '{}', headers = {} } = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok,
      status,
      headers: { get: (h) => headers[h.toLowerCase()] ?? null },
      text: async () => body,
    };
  };
  fn.calls = calls;
  return fn;
}

describe('createClient', () => {
  it('returns object with request function', () => {
    const client = createClient('test-key');
    assert.equal(typeof client, 'object');
    assert.equal(typeof client.request, 'function');
  });

  it('sends Basic auth header with :<apiKey> base64-encoded', async () => {
    const fetch = makeCapturingFetch();
    const client = createClient('my-api-key', fetch);
    await client.request({ path: '/campaigns' });

    const authHeader = fetch.calls[0].init.headers['Authorization'];
    assert.ok(authHeader, 'Authorization header should be present');
    assert.ok(authHeader.startsWith('Basic '), 'Should start with "Basic "');

    const b64 = authHeader.slice('Basic '.length);
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    assert.equal(decoded, ':my-api-key');
  });

  it('happy path: 200 JSON response is parsed and returned', async () => {
    const fetch = makeCapturingFetch({ body: '{"id":"camp_1","name":"Test"}' });
    const client = createClient('key', fetch);
    const result = await client.request({ path: '/campaigns/camp_1' });
    assert.deepEqual(result, { id: 'camp_1', name: 'Test' });
  });

  it('401 plain text error throws LemlistApiError with status 401', async () => {
    const fetch = makeCapturingFetch({ ok: false, status: 401, body: 'Unauthorized' });
    const client = createClient('key', fetch);
    await assert.rejects(
      () => client.request({ path: '/campaigns' }),
      (err) => {
        assert.ok(err instanceof LemlistApiError);
        assert.equal(err.status, 401);
        assert.ok(err.message.includes('Unauthorized'));
        return true;
      },
    );
  });

  it('404 plain text error throws LemlistApiError with status 404', async () => {
    const fetch = makeCapturingFetch({ ok: false, status: 404, body: 'Not Found' });
    const client = createClient('key', fetch);
    await assert.rejects(
      () => client.request({ path: '/campaigns/nope' }),
      (err) => {
        assert.ok(err instanceof LemlistApiError);
        assert.equal(err.status, 404);
        return true;
      },
    );
  });

  it('429 rate limit: retries once after Retry-After delay, fetch called twice', async () => {
    const calls = [];
    let callCount = 0;
    const retryFetch = async (url, init) => {
      calls.push({ url, init });
      callCount++;
      if (callCount === 1) {
        return {
          ok: false,
          status: 429,
          headers: { get: (h) => (h.toLowerCase() === 'retry-after' ? '0' : null) },
          text: async () => 'Too Many Requests',
        };
      }
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        text: async () => '{"ok":true}',
      };
    };

    const client = createClient('key', retryFetch);
    const result = await client.request({ path: '/campaigns' });
    assert.equal(calls.length, 2);
    assert.deepEqual(result, { ok: true });
  });

  it('500 with "Lead in graveyard" body throws LemlistApiError with graveyard: true', async () => {
    const fetch = makeCapturingFetch({ ok: false, status: 500, body: 'Lead in graveyard' });
    const client = createClient('key', fetch);
    await assert.rejects(
      () => client.request({ path: '/leads/xxx' }),
      (err) => {
        assert.ok(err instanceof LemlistApiError);
        assert.equal(err.graveyard, true);
        return true;
      },
    );
  });

  it('apiVersion v2-query adds version=v2 to query string', async () => {
    const fetch = makeCapturingFetch();
    const client = createClient('key', fetch);
    await client.request({ path: '/contacts', apiVersion: 'v2-query' });

    const url = fetch.calls[0].url;
    assert.ok(url.includes('version=v2'), `Expected URL to include version=v2, got: ${url}`);
  });

  it('apiVersion v2-path prepends /v2/ to path', async () => {
    const fetch = makeCapturingFetch();
    const client = createClient('key', fetch);
    await client.request({ path: '/contacts', apiVersion: 'v2-path' });

    const url = new URL(fetch.calls[0].url);
    assert.ok(url.pathname.includes('/v2/'), `Expected path to contain /v2/, got: ${url.pathname}`);
  });

  it('400 JSON error body with code throws LemlistApiError with .code', async () => {
    const fetch = makeCapturingFetch({
      ok: false,
      status: 400,
      body: JSON.stringify({
        success: false,
        error: { code: 'MISSING_IDENTIFIER', message: 'Identifier is required' },
      }),
    });
    const client = createClient('key', fetch);
    await assert.rejects(
      () => client.request({ path: '/contacts' }),
      (err) => {
        assert.ok(err instanceof LemlistApiError);
        assert.equal(err.code, 'MISSING_IDENTIFIER');
        return true;
      },
    );
  });

  it('POST with body sends Content-Type application/json and JSON body', async () => {
    const fetch = makeCapturingFetch({ body: '{"created":true}' });
    const client = createClient('key', fetch);
    const payload = { email: 'test@example.com' };
    await client.request({ method: 'POST', path: '/campaigns', body: payload });

    const { init } = fetch.calls[0];
    assert.equal(init.method, 'POST');
    assert.equal(init.headers['Content-Type'], 'application/json');
    assert.equal(init.body, JSON.stringify(payload));
  });

  it('DELETE method sends DELETE HTTP method', async () => {
    const fetch = makeCapturingFetch({ body: '{"deleted":true}' });
    const client = createClient('key', fetch);
    await client.request({ method: 'DELETE', path: '/campaigns/camp_1' });

    assert.equal(fetch.calls[0].init.method, 'DELETE');
  });
});
