/**
 * Integration tests for the Threads CLI `run(argv)` entry point.
 *
 * Requires: scripts/threads/index.mjs exporting `run(argv)`.
 * Uses: node:test + node:assert/strict only.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../index.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MOCK_ENV = {
  THREADS_ACCESS_TOKEN: 'test-token',
  THREADS_USER_ID: 'test-user-id',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a mock fetch that returns the given JSON payload.
 * Captures all calls for URL inspection.
 */
function makeCapturingFetch(json = {}, { ok = true, status = 200 } = {}) {
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

/**
 * Temporarily redirect process.stdout.write and process.stderr.write,
 * run an async fn, then restore.
 * Returns { stdout, stderr, error } — error is set if fn() threw.
 * Never rethrows, so captured output is always available.
 */
async function captureOutput(fn) {
  let stdout = '';
  let stderr = '';
  const origStdout = process.stdout.write.bind(process.stdout);
  const origStderr = process.stderr.write.bind(process.stderr);
  process.stdout.write = (s) => { stdout += s; return true; };
  process.stderr.write = (s) => { stderr += s; return true; };
  let error;
  try {
    await fn();
  } catch (err) {
    error = err;
  } finally {
    process.stdout.write = origStdout;
    process.stderr.write = origStderr;
  }
  return { stdout, stderr, error };
}

/**
 * Set env vars from MOCK_ENV, saving originals. Returns a restore function.
 */
function applyEnv(overrides = {}) {
  const env = { ...MOCK_ENV, ...overrides };
  const saved = {};
  for (const k of Object.keys(env)) {
    saved[k] = process.env[k];
    process.env[k] = env[k];
  }
  return () => {
    for (const k of Object.keys(env)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  };
}

/**
 * Install a process.exit mock. Returns { exitCode, restore }.
 * Any call to process.exit(n) throws Error(`process.exit(${n})`) so tests
 * can catch it without killing the runner.
 */
function mockProcessExit() {
  let exitCode;
  const origExit = process.exit;
  process.exit = (code) => {
    exitCode = code ?? 0;
    throw new Error(`process.exit(${code ?? 0})`);
  };
  return {
    get exitCode() { return exitCode; },
    restore() { process.exit = origExit; },
  };
}

// ---------------------------------------------------------------------------
// Save/restore globalThis.fetch between every test
// ---------------------------------------------------------------------------

let originalFetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; });

// ---------------------------------------------------------------------------
// 1. --help flag exits 0 and prints usage
// ---------------------------------------------------------------------------

describe('--help', () => {
  it('exits 0 and writes usage text to stdout', async () => {
    const exitMock = mockProcessExit();
    const captured = await captureOutput(() => run(['node', 'index.mjs', '--help']));
    exitMock.restore();

    const combined = captured.stdout + captured.stderr;
    const exitedWithError = exitMock.exitCode !== undefined && exitMock.exitCode !== 0;
    assert.ok(
      !exitedWithError,
      `Expected exit code 0 or no exit for --help, got exit(${exitMock.exitCode}). Output: ${combined}`,
    );
    assert.ok(
      combined.includes('Usage') || combined.includes('usage') || combined.includes('Threads'),
      `Expected usage text in output, got: ${combined}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 2. Missing THREADS_ACCESS_TOKEN → stderr mentions the var name
// ---------------------------------------------------------------------------

describe('missing THREADS_ACCESS_TOKEN', () => {
  it('writes THREADS_ACCESS_TOKEN to stderr when token is empty', async () => {
    const restore = applyEnv({ THREADS_ACCESS_TOKEN: '' });
    const exitMock = mockProcessExit();
    const captured = await captureOutput(() => run(['node', 'index.mjs', 'profile', 'me']));
    restore();
    exitMock.restore();

    const output = captured.stderr + captured.stdout;
    assert.ok(
      output.includes('THREADS_ACCESS_TOKEN'),
      `Expected "THREADS_ACCESS_TOKEN" in output, got: ${output}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 3. profile me — happy path
// ---------------------------------------------------------------------------

describe('profile me', () => {
  it('outputs JSON containing username and id', async () => {
    const profilePayload = { id: 'u1', username: 'testuser' };
    globalThis.fetch = makeCapturingFetch(profilePayload);

    const restore = applyEnv();
    const captured = await captureOutput(() => run(['node', 'index.mjs', 'profile', 'me']));
    restore();

    assert.ok(
      captured.stdout.includes('"username"'),
      `Expected "username" key in stdout, got: ${captured.stdout}`,
    );
    assert.ok(
      captured.stdout.includes('testuser'),
      `Expected "testuser" in stdout, got: ${captured.stdout}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 4. profile me --pretty — pretty-printed JSON
// ---------------------------------------------------------------------------

describe('profile me --pretty', () => {
  it('outputs pretty-printed JSON (contains newlines)', async () => {
    const profilePayload = { id: 'u1', username: 'testuser' };
    globalThis.fetch = makeCapturingFetch(profilePayload);

    const restore = applyEnv();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'profile', 'me', '--pretty']),
    );
    restore();

    assert.ok(
      captured.stdout.includes('\n'),
      `Expected newlines in --pretty output, got: ${JSON.stringify(captured.stdout)}`,
    );
    assert.ok(
      captured.stdout.includes('testuser'),
      `Expected "testuser" in --pretty output, got: ${captured.stdout}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 5. posts list — happy path
// ---------------------------------------------------------------------------

describe('posts list', () => {
  it('outputs JSON with a "data" key', async () => {
    const postsPayload = { data: [] };
    globalThis.fetch = makeCapturingFetch(postsPayload);

    const restore = applyEnv();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'posts', 'list']),
    );
    restore();

    assert.ok(
      captured.stdout.includes('"data"'),
      `Expected "data" key in stdout, got: ${captured.stdout}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 6. insights post — happy path
// ---------------------------------------------------------------------------

describe('insights post', () => {
  it('outputs JSON with insights data', async () => {
    const insightsPayload = { data: [{ name: 'views', values: [] }] };
    globalThis.fetch = makeCapturingFetch(insightsPayload);

    const restore = applyEnv();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'insights', 'post', 'media123']),
    );
    restore();

    assert.ok(
      captured.stdout.includes('"data"'),
      `Expected "data" key in insights output, got: ${captured.stdout}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 7. Unknown resource → stderr contains error indicator
// ---------------------------------------------------------------------------

describe('unknown resource', () => {
  it('outputs usage/error text and exits for an unrecognised command', async () => {
    const restore = applyEnv();
    const exitMock = mockProcessExit();
    // index.mjs writes USAGE to stdout and exits 0 for unrecognised resources.
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'unknown', 'thing']),
    );
    restore();
    exitMock.restore();

    const combined = captured.stdout + captured.stderr;
    const hasUsageOrError = /usage|error|threads cli|unknown|invalid|unrecognised|unrecognized/i.test(combined);
    const didExit = exitMock.exitCode !== undefined;
    assert.ok(
      hasUsageOrError || didExit,
      `Expected usage text or process.exit() for unknown resource, got combined output: ${JSON.stringify(combined)}, exitCode: ${exitMock.exitCode}`,
    );
  });
});

// ---------------------------------------------------------------------------
// 8. Missing required flags → stderr + exit 1
// ---------------------------------------------------------------------------

describe('posts container without --media-type', () => {
  it('writes error to stderr and exits 1', async () => {
    const restore = applyEnv();
    const exitMock = mockProcessExit();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'posts', 'container']),
    );
    restore();
    exitMock.restore();

    assert.ok(
      captured.stderr.includes('--media-type'),
      `Expected "--media-type" in stderr, got: ${captured.stderr}`,
    );
    assert.equal(exitMock.exitCode, 1, `Expected exit code 1, got: ${exitMock.exitCode}`);
  });
});

describe('posts publish without --creation-id', () => {
  it('writes error to stderr and exits 1', async () => {
    const restore = applyEnv();
    const exitMock = mockProcessExit();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'posts', 'publish']),
    );
    restore();
    exitMock.restore();

    assert.ok(
      captured.stderr.includes('--creation-id'),
      `Expected "--creation-id" in stderr, got: ${captured.stderr}`,
    );
    assert.equal(exitMock.exitCode, 1, `Expected exit code 1, got: ${exitMock.exitCode}`);
  });
});

describe('profile lookup without --username', () => {
  it('writes error to stderr and exits 1', async () => {
    const restore = applyEnv();
    const exitMock = mockProcessExit();
    const captured = await captureOutput(() =>
      run(['node', 'index.mjs', 'profile', 'lookup']),
    );
    restore();
    exitMock.restore();

    assert.ok(
      captured.stderr.includes('--username'),
      `Expected "--username" in stderr, got: ${captured.stderr}`,
    );
    assert.equal(exitMock.exitCode, 1, `Expected exit code 1, got: ${exitMock.exitCode}`);
  });
});

// ---------------------------------------------------------------------------
// 9. replies hide — URL contains replyId/manage_reply
// ---------------------------------------------------------------------------

describe('replies hide', () => {
  it('calls the manage_reply endpoint for the given reply ID', async () => {
    const mockFetch = makeCapturingFetch({ success: true });
    globalThis.fetch = mockFetch;

    const restore = applyEnv();
    await captureOutput(() =>
      run(['node', 'index.mjs', 'replies', 'hide', 'reply456']),
    );
    restore();

    assert.ok(
      mockFetch.calls.length >= 1,
      'Expected at least one fetch call',
    );
    const calledUrl = mockFetch.calls[mockFetch.calls.length - 1].url;
    assert.ok(
      calledUrl.includes('reply456') && calledUrl.includes('manage_reply'),
      `Expected URL to contain "reply456/manage_reply", got: ${calledUrl}`,
    );
  });
});
