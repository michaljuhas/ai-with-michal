import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getProjectRef, loadConfig } from '../lib/config.mjs';

const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://abctest.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  SUPABASE_PAT: 'test-pat',
};

describe('getProjectRef', () => {
  it('extracts subdomain from a standard Supabase URL', () => {
    assert.equal(getProjectRef('https://xyzabc.supabase.co'), 'xyzabc');
  });
  it('extracts subdomain when URL has a path', () => {
    assert.equal(getProjectRef('https://abcdef.supabase.co/rest/v1'), 'abcdef');
  });
  it('throws on unparseable string', () => {
    assert.throws(() => getProjectRef('not-a-url'), /Invalid Supabase URL/);
  });
});

describe('loadConfig', () => {
  it('returns object with all expected keys when all vars present', () => {
    const cfg = loadConfig(mockEnv);
    assert.ok(cfg.supabaseUrl);
    assert.ok(cfg.serviceRoleKey);
    assert.ok(cfg.projectRef);
  });
  it('supabaseUrl equals NEXT_PUBLIC_SUPABASE_URL', () => {
    assert.equal(loadConfig(mockEnv).supabaseUrl, mockEnv.NEXT_PUBLIC_SUPABASE_URL);
  });
  it('serviceRoleKey equals SUPABASE_SERVICE_ROLE_KEY', () => {
    assert.equal(loadConfig(mockEnv).serviceRoleKey, mockEnv.SUPABASE_SERVICE_ROLE_KEY);
  });
  it('pat equals SUPABASE_PAT when present', () => {
    assert.equal(loadConfig(mockEnv).pat, 'test-pat');
  });
  it('pat is null when SUPABASE_PAT absent', () => {
    const env = { ...mockEnv };
    delete env.SUPABASE_PAT;
    assert.equal(loadConfig(env).pat, null);
  });
  it('projectRef is the subdomain of NEXT_PUBLIC_SUPABASE_URL', () => {
    assert.equal(loadConfig(mockEnv).projectRef, 'abctest');
  });
  it('throws when NEXT_PUBLIC_SUPABASE_URL missing', () => {
    const env = { ...mockEnv };
    delete env.NEXT_PUBLIC_SUPABASE_URL;
    assert.throws(() => loadConfig(env), /NEXT_PUBLIC_SUPABASE_URL/);
  });
  it('throws when SUPABASE_SERVICE_ROLE_KEY missing', () => {
    const env = { ...mockEnv };
    delete env.SUPABASE_SERVICE_ROLE_KEY;
    assert.throws(() => loadConfig(env), /SUPABASE_SERVICE_ROLE_KEY/);
  });
});
