/**
 * Integration tests for scripts/todoist/index.mjs
 * Run: node --test scripts/todoist/tests/integration.test.mjs
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../index.mjs';

// Capture last fetch call args
let lastUrl;
let lastInit;
let origFetch;

// Default mock bodies per method
const DEFAULT_GET_BODY = { results: [], next_cursor: null };
const DEFAULT_POST_BODY = { id: 'task1', content: 'Buy milk' };

function mockFetch(overrides = {}) {
  origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    lastUrl = url;
    lastInit = init;
    const method = (init && init.method) ? init.method.toUpperCase() : 'GET';
    let body;
    if (overrides.body !== undefined) {
      body = overrides.body;
    } else if (method === 'POST') {
      body = DEFAULT_POST_BODY;
    } else {
      body = DEFAULT_GET_BODY;
    }
    const status = overrides.status ?? 200;
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => null },
      text: async () => JSON.stringify(body),
    };
  };
}

function restoreFetch() {
  if (origFetch !== undefined) {
    globalThis.fetch = origFetch;
  }
}

function captureLog(fn) {
  return async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    try {
      await fn();
    } finally {
      console.log = origLog;
    }
    return captured;
  };
}

// Set required env var before all tests
process.env.TODOIST_API_TOKEN = 'test-token';

describe('integration', () => {
  beforeEach(() => {
    lastUrl = undefined;
    lastInit = undefined;
    mockFetch();
  });

  afterEach(() => {
    restoreFetch();
    process.env.TODOIST_API_TOKEN = 'test-token';
  });

  it('tasks list — fetch called with URL containing /tasks, output logged', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['tasks', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/tasks'), `Expected URL to contain "/tasks", got: ${lastUrl}`);
    assert.ok(captured.length > 0, 'Expected some output to be logged');
  });

  it('tasks list --pretty — output contains + (table borders)', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['tasks', 'list', '--pretty']);
    console.log = origLog;
    assert.ok(captured.includes('+'), `Expected "+" table border in output, got: ${captured}`);
  });

  it('tasks add --content "Buy milk" — fetch POSTed to /tasks with content: "Buy milk"', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['tasks', 'add', '--content', 'Buy milk']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/tasks'), `Expected URL to contain "/tasks", got: ${lastUrl}`);
    assert.equal(lastInit && lastInit.method, 'POST', `Expected POST method, got: ${lastInit && lastInit.method}`);
    assert.ok(
      lastInit && lastInit.body && lastInit.body.includes('Buy milk'),
      `Expected body to contain "Buy milk", got: ${lastInit && lastInit.body}`,
    );
  });

  it('tasks get task1 — fetch called with /tasks/task1', async () => {
    mockFetch({ body: { id: 'task1', content: 'Buy milk' } });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['tasks', 'get', 'task1']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/tasks/task1'), `Expected URL to contain "/tasks/task1", got: ${lastUrl}`);
  });

  it('tasks delete task1 — fetch DELETE to /tasks/task1', async () => {
    mockFetch({ body: { success: true } });
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['tasks', 'delete', 'task1']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/tasks/task1'), `Expected URL to contain "/tasks/task1", got: ${lastUrl}`);
    assert.equal(lastInit && lastInit.method, 'DELETE', `Expected DELETE method, got: ${lastInit && lastInit.method}`);
  });

  it('projects list — fetch called with /projects', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['projects', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/projects'), `Expected URL to contain "/projects", got: ${lastUrl}`);
  });

  it('sections list — fetch called with /sections', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['sections', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/sections'), `Expected URL to contain "/sections", got: ${lastUrl}`);
  });

  it('labels list — fetch called with /labels', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['labels', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/labels'), `Expected URL to contain "/labels", got: ${lastUrl}`);
  });

  it('comments list --task-id task1 — fetch called with /comments and task_id param', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['comments', 'list', '--task-id', 'task1']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/comments'), `Expected URL to contain "/comments", got: ${lastUrl}`);
    assert.ok(lastUrl && lastUrl.includes('task_id'), `Expected URL to contain "task_id", got: ${lastUrl}`);
  });

  it('activities list — fetch called with /activity/events', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['activities', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/activity/events'), `Expected URL to contain "/activity/events", got: ${lastUrl}`);
  });

  it('reminders list — fetch called with /reminders', async () => {
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => { captured += args.join(' ') + '\n'; };
    await run(['reminders', 'list']);
    console.log = origLog;
    assert.ok(lastUrl && lastUrl.includes('/reminders'), `Expected URL to contain "/reminders", got: ${lastUrl}`);
  });

  it('missing token — process.exit called with 1', async () => {
    delete process.env.TODOIST_API_TOKEN;
    let exitCode = null;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; throw new Error('process.exit:' + code); };
    try {
      await run([]);
    } catch (e) {
      if (!e.message.startsWith('process.exit:')) throw e;
    } finally {
      process.exit = origExit;
    }
    assert.equal(exitCode, 1);
  });
});
