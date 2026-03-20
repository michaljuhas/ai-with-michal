/**
 * Tests for scripts/todoist/reminders.mjs
 * Run: node --test scripts/todoist/tests/reminders.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listReminders,
  getReminder,
  addReminder,
  updateReminder,
  deleteReminder,
} from '../reminders.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'rem1' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listReminders', () => {
  it('calls client.get with /reminders and no params when none provided', async () => {
    const client = makeClient();
    await listReminders(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/reminders');
    assert.equal(call.params, undefined);
  });

  it('passes params through to client.get when provided', async () => {
    const client = makeClient();
    await listReminders(client, { task_id: 'task1' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/reminders');
    assert.deepEqual(call.params, { task_id: 'task1' });
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'rem1', task_id: 'task1', due: { date: '2026-03-25' } }] };
    const client = makeClient({ get: expected });
    const result = await listReminders(client);
    assert.deepEqual(result, expected);
  });
});

describe('getReminder', () => {
  it('calls client.get with /reminders/<id>', async () => {
    const client = makeClient();
    await getReminder(client, 'rem1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/reminders/rem1');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'rem1', task_id: 'task1', type: 'absolute' };
    const client = makeClient({ get: expected });
    const result = await getReminder(client, 'rem1');
    assert.deepEqual(result, expected);
  });
});

describe('addReminder', () => {
  it('calls client.post with /reminders and the given body', async () => {
    const client = makeClient();
    const body = { task_id: 'task1', type: 'absolute', due: { date: '2026-03-25', datetime: '2026-03-25T09:00:00Z' } };
    await addReminder(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/reminders');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'rem2', task_id: 'task1', type: 'absolute' };
    const client = makeClient({ post: expected });
    const result = await addReminder(client, { task_id: 'task1', type: 'absolute' });
    assert.deepEqual(result, expected);
  });
});

describe('updateReminder', () => {
  it('calls client.post with /reminders/<id> and the given body', async () => {
    const client = makeClient();
    const body = { due: { date: '2026-03-26', datetime: '2026-03-26T10:00:00Z' } };
    await updateReminder(client, 'rem1', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/reminders/rem1');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'rem1', type: 'relative', minute_offset: 30 };
    const client = makeClient({ post: expected });
    const result = await updateReminder(client, 'rem1', { minute_offset: 30 });
    assert.deepEqual(result, expected);
  });
});

describe('deleteReminder', () => {
  it('calls client.delete with /reminders/<id>', async () => {
    const client = makeClient();
    await deleteReminder(client, 'rem1');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/reminders/rem1');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteReminder(client, 'rem1');
    assert.deepEqual(result, expected);
  });
});
