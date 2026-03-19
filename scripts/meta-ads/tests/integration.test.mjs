import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../index.mjs';

// Capture last fetch call args
let lastUrl;
let lastInit;

function mockFetch(status, body, headers = {}) {
  globalThis.fetch = async (url, init) => {
    lastUrl = url;
    lastInit = init;
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: (name) => headers[name.toLowerCase()] ?? null },
      text: async () => JSON.stringify(body),
    };
  };
}

// Set required env vars before all tests
process.env.META_SYSTEM_USER_ACCESS_TOKEN = 'test-token';
process.env.META_AD_ACCOUNT_ID = 'act_111';

describe('integration', () => {
  it('campaigns list', async () => {
    mockFetch(200, { data: [{ id: '1', name: 'My Campaign', status: 'ACTIVE' }] });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['campaigns', 'list']);
    console.log = origLog;
    assert.ok(captured.includes('My Campaign'), `Expected "My Campaign" in output, got: ${captured}`);
  });

  it('campaigns list --pretty', async () => {
    mockFetch(200, { data: [{ id: '1', name: 'My Campaign', status: 'ACTIVE' }] });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['campaigns', 'list', '--pretty']);
    console.log = origLog;
    assert.ok(captured.includes('id'), `Expected "id" table header in output, got: ${captured}`);
  });

  it('campaigns get', async () => {
    mockFetch(200, { id: '123', name: 'Test' });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['campaigns', 'get', '123']);
    console.log = origLog;
    assert.ok(lastUrl.includes('/123'), `Expected URL to contain "/123", got: ${lastUrl}`);
  });

  it('campaigns create', async () => {
    mockFetch(200, { id: 'new123', success: true });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['campaigns', 'create', '--name', 'Test Camp', '--objective', 'OUTCOME_TRAFFIC']);
    console.log = origLog;
    assert.equal(lastInit.method, 'POST');
    assert.ok(lastInit.body.includes('Test Camp'), `Expected "Test Camp" in body, got: ${lastInit.body}`);
  });

  it('campaigns delete', async () => {
    mockFetch(200, { success: true });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['campaigns', 'delete', '456']);
    console.log = origLog;
    assert.ok(lastUrl.includes('/456'), `Expected URL to contain "/456", got: ${lastUrl}`);
    assert.equal(lastInit.method, 'DELETE');
  });

  it('adsets list', async () => {
    mockFetch(200, { data: [] });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['adsets', 'list', '--campaign', '789']);
    console.log = origLog;
    assert.ok(lastUrl.includes('/789/adsets'), `Expected URL to contain "/789/adsets", got: ${lastUrl}`);
  });

  it('ads list', async () => {
    mockFetch(200, { data: [] });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['ads', 'list']);
    console.log = origLog;
    assert.ok(lastUrl.includes('/ads'), `Expected URL to contain "/ads", got: ${lastUrl}`);
  });

  it('insights', async () => {
    mockFetch(200, { data: [{ impressions: '500' }] });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['insights', '999', '--preset', 'last_30d']);
    console.log = origLog;
    assert.ok(lastUrl.includes('/999/insights'), `Expected URL to contain "/999/insights", got: ${lastUrl}`);
    assert.ok(lastUrl.includes('date_preset=last_30d'), `Expected URL to contain "date_preset=last_30d", got: ${lastUrl}`);
  });

  it('missing env var', async () => {
    const savedToken = process.env.META_SYSTEM_USER_ACCESS_TOKEN;
    delete process.env.META_SYSTEM_USER_ACCESS_TOKEN;
    let exitCode = null;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; throw new Error('process.exit:' + code); };
    try {
      await run([]);
    } catch (e) {
      if (!e.message.startsWith('process.exit:')) throw e;
    } finally {
      process.exit = origExit;
      process.env.META_SYSTEM_USER_ACCESS_TOKEN = savedToken;
    }
    assert.equal(exitCode, 1);
  });

  it('API error', async () => {
    mockFetch(400, { error: { message: 'Bad request', code: 100, type: 'GraphAPIException', fbtrace_id: 'xyz' } });
    let exitCode = null;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; throw new Error('process.exit:' + code); };
    try {
      await run(['campaigns', 'list']);
    } catch (e) {
      if (!e.message.startsWith('process.exit:')) throw e;
    } finally {
      process.exit = origExit;
    }
    assert.equal(exitCode, 1);
  });
});
