import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../index.mjs';

// ── Token helpers ────────────────────────────────────────────────────────────

let tmpHome;
const originalHome = process.env.HOME;

function tokenFilePath() {
  return join(tmpHome, '.linkedin-token.json');
}

function writeValidToken(overrides = {}) {
  const token = {
    accessToken: 'test-access-token',
    expiresAt: Date.now() + 3600 * 1000, // 1 hour from now
    memberId: 'abc123',
    memberName: 'Test User',
    ...overrides,
  };
  writeFileSync(tokenFilePath(), JSON.stringify(token, null, 2), { mode: 0o600 });
  return token;
}

function removeTokenFile() {
  try { rmSync(tokenFilePath()); } catch { /* ignore */ }
}

// ── Test infrastructure helpers ───────────────────────────────────────────────

/**
 * Run `run(argv, fetchFn)` while capturing stdout and intercepting process.exit.
 * Returns { stdout, stderr, exitCode }.
 * If process.exit is called, exitCode is set and execution stops (throws internally).
 */
async function capture(argv, fetchFn = undefined) {
  let stdout = '';
  let stderr = '';
  let exitCode = null;

  const origLog = console.log;
  const origError = console.error;
  const origStderrWrite = process.stderr.write.bind(process.stderr);
  const origExit = process.exit;

  console.log = (...args) => { stdout += args.join(' ') + '\n'; };
  console.error = (...args) => { stderr += args.join(' ') + '\n'; };
  process.stderr.write = (msg) => { stderr += msg; return true; };
  process.exit = (code) => { exitCode = code; throw new Error('process.exit:' + code); };

  try {
    if (fetchFn !== undefined) {
      await run(argv, fetchFn);
    } else {
      await run(argv);
    }
  } catch (e) {
    if (!e.message.startsWith('process.exit:')) throw e;
  } finally {
    console.log = origLog;
    console.error = origError;
    process.stderr.write = origStderrWrite;
    process.exit = origExit;
  }

  return { stdout, stderr, exitCode };
}

// ── Mock fetch factories ──────────────────────────────────────────────────────

function mockUserInfoFetch() {
  return async (url, init) => {
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      text: async () => JSON.stringify({ sub: 'abc123', name: 'Test User' }),
    };
  };
}

function mockCreatePostFetch() {
  return async (url, init) => {
    return {
      ok: true,
      status: 201,
      headers: { get: (n) => n === 'x-restli-id' ? 'urn:li:share:999' : null },
      text: async () => '{}',
    };
  };
}

let fetchCallCount = 0;
function countingFetch(inner) {
  fetchCallCount = 0;
  return async (url, init) => {
    fetchCallCount++;
    return inner(url, init);
  };
}

// ── Suite setup ───────────────────────────────────────────────────────────────

before(() => {
  tmpHome = mkdtempSync(join(tmpdir(), 'linkedin-test-home-'));
  process.env.HOME = tmpHome;
});

after(() => {
  process.env.HOME = originalHome;
  try { rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
});

afterEach(() => {
  removeTokenFile();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('linkedin CLI', () => {

  // ── auth --status ────────────────────────────────────────────────────────

  describe('auth --status', () => {
    it('with no token file: stdout contains "No token"', async () => {
      const { stdout } = await capture(['auth', '--status']);
      assert.ok(stdout.includes('No token'), `Expected "No token" in stdout, got: ${stdout}`);
    });

    it('with valid token file: stdout contains "valid"', async () => {
      writeValidToken();
      const { stdout } = await capture(['auth', '--status']);
      assert.ok(stdout.toLowerCase().includes('valid'), `Expected "valid" in stdout, got: ${stdout}`);
    });
  });

  // ── whoami ───────────────────────────────────────────────────────────────

  describe('whoami', () => {
    it('with no token: stderr contains "Not authenticated" and exits 1', async () => {
      const { stderr, exitCode } = await capture(['whoami']);
      assert.ok(stderr.includes('Not authenticated'), `Expected "Not authenticated" in stderr, got: ${stderr}`);
      assert.equal(exitCode, 1);
    });

    it('with valid token: calls userinfo URL, stdout contains JSON with sub field', async () => {
      writeValidToken();
      const fetchFn = mockUserInfoFetch();
      const { stdout } = await capture(['whoami'], fetchFn);
      const parsed = JSON.parse(stdout.trim());
      assert.ok(parsed.sub, `Expected "sub" in parsed output, got: ${stdout}`);
      assert.equal(parsed.sub, 'abc123');
    });
  });

  // ── share text ───────────────────────────────────────────────────────────

  describe('share text', () => {
    it('dry-run: stdout contains "[DRY RUN]", fetch NOT called', async () => {
      writeValidToken();
      const tracking = countingFetch(mockCreatePostFetch());
      const { stdout } = await capture(['share', 'text', 'Hello LinkedIn!', '--dry-run'], tracking);
      assert.ok(stdout.includes('[DRY RUN]'), `Expected "[DRY RUN]" in stdout, got: ${stdout}`);
      assert.equal(fetchCallCount, 0, 'Expected fetch NOT to be called for dry-run');
    });

    it('live post: calls fetch, stdout contains "Post created. ID:"', async () => {
      writeValidToken();
      const fetchFn = mockCreatePostFetch();
      const { stdout } = await capture(['share', 'text', 'Hello LinkedIn!'], fetchFn);
      assert.ok(stdout.includes('Post created. ID:'), `Expected "Post created. ID:" in stdout, got: ${stdout}`);
    });
  });

  // ── share article ────────────────────────────────────────────────────────

  describe('share article', () => {
    it('dry-run: stdout contains "[DRY RUN]" and "ARTICLE"', async () => {
      writeValidToken();
      const { stdout } = await capture([
        'share', 'article', 'Commentary',
        '--url', 'https://example.com',
        '--title', 'Test',
        '--dry-run',
      ]);
      assert.ok(stdout.includes('[DRY RUN]'), `Expected "[DRY RUN]" in stdout, got: ${stdout}`);
      assert.ok(stdout.includes('ARTICLE'), `Expected "ARTICLE" in stdout, got: ${stdout}`);
    });
  });

  // ── share image ──────────────────────────────────────────────────────────

  describe('share image', () => {
    it('dry-run: stdout contains "[DRY RUN]" and "IMAGE"', async () => {
      writeValidToken();
      const { stdout } = await capture([
        'share', 'image', 'Caption',
        '--file', './img.png',
        '--dry-run',
      ]);
      assert.ok(stdout.includes('[DRY RUN]'), `Expected "[DRY RUN]" in stdout, got: ${stdout}`);
      assert.ok(stdout.includes('IMAGE'), `Expected "IMAGE" in stdout, got: ${stdout}`);
    });
  });

  // ── unknown command ──────────────────────────────────────────────────────

  describe('unknown command', () => {
    it('exits 1 and stderr contains "Usage:"', async () => {
      const { stderr, exitCode } = await capture(['unknown']);
      assert.equal(exitCode, 1);
      assert.ok(stderr.includes('Usage:'), `Expected "Usage:" in stderr, got: ${stderr}`);
    });
  });

});
