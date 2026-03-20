/**
 * Tests for scripts/todoist/sections.mjs
 * Run: node --test scripts/todoist/tests/sections.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listSections,
  getSection,
  addSection,
  updateSection,
  deleteSection,
} from '../sections.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'sec1' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listSections', () => {
  it('calls client.get with /sections and no params when none provided', async () => {
    const client = makeClient();
    await listSections(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/sections');
    assert.equal(call.params, undefined);
  });

  it('passes project_id param through to client.get', async () => {
    const client = makeClient();
    await listSections(client, { project_id: 'proj1' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/sections');
    assert.deepEqual(call.params, { project_id: 'proj1' });
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'sec1', name: 'Backlog' }] };
    const client = makeClient({ get: expected });
    const result = await listSections(client);
    assert.deepEqual(result, expected);
  });
});

describe('getSection', () => {
  it('calls client.get with /sections/<id>', async () => {
    const client = makeClient();
    await getSection(client, 'sec1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/sections/sec1');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'sec1', name: 'Backlog', project_id: 'proj1' };
    const client = makeClient({ get: expected });
    const result = await getSection(client, 'sec1');
    assert.deepEqual(result, expected);
  });
});

describe('addSection', () => {
  it('calls client.post with /sections and the given body', async () => {
    const client = makeClient();
    const body = { name: 'In Progress', project_id: 'proj1' };
    await addSection(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/sections');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'sec2', name: 'In Progress', project_id: 'proj1' };
    const client = makeClient({ post: expected });
    const result = await addSection(client, { name: 'In Progress', project_id: 'proj1' });
    assert.deepEqual(result, expected);
  });
});

describe('updateSection', () => {
  it('calls client.post with /sections/<id> and the given body', async () => {
    const client = makeClient();
    const body = { name: 'Done' };
    await updateSection(client, 'sec1', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/sections/sec1');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'sec1', name: 'Done' };
    const client = makeClient({ post: expected });
    const result = await updateSection(client, 'sec1', { name: 'Done' });
    assert.deepEqual(result, expected);
  });
});

describe('deleteSection', () => {
  it('calls client.delete with /sections/<id>', async () => {
    const client = makeClient();
    await deleteSection(client, 'sec1');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/sections/sec1');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteSection(client, 'sec1');
    assert.deepEqual(result, expected);
  });
});
