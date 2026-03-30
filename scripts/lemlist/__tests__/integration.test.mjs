import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { run, USAGE } from '../index.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wraps a fn() call, intercepting process.stdout.write, process.stderr.write,
 * and process.exit so tests can assert on output and exit codes without
 * actually terminating the process.
 *
 * Strategy: do NOT throw after mocking process.exit — every process.exit()
 * call in run() is immediately followed by `return`, so execution stops there
 * naturally without needing to interrupt the call stack.
 */
function withInterceptedExit(fn) {
  return new Promise(async (resolve) => {
    const stdoutWrites = [];
    const stderrWrites = [];
    let exitCode = null;

    const origStdoutWrite = process.stdout.write.bind(process.stdout);
    const origStderrWrite = process.stderr.write.bind(process.stderr);
    const origExit = process.exit.bind(process);

    process.stdout.write = (chunk) => { stdoutWrites.push(String(chunk)); return true; };
    process.stderr.write = (chunk) => { stderrWrites.push(String(chunk)); return true; };
    // Record the first exit code; don't throw so that the `return` following
    // every process.exit() call in run() halts execution cleanly.
    process.exit = (code) => {
      if (exitCode === null) exitCode = code ?? 0;
    };

    try {
      await fn();
    } catch (_err) {
      // Unexpected uncaught error; exitCode stays null → resolved as 1 below
      if (exitCode === null) exitCode = 1;
    } finally {
      process.stdout.write = origStdoutWrite;
      process.stderr.write = origStderrWrite;
      process.exit = origExit;
    }

    resolve({
      stdout: stdoutWrites.join(''),
      stderr: stderrWrites.join(''),
      exitCode: exitCode ?? 0,
    });
  });
}

/**
 * Returns a minimal fetch-compatible response object.
 */
function mockResponse(data, status = 200) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    text: async () => body,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('LemList CLI — integration', () => {
  let savedApiKey;
  let origFetch;

  beforeEach(() => {
    savedApiKey = process.env.LEMLIST_API_KEY;
    origFetch = globalThis.fetch;
  });

  afterEach(() => {
    if (savedApiKey === undefined) {
      delete process.env.LEMLIST_API_KEY;
    } else {
      process.env.LEMLIST_API_KEY = savedApiKey;
    }
    globalThis.fetch = origFetch;
  });

  // -------------------------------------------------------------------------
  // 1. Unknown resource → USAGE on stdout, exits 0
  // -------------------------------------------------------------------------
  it('unknown resource → prints USAGE to stdout and exits 0', async () => {
    // API key must be present — the unknown-resource else-branch is reached
    // only after the key check at the top of run().
    process.env.LEMLIST_API_KEY = 'test-key';

    const { stdout, exitCode } = await withInterceptedExit(() =>
      run(['node', 'index.mjs', 'unknown-resource'])
    );

    assert.equal(exitCode, 0, 'exit code should be 0');
    assert.ok(stdout.includes('Lemlist CLI'), 'stdout should contain USAGE header');
    assert.equal(stdout, USAGE, 'stdout should equal the exported USAGE string');
  });

  // -------------------------------------------------------------------------
  // 2. Missing LEMLIST_API_KEY → stderr message, exit 1
  // -------------------------------------------------------------------------
  it('missing LEMLIST_API_KEY → writes error to stderr and exits 1', async () => {
    delete process.env.LEMLIST_API_KEY;

    const { stderr, exitCode } = await withInterceptedExit(() =>
      run(['node', 'index.mjs', 'campaigns', 'list'])
    );

    assert.equal(exitCode, 1, 'exit code should be 1');
    assert.ok(stderr.includes('LEMLIST_API_KEY'), 'stderr should mention LEMLIST_API_KEY');
  });

  // -------------------------------------------------------------------------
  // 3. campaigns list success — correct HTTP call made
  // -------------------------------------------------------------------------
  it('campaigns list — calls correct URL with version=v2 and Basic auth', async () => {
    process.env.LEMLIST_API_KEY = 'test-key';

    let capturedUrl;
    let capturedInit;

    globalThis.fetch = async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return mockResponse({ results: [] });
    };

    const { exitCode } = await withInterceptedExit(() =>
      run(['node', 'index.mjs', 'campaigns', 'list'])
    );

    assert.equal(exitCode, 0, 'exit code should be 0');
    assert.ok(capturedUrl, 'fetch should have been called');
    assert.ok(capturedUrl.includes('/campaigns'), 'URL should contain /campaigns');
    assert.ok(capturedUrl.includes('version=v2'), 'URL should contain version=v2 query param');

    const expectedAuth = 'Basic ' + Buffer.from(':test-key').toString('base64');
    assert.equal(
      capturedInit.headers.Authorization,
      expectedAuth,
      'Authorization header should use Basic auth with the configured API key'
    );
  });

  // -------------------------------------------------------------------------
  // 4. campaigns get — passes correct campaign ID in URL
  // -------------------------------------------------------------------------
  it('campaigns get — includes campaign ID in the request URL', async () => {
    process.env.LEMLIST_API_KEY = 'test-key';

    let capturedUrl;

    globalThis.fetch = async (url) => {
      capturedUrl = url;
      return mockResponse({ _id: 'cam_test123', name: 'Test Campaign' });
    };

    const { exitCode } = await withInterceptedExit(() =>
      run(['node', 'index.mjs', 'campaigns', 'get', 'cam_test123'])
    );

    assert.equal(exitCode, 0, 'exit code should be 0');
    assert.ok(capturedUrl, 'fetch should have been called');
    assert.ok(
      capturedUrl.includes('/campaigns/cam_test123'),
      `URL should include /campaigns/cam_test123, got: ${capturedUrl}`
    );
  });

  // -------------------------------------------------------------------------
  // 5. Missing required positional arg — error to stderr, exit 1
  // -------------------------------------------------------------------------
  it('campaigns get without campaign-id → writes error to stderr and exits 1', async () => {
    process.env.LEMLIST_API_KEY = 'test-key';

    globalThis.fetch = async () => {
      throw new Error('fetch should not be called when required arg is missing');
    };

    const { stderr, exitCode } = await withInterceptedExit(() =>
      run(['node', 'index.mjs', 'campaigns', 'get'])
    );

    assert.equal(exitCode, 1, 'exit code should be 1');
    assert.ok(stderr.length > 0, 'stderr should contain an error message');
    assert.ok(
      stderr.toLowerCase().includes('campaign') || stderr.toLowerCase().includes('required'),
      `stderr should mention missing campaign-id or required argument, got: ${stderr}`
    );
  });
});
