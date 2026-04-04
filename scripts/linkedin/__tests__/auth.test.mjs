/**
 * Tests for scripts/linkedin/auth.mjs
 * Run: node --test scripts/linkedin/__tests__/auth.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  loadToken,
  saveToken,
  isTokenValid,
  buildAuthUrl,
  exchangeCode,
  formatTokenStatus,
} from '../auth.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTempFile(dir) {
  return join(dir, 'token.json');
}

function makeMockFetch(status, body) {
  return async (_url, _init) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function makeCapturingFetch(status, body) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return makeMockFetch(status, body)(url, init);
  };
  fn.calls = calls;
  return fn;
}

// ---------------------------------------------------------------------------
// loadToken
// ---------------------------------------------------------------------------

describe('loadToken', () => {
  it('returns null when file does not exist', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = join(dir, 'nonexistent.json');
    assert.equal(loadToken(path), null);
  });

  it('returns parsed object when file has valid JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = makeTempFile(dir);
    const token = { accessToken: 'abc', expiresAt: Date.now() + 3600000, memberId: 'u1', memberName: 'Alice' };
    writeFileSync(path, JSON.stringify(token));
    assert.deepEqual(loadToken(path), token);
  });

  it('returns null when file has invalid JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = makeTempFile(dir);
    writeFileSync(path, 'not-valid-json{{{');
    assert.equal(loadToken(path), null);
  });
});

// ---------------------------------------------------------------------------
// saveToken
// ---------------------------------------------------------------------------

describe('saveToken', () => {
  it('creates file at specified path', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = makeTempFile(dir);
    const token = { accessToken: 'tok', expiresAt: Date.now() + 3600000, memberId: 'u1', memberName: 'Alice' };
    saveToken(token, path);
    assert.ok(existsSync(path));
  });

  it('written file parses back to the same object', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = makeTempFile(dir);
    const token = { accessToken: 'tok', expiresAt: 9999999999000, memberId: 'u2', memberName: 'Bob' };
    saveToken(token, path);
    const loaded = loadToken(path);
    assert.deepEqual(loaded, token);
  });

  it('file permissions are 0o600', () => {
    const dir = mkdtempSync(join(tmpdir(), 'li-test-'));
    const path = makeTempFile(dir);
    const token = { accessToken: 'tok', expiresAt: Date.now() + 3600000, memberId: 'u3', memberName: 'Carol' };
    saveToken(token, path);
    const mode = statSync(path).mode & 0o777;
    assert.equal(mode, 0o600);
  });
});

// ---------------------------------------------------------------------------
// isTokenValid
// ---------------------------------------------------------------------------

describe('isTokenValid', () => {
  it('returns false for null', () => {
    assert.equal(isTokenValid(null), false);
  });

  it('returns false for {} (no accessToken)', () => {
    assert.equal(isTokenValid({}), false);
  });

  it('returns false when expiresAt is in the past', () => {
    const token = { accessToken: 'tok', expiresAt: Date.now() - 1000 };
    assert.equal(isTokenValid(token), false);
  });

  it('returns true when accessToken is set and expiresAt is in the future', () => {
    const token = { accessToken: 'tok', expiresAt: Date.now() + 3600000 };
    assert.equal(isTokenValid(token), true);
  });
});

// ---------------------------------------------------------------------------
// buildAuthUrl
// ---------------------------------------------------------------------------

describe('buildAuthUrl', () => {
  const opts = { clientId: 'testclient', redirectUri: 'http://localhost:3910/callback' };

  it('returns string starting with LinkedIn authorization base URL', () => {
    const url = buildAuthUrl(opts);
    assert.ok(url.startsWith('https://www.linkedin.com/oauth/v2/authorization'));
  });

  it('contains client_id=testclient', () => {
    const url = buildAuthUrl(opts);
    assert.ok(url.includes('client_id=testclient'));
  });

  it('contains URL-encoded redirect_uri', () => {
    const url = buildAuthUrl(opts);
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('redirect_uri'), opts.redirectUri);
  });

  it('contains all three required scopes in scope param', () => {
    const url = buildAuthUrl(opts);
    const parsed = new URL(url);
    const scope = parsed.searchParams.get('scope');
    assert.ok(scope.includes('w_member_social'));
    assert.ok(scope.includes('openid'));
    assert.ok(scope.includes('profile'));
  });

  it('contains response_type=code', () => {
    const url = buildAuthUrl(opts);
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('response_type'), 'code');
  });

  it('contains non-empty state param', () => {
    const url = buildAuthUrl(opts);
    const parsed = new URL(url);
    const state = parsed.searchParams.get('state');
    assert.ok(state && state.length > 0);
  });

  it('two successive calls return different state values', () => {
    const url1 = buildAuthUrl(opts);
    const url2 = buildAuthUrl(opts);
    const state1 = new URL(url1).searchParams.get('state');
    const state2 = new URL(url2).searchParams.get('state');
    assert.notEqual(state1, state2);
  });
});

// ---------------------------------------------------------------------------
// exchangeCode
// ---------------------------------------------------------------------------

describe('exchangeCode', () => {
  const codeOpts = {
    code: 'auth_code_123',
    clientId: 'cid',
    clientSecret: 'csecret',
    redirectUri: 'http://localhost:3910/callback',
  };

  it('calls fetch with https://www.linkedin.com/oauth/v2/accessToken', async () => {
    const mockFetch = makeCapturingFetch(200, { access_token: 'tok', expires_in: 5184000 });
    await exchangeCode(codeOpts, mockFetch);
    assert.equal(mockFetch.calls[0].url, 'https://www.linkedin.com/oauth/v2/accessToken');
  });

  it('uses method POST', async () => {
    const mockFetch = makeCapturingFetch(200, { access_token: 'tok', expires_in: 5184000 });
    await exchangeCode(codeOpts, mockFetch);
    assert.equal(mockFetch.calls[0].init.method, 'POST');
  });

  it('sends Content-Type: application/x-www-form-urlencoded', async () => {
    const mockFetch = makeCapturingFetch(200, { access_token: 'tok', expires_in: 5184000 });
    await exchangeCode(codeOpts, mockFetch);
    assert.equal(
      mockFetch.calls[0].init.headers['Content-Type'],
      'application/x-www-form-urlencoded',
    );
  });

  it('body contains grant_type=authorization_code', async () => {
    const mockFetch = makeCapturingFetch(200, { access_token: 'tok', expires_in: 5184000 });
    await exchangeCode(codeOpts, mockFetch);
    const body = mockFetch.calls[0].init.body;
    assert.ok(body.includes('grant_type=authorization_code'));
  });

  it('returns parsed JSON on 200', async () => {
    const expected = { access_token: 'tok', expires_in: 5184000 };
    const mockFetch = makeCapturingFetch(200, expected);
    const result = await exchangeCode(codeOpts, mockFetch);
    assert.deepEqual(result, expected);
  });

  it('throws Error on 400', async () => {
    const mockFetch = makeMockFetch(400, 'invalid_grant');
    await assert.rejects(
      () => exchangeCode(codeOpts, mockFetch),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes('400'));
        return true;
      },
    );
  });
});

// ---------------------------------------------------------------------------
// formatTokenStatus
// ---------------------------------------------------------------------------

describe('formatTokenStatus', () => {
  it('returns string containing "No token" when token is null', () => {
    const status = formatTokenStatus(null);
    assert.ok(status.includes('No token'));
  });

  it('returns string containing "EXPIRED" when expiresAt is in the past', () => {
    const token = { accessToken: 'tok', expiresAt: Date.now() - 1000 };
    const status = formatTokenStatus(token);
    assert.ok(status.includes('EXPIRED'));
  });

  it('returns string containing "valid" when token is valid', () => {
    const token = { accessToken: 'tok', expiresAt: Date.now() + 3600000, memberId: 'u1', memberName: 'Alice' };
    const status = formatTokenStatus(token);
    assert.ok(status.includes('valid'));
  });

  it('includes memberName in status string when present', () => {
    const token = { accessToken: 'tok', expiresAt: Date.now() + 3600000, memberId: 'u1', memberName: 'Alice' };
    const status = formatTokenStatus(token);
    assert.ok(status.includes('Alice'));
  });
});
