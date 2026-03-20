/**
 * Tests for scripts/todoist/projects.mjs
 * Run: node --test scripts/todoist/tests/projects.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  archiveProject,
  unarchiveProject,
} from '../projects.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'proj1' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listProjects', () => {
  it('calls client.get with /projects', async () => {
    const client = makeClient();
    await listProjects(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/projects');
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'proj1', name: 'Inbox' }] };
    const client = makeClient({ get: expected });
    const result = await listProjects(client);
    assert.deepEqual(result, expected);
  });
});

describe('getProject', () => {
  it('calls client.get with /projects/<id>', async () => {
    const client = makeClient();
    await getProject(client, 'proj1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/projects/proj1');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'proj1', name: 'Inbox' };
    const client = makeClient({ get: expected });
    const result = await getProject(client, 'proj1');
    assert.deepEqual(result, expected);
  });
});

describe('addProject', () => {
  it('calls client.post with /projects and the given body', async () => {
    const client = makeClient();
    const body = { name: 'My Project', color: 'blue' };
    await addProject(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/projects');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'proj1', name: 'My Project' };
    const client = makeClient({ post: expected });
    const result = await addProject(client, { name: 'My Project' });
    assert.deepEqual(result, expected);
  });
});

describe('updateProject', () => {
  it('calls client.post with /projects/<id> and the given body', async () => {
    const client = makeClient();
    const body = { name: 'Renamed Project' };
    await updateProject(client, 'proj1', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/projects/proj1');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'proj1', name: 'Renamed Project' };
    const client = makeClient({ post: expected });
    const result = await updateProject(client, 'proj1', { name: 'Renamed Project' });
    assert.deepEqual(result, expected);
  });
});

describe('deleteProject', () => {
  it('calls client.delete with /projects/<id>', async () => {
    const client = makeClient();
    await deleteProject(client, 'proj1');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/projects/proj1');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteProject(client, 'proj1');
    assert.deepEqual(result, expected);
  });
});

describe('archiveProject', () => {
  it('calls client.post with /projects/<id>/archive and an empty body', async () => {
    const client = makeClient();
    await archiveProject(client, 'proj1');
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/projects/proj1/archive');
    assert.deepEqual(call.body, {});
  });

  it('returns the value from client.post', async () => {
    const expected = { success: true };
    const client = makeClient({ post: expected });
    const result = await archiveProject(client, 'proj1');
    assert.deepEqual(result, expected);
  });
});

describe('unarchiveProject', () => {
  it('calls client.post with /projects/<id>/unarchive and an empty body', async () => {
    const client = makeClient();
    await unarchiveProject(client, 'proj1');
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/projects/proj1/unarchive');
    assert.deepEqual(call.body, {});
  });

  it('returns the value from client.post', async () => {
    const expected = { success: true };
    const client = makeClient({ post: expected });
    const result = await unarchiveProject(client, 'proj1');
    assert.deepEqual(result, expected);
  });
});
