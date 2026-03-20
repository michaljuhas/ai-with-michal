/**
 * Tests for scripts/todoist/activities.mjs
 * Run: node --test scripts/todoist/tests/activities.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listActivity } from '../activities.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { events: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listActivity', () => {
  it('calls client.get with /activity/events and no params when none provided', async () => {
    const client = makeClient();
    await listActivity(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/activity/events');
    assert.equal(call.params, undefined);
  });

  it('passes object_type param through to client.get', async () => {
    const client = makeClient();
    await listActivity(client, { object_type: 'task' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/activity/events');
    assert.deepEqual(call.params, { object_type: 'task' });
  });

  it('passes object_id param through to client.get', async () => {
    const client = makeClient();
    await listActivity(client, { object_id: 'task1' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/activity/events');
    assert.deepEqual(call.params, { object_id: 'task1' });
  });

  it('passes event_type param through to client.get', async () => {
    const client = makeClient();
    await listActivity(client, { event_type: 'added' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/activity/events');
    assert.deepEqual(call.params, { event_type: 'added' });
  });

  it('passes multiple params through to client.get', async () => {
    const client = makeClient();
    const params = { object_type: 'task', object_id: 'task1', event_type: 'updated' };
    await listActivity(client, params);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/activity/events');
    assert.deepEqual(call.params, params);
  });

  it('returns the value from client.get', async () => {
    const expected = { events: [{ id: 'evt1', object_type: 'task', event_type: 'added' }] };
    const client = makeClient({ get: expected });
    const result = await listActivity(client);
    assert.deepEqual(result, expected);
  });
});
