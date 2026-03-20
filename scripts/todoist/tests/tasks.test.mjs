/**
 * Tests for scripts/todoist/tasks.mjs
 * Run: node --test scripts/todoist/tests/tasks.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  closeTask,
  reopenTask,
  moveTask,
  filterTasks,
  quickAddTask,
} from '../tasks.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'abc123' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listTasks', () => {
  it('calls client.get with /tasks and no params when none provided', async () => {
    const client = makeClient();
    await listTasks(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/tasks');
    assert.equal(call.params, undefined);
  });

  it('calls client.get with /tasks and passes params through', async () => {
    const client = makeClient();
    await listTasks(client, { project_id: 'proj1', label: 'work' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/tasks');
    assert.deepEqual(call.params, { project_id: 'proj1', label: 'work' });
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'abc123', content: 'Buy milk' }] };
    const client = makeClient({ get: expected });
    const result = await listTasks(client);
    assert.deepEqual(result, expected);
  });
});

describe('getTask', () => {
  it('calls client.get with /tasks/<id>', async () => {
    const client = makeClient();
    await getTask(client, 'abc123');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/tasks/abc123');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'abc123', content: 'Buy milk' };
    const client = makeClient({ get: expected });
    const result = await getTask(client, 'abc123');
    assert.deepEqual(result, expected);
  });
});

describe('addTask', () => {
  it('calls client.post with /tasks and the given body', async () => {
    const client = makeClient();
    const body = { content: 'Buy milk', project_id: 'proj1' };
    await addTask(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'abc123', content: 'Buy milk' };
    const client = makeClient({ post: expected });
    const result = await addTask(client, { content: 'Buy milk' });
    assert.deepEqual(result, expected);
  });
});

describe('updateTask', () => {
  it('calls client.post with /tasks/<id> and the given body', async () => {
    const client = makeClient();
    const body = { content: 'Updated content', due_string: 'tomorrow' };
    await updateTask(client, 'abc123', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/abc123');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'abc123', content: 'Updated content' };
    const client = makeClient({ post: expected });
    const result = await updateTask(client, 'abc123', { content: 'Updated content' });
    assert.deepEqual(result, expected);
  });
});

describe('deleteTask', () => {
  it('calls client.delete with /tasks/<id>', async () => {
    const client = makeClient();
    await deleteTask(client, 'abc123');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/tasks/abc123');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteTask(client, 'abc123');
    assert.deepEqual(result, expected);
  });
});

describe('closeTask', () => {
  it('calls client.post with /tasks/<id>/close and an empty body', async () => {
    const client = makeClient();
    await closeTask(client, 'abc123');
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/abc123/close');
    assert.deepEqual(call.body, {});
  });

  it('returns the value from client.post', async () => {
    const expected = { success: true };
    const client = makeClient({ post: expected });
    const result = await closeTask(client, 'abc123');
    assert.deepEqual(result, expected);
  });
});

describe('reopenTask', () => {
  it('calls client.post with /tasks/<id>/reopen and an empty body', async () => {
    const client = makeClient();
    await reopenTask(client, 'abc123');
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/abc123/reopen');
    assert.deepEqual(call.body, {});
  });

  it('returns the value from client.post', async () => {
    const expected = { success: true };
    const client = makeClient({ post: expected });
    const result = await reopenTask(client, 'abc123');
    assert.deepEqual(result, expected);
  });
});

describe('moveTask', () => {
  it('calls client.post with /tasks/<id>/move and the given body', async () => {
    const client = makeClient();
    const body = { project_id: 'proj2' };
    await moveTask(client, 'abc123', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/abc123/move');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'abc123', project_id: 'proj2' };
    const client = makeClient({ post: expected });
    const result = await moveTask(client, 'abc123', { project_id: 'proj2' });
    assert.deepEqual(result, expected);
  });
});

describe('filterTasks', () => {
  it('calls client.get with /tasks and filter set to the given query', async () => {
    const client = makeClient();
    await filterTasks(client, 'today & p1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/tasks');
    assert.equal(call.params.filter, 'today & p1');
  });

  it('merges extra params alongside the filter', async () => {
    const client = makeClient();
    await filterTasks(client, 'overdue', { lang: 'en' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/tasks');
    assert.equal(call.params.filter, 'overdue');
    assert.equal(call.params.lang, 'en');
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'abc123', content: 'Overdue task' }] };
    const client = makeClient({ get: expected });
    const result = await filterTasks(client, 'overdue');
    assert.deepEqual(result, expected);
  });
});

describe('quickAddTask', () => {
  it('calls client.post with /tasks/quick and text in the body', async () => {
    const client = makeClient();
    await quickAddTask(client, 'Buy milk tomorrow at 9am');
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/quick');
    assert.equal(call.body.text, 'Buy milk tomorrow at 9am');
  });

  it('merges extra params into the body alongside text', async () => {
    const client = makeClient();
    await quickAddTask(client, 'Meeting prep', { note: 'check slides', reminder: '30min' });
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/tasks/quick');
    assert.equal(call.body.text, 'Meeting prep');
    assert.equal(call.body.note, 'check slides');
    assert.equal(call.body.reminder, '30min');
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'abc123', content: 'Buy milk' };
    const client = makeClient({ post: expected });
    const result = await quickAddTask(client, 'Buy milk tomorrow at 9am');
    assert.deepEqual(result, expected);
  });
});
