import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// This import MUST fail until client.mjs is implemented (TDD Wave 1).
import { createClient, MetaApiError, RateLimitError } from '../client.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockFetch(status, body, headers = {}) {
  return async (url, init) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name.toLowerCase()] ?? headers[name] ?? null },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

// Captures (url, init) arguments of every fetch call.
function makeCapturingFetch(status, body, headers = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return makeMockFetch(status, body, headers)(url, init);
  };
  fn.calls = calls;
  return fn;
}

const TOKEN = 'test-token-abc';
const AD_ACCOUNT_ID = 'act_123456';

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('createClient', () => {
  // 1. Shape of returned object
  it('returns an object with get, post, patch, delete methods and adAccountId property', () => {
    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    assert.equal(typeof client.get, 'function', 'client.get should be a function');
    assert.equal(typeof client.post, 'function', 'client.post should be a function');
    assert.equal(typeof client.patch, 'function', 'client.patch should be a function');
    assert.equal(typeof client.delete, 'function', 'client.delete should be a function');
    assert.equal(client.adAccountId, AD_ACCOUNT_ID, 'client.adAccountId should match constructor arg');
  });

  // 2. GET — URL construction + Authorization header
  it('client.get calls fetch with correct URL and Authorization header', async () => {
    const mock = makeCapturingFetch(200, { data: [] });
    globalThis.fetch = mock;

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await client.get('/some/path', { foo: 'bar' });

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    assert.equal(url, 'https://graph.facebook.com/v25.0/some/path?foo=bar');
    assert.equal(init.headers['Authorization'], `Bearer ${TOKEN}`);
  });

  // 3. POST — method, body, Content-Type header
  it('client.post calls fetch with method POST, JSON body and Content-Type header', async () => {
    const mock = makeCapturingFetch(200, { id: '123' });
    globalThis.fetch = mock;

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await client.post('/some/path', { key: 'val' });

    assert.equal(mock.calls.length, 1);
    const { init } = mock.calls[0];
    assert.equal(init.method, 'POST');
    assert.equal(init.body, JSON.stringify({ key: 'val' }));
    assert.equal(init.headers['Content-Type'], 'application/json');
  });

  // 4. PATCH — method
  it('client.patch calls fetch with method PATCH', async () => {
    const mock = makeCapturingFetch(200, { success: true });
    globalThis.fetch = mock;

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await client.patch('/some/path', {});

    assert.equal(mock.calls.length, 1);
    assert.equal(mock.calls[0].init.method, 'PATCH');
  });

  // 5. DELETE — method
  it('client.delete calls fetch with method DELETE', async () => {
    const mock = makeCapturingFetch(200, { success: true });
    globalThis.fetch = mock;

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await client.delete('/some/path');

    assert.equal(mock.calls.length, 1);
    assert.equal(mock.calls[0].init.method, 'DELETE');
  });

  // 6. Non-ok response → MetaApiError with .code and .fbtrace_id
  it('throws MetaApiError with .code and .fbtrace_id on non-ok response', async () => {
    const errorBody = {
      error: {
        message: 'Invalid token',
        type: 'OAuthException',
        code: 190,
        fbtrace_id: 'abc123',
      },
    };
    globalThis.fetch = makeMockFetch(400, errorBody);

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await assert.rejects(
      () => client.get('/some/path'),
      (err) => {
        assert.ok(err instanceof MetaApiError, 'should be MetaApiError');
        assert.equal(err.code, 190);
        assert.equal(err.fbtrace_id, 'abc123');
        assert.equal(err.type, 'OAuthException');
        assert.equal(err.message, 'Invalid token');
        return true;
      },
    );
  });

  // 7. error.code 80004 → RateLimitError
  it('throws RateLimitError when error.code is 80004', async () => {
    const errorBody = {
      error: {
        message: 'Rate limit hit',
        type: 'OAuthException',
        code: 80004,
        fbtrace_id: 'rl456',
      },
    };
    globalThis.fetch = makeMockFetch(429, errorBody);

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await assert.rejects(
      () => client.get('/some/path'),
      (err) => {
        assert.ok(err instanceof RateLimitError, 'should be RateLimitError');
        assert.ok(err instanceof MetaApiError, 'RateLimitError should extend MetaApiError');
        assert.equal(err.code, 80004);
        return true;
      },
    );
  });

  // 8. X-Business-Use-Case-Usage >= 80 → stderr warning
  it('prints a warning to stderr when X-Business-Use-Case-Usage has a value >= 80', async () => {
    const usageHeader = JSON.stringify({
      act_123: [
        {
          call_count: 85,
          type: 'ads_management',
          estimated_time_to_regain_access: 0,
          total_cputime: 5,
          total_time: 7,
        },
      ],
    });

    globalThis.fetch = makeMockFetch(200, { data: [] }, {
      'x-business-use-case-usage': usageHeader,
    });

    // Capture stderr output
    const originalWrite = process.stderr.write.bind(process.stderr);
    const stderrOutput = [];
    process.stderr.write = (chunk, ...args) => {
      stderrOutput.push(String(chunk));
      return originalWrite(chunk, ...args);
    };

    try {
      const client = createClient(TOKEN, AD_ACCOUNT_ID);
      await client.get('/some/path');
    } finally {
      process.stderr.write = originalWrite;
    }

    assert.ok(
      stderrOutput.length > 0,
      'expected at least one stderr write when usage >= 80',
    );
    const combined = stderrOutput.join('');
    assert.ok(
      combined.includes('85') || combined.toLowerCase().includes('rate') || combined.toLowerCase().includes('usage') || combined.toLowerCase().includes('warn'),
      `stderr warning should mention the high usage value; got: ${combined}`,
    );
  });

  // 9. X-Business-Use-Case-Usage < 80 → no stderr warning
  it('does not print a warning to stderr when X-Business-Use-Case-Usage values are all below 80', async () => {
    const usageHeader = JSON.stringify({
      act_123: [
        {
          call_count: 50,
          type: 'ads_management',
          estimated_time_to_regain_access: 0,
          total_cputime: 3,
          total_time: 4,
        },
      ],
    });

    globalThis.fetch = makeMockFetch(200, { data: [] }, {
      'x-business-use-case-usage': usageHeader,
    });

    const originalWrite = process.stderr.write.bind(process.stderr);
    const stderrOutput = [];
    process.stderr.write = (chunk, ...args) => {
      stderrOutput.push(String(chunk));
      return originalWrite(chunk, ...args);
    };

    try {
      const client = createClient(TOKEN, AD_ACCOUNT_ID);
      await client.get('/some/path');
    } finally {
      process.stderr.write = originalWrite;
    }

    assert.equal(
      stderrOutput.length,
      0,
      `expected no stderr output when usage < 80; got: ${stderrOutput.join('')}`,
    );
  });

  // 10. GET with no params → no query string appended
  it('client.get with no params calls fetch with URL ending at the path (no query string)', async () => {
    const mock = makeCapturingFetch(200, { data: [] });
    globalThis.fetch = mock;

    const client = createClient(TOKEN, AD_ACCOUNT_ID);
    await client.get('/some/path');

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    assert.equal(url, 'https://graph.facebook.com/v25.0/some/path');
    assert.ok(!url.includes('?'), 'URL should not contain a query string when no params provided');
  });
});
