/**
 * Tests for scripts/todoist/client.mjs
 * Run: node --test scripts/todoist/tests/client.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createClient, TodoistApiError } from '../client.mjs';

function makeMockFetch(status, body, headers = {}) {
  return async (url, init) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function makeCapturingFetch(status, body, headers = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return makeMockFetch(status, body, headers)(url, init);
  };
  fn.calls = calls;
  return fn;
}

describe('createClient', () => {
  it('returns object with get, post, delete methods', () => {
    const client = createClient('tok_test');
    assert.equal(typeof client.get, 'function');
    assert.equal(typeof client.post, 'function');
    assert.equal(typeof client.delete, 'function');
  });
});

describe('client.get', () => {
  it('builds correct URL with query params', async () => {
    const mockFetch = makeCapturingFetch(200, { results: [] });
    const client = createClient('tok_test', mockFetch);
    await client.get('/tasks', { project_id: '123' });
    assert.equal(mockFetch.calls.length, 1);
    assert.equal(
      mockFetch.calls[0].url,
      'https://api.todoist.com/api/v1/tasks?project_id=123',
    );
  });

  it('builds URL with no query string when params is empty', async () => {
    const mockFetch = makeCapturingFetch(200, { results: [] });
    const client = createClient('tok_test', mockFetch);
    await client.get('/tasks');
    assert.equal(mockFetch.calls[0].url, 'https://api.todoist.com/api/v1/tasks');
  });

  it('sends Authorization: Bearer <token> header', async () => {
    const mockFetch = makeCapturingFetch(200, { results: [] });
    const client = createClient('my_secret_token', mockFetch);
    await client.get('/tasks');
    const headers = mockFetch.calls[0].init.headers;
    assert.equal(headers['Authorization'], 'Bearer my_secret_token');
  });
});

describe('client.post', () => {
  it('sends method POST, Content-Type application/json, JSON-serialized body', async () => {
    const mockFetch = makeCapturingFetch(200, { id: '1', content: 'Buy milk' });
    const client = createClient('tok_test', mockFetch);
    await client.post('/tasks', { content: 'Buy milk', project_id: 'abc' });
    const call = mockFetch.calls[0];
    assert.equal(call.init.method, 'POST');
    assert.equal(call.init.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(call.init.body), { content: 'Buy milk', project_id: 'abc' });
  });
});

describe('client.delete', () => {
  it('sends method DELETE', async () => {
    const mockFetch = makeCapturingFetch(204, '');
    const client = createClient('tok_test', mockFetch);
    await client.delete('/tasks/123');
    assert.equal(mockFetch.calls[0].init.method, 'DELETE');
  });
});

describe('error handling', () => {
  it('non-ok response throws TodoistApiError with httpStatus and errorCode', async () => {
    const body = { error: 'Task not found', error_code: 'NOT_FOUND' };
    const mockFetch = makeMockFetch(404, body);
    const client = createClient('tok_test', mockFetch);
    await assert.rejects(
      () => client.get('/tasks/999'),
      (err) => {
        assert.ok(err instanceof TodoistApiError);
        assert.equal(err.httpStatus, 404);
        assert.equal(err.errorCode, 'NOT_FOUND');
        assert.equal(err.message, 'Task not found');
        return true;
      },
    );
  });

  it('non-ok response with message field throws TodoistApiError', async () => {
    const body = { message: 'Unauthorized' };
    const mockFetch = makeMockFetch(401, body);
    const client = createClient('tok_test', mockFetch);
    await assert.rejects(
      () => client.get('/tasks'),
      (err) => {
        assert.ok(err instanceof TodoistApiError);
        assert.equal(err.httpStatus, 401);
        assert.equal(err.errorCode, null);
        assert.equal(err.message, 'Unauthorized');
        return true;
      },
    );
  });

  it('non-ok response with no error/message falls back to HTTP status string', async () => {
    const body = {};
    const mockFetch = makeMockFetch(500, body);
    const client = createClient('tok_test', mockFetch);
    await assert.rejects(
      () => client.get('/tasks'),
      (err) => {
        assert.ok(err instanceof TodoistApiError);
        assert.equal(err.httpStatus, 500);
        assert.match(err.message, /500/);
        return true;
      },
    );
  });

  it('empty body (204) returns { success: true }', async () => {
    const mockFetch = makeMockFetch(204, '');
    const client = createClient('tok_test', mockFetch);
    const result = await client.delete('/tasks/123');
    assert.deepEqual(result, { success: true });
  });

  it('invalid JSON response returns raw text string', async () => {
    const mockFetch = makeMockFetch(200, 'not-json-at-all');
    const client = createClient('tok_test', mockFetch);
    const result = await client.get('/tasks');
    assert.equal(result, 'not-json-at-all');
  });
});
