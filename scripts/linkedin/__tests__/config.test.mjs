/**
 * Tests for scripts/linkedin/config.mjs
 * Run: node --test scripts/linkedin/__tests__/config.test.mjs
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  LINKEDIN_API_BASE,
  LINKEDIN_AUTH_BASE,
  DEFAULT_REDIRECT_URI,
  REQUIRED_SCOPES,
  getTokenFilePath,
  getConfig,
} from '../config.mjs';

describe('constants', () => {
  it('LINKEDIN_API_BASE equals https://api.linkedin.com/v2', () => {
    assert.equal(LINKEDIN_API_BASE, 'https://api.linkedin.com/v2');
  });

  it('LINKEDIN_AUTH_BASE equals https://www.linkedin.com/oauth/v2', () => {
    assert.equal(LINKEDIN_AUTH_BASE, 'https://www.linkedin.com/oauth/v2');
  });

  it('DEFAULT_REDIRECT_URI equals http://localhost:3910/callback', () => {
    assert.equal(DEFAULT_REDIRECT_URI, 'http://localhost:3910/callback');
  });

  it('REQUIRED_SCOPES contains w_member_social, openid, profile', () => {
    assert.ok(Array.isArray(REQUIRED_SCOPES));
    assert.ok(REQUIRED_SCOPES.includes('w_member_social'));
    assert.ok(REQUIRED_SCOPES.includes('openid'));
    assert.ok(REQUIRED_SCOPES.includes('profile'));
  });
});

describe('getTokenFilePath', () => {
  it('returns a string ending with .linkedin-token.json', () => {
    const result = getTokenFilePath();
    assert.equal(typeof result, 'string');
    assert.ok(result.endsWith('.linkedin-token.json'), `Expected path to end with .linkedin-token.json, got: ${result}`);
  });
});

describe('getConfig', () => {
  let savedEnv;

  before(() => {
    savedEnv = {
      LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
      LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
      LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
    };
  });

  after(() => {
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('returns { clientId, clientSecret, redirectUri } when all env vars are set', () => {
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id';
    process.env.LINKEDIN_CLIENT_SECRET = 'test-client-secret';
    process.env.LINKEDIN_REDIRECT_URI = 'http://localhost:8080/cb';

    const config = getConfig();
    assert.deepEqual(config, {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'http://localhost:8080/cb',
    });
  });

  it('throws Error mentioning LINKEDIN_CLIENT_ID when it is missing', () => {
    delete process.env.LINKEDIN_CLIENT_ID;
    process.env.LINKEDIN_CLIENT_SECRET = 'test-client-secret';
    delete process.env.LINKEDIN_REDIRECT_URI;

    assert.throws(
      () => getConfig(),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes('LINKEDIN_CLIENT_ID'), `Expected message to mention LINKEDIN_CLIENT_ID, got: ${err.message}`);
        return true;
      },
    );
  });

  it('throws Error mentioning LINKEDIN_CLIENT_SECRET when it is missing', () => {
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id';
    delete process.env.LINKEDIN_CLIENT_SECRET;
    delete process.env.LINKEDIN_REDIRECT_URI;

    assert.throws(
      () => getConfig(),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes('LINKEDIN_CLIENT_SECRET'), `Expected message to mention LINKEDIN_CLIENT_SECRET, got: ${err.message}`);
        return true;
      },
    );
  });

  it('returns DEFAULT_REDIRECT_URI when LINKEDIN_REDIRECT_URI is not set', () => {
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id';
    process.env.LINKEDIN_CLIENT_SECRET = 'test-client-secret';
    delete process.env.LINKEDIN_REDIRECT_URI;

    const config = getConfig();
    assert.equal(config.redirectUri, DEFAULT_REDIRECT_URI);
  });

  it('uses process.env.LINKEDIN_REDIRECT_URI when set', () => {
    process.env.LINKEDIN_CLIENT_ID = 'test-client-id';
    process.env.LINKEDIN_CLIENT_SECRET = 'test-client-secret';
    process.env.LINKEDIN_REDIRECT_URI = 'https://example.com/auth/callback';

    const config = getConfig();
    assert.equal(config.redirectUri, 'https://example.com/auth/callback');
  });
});
