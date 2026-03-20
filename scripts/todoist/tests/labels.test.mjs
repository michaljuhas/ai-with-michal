/**
 * Tests for scripts/todoist/labels.mjs
 * Run: node --test scripts/todoist/tests/labels.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listLabels,
  getLabel,
  addLabel,
  updateLabel,
  deleteLabel,
} from '../labels.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'lbl1' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listLabels', () => {
  it('calls client.get with /labels', async () => {
    const client = makeClient();
    await listLabels(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/labels');
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'lbl1', name: 'work' }] };
    const client = makeClient({ get: expected });
    const result = await listLabels(client);
    assert.deepEqual(result, expected);
  });
});

describe('getLabel', () => {
  it('calls client.get with /labels/<id>', async () => {
    const client = makeClient();
    await getLabel(client, 'lbl1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/labels/lbl1');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'lbl1', name: 'work', color: 'blue' };
    const client = makeClient({ get: expected });
    const result = await getLabel(client, 'lbl1');
    assert.deepEqual(result, expected);
  });
});

describe('addLabel', () => {
  it('calls client.post with /labels and the given body', async () => {
    const client = makeClient();
    const body = { name: 'urgent', color: 'red' };
    await addLabel(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/labels');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'lbl2', name: 'urgent', color: 'red' };
    const client = makeClient({ post: expected });
    const result = await addLabel(client, { name: 'urgent', color: 'red' });
    assert.deepEqual(result, expected);
  });
});

describe('updateLabel', () => {
  it('calls client.post with /labels/<id> and the given body', async () => {
    const client = makeClient();
    const body = { name: 'critical', color: 'orange' };
    await updateLabel(client, 'lbl1', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/labels/lbl1');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'lbl1', name: 'critical' };
    const client = makeClient({ post: expected });
    const result = await updateLabel(client, 'lbl1', { name: 'critical' });
    assert.deepEqual(result, expected);
  });
});

describe('deleteLabel', () => {
  it('calls client.delete with /labels/<id>', async () => {
    const client = makeClient();
    await deleteLabel(client, 'lbl1');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/labels/lbl1');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteLabel(client, 'lbl1');
    assert.deepEqual(result, expected);
  });
});
