import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projectsList, projectsGet } from '../commands/projects.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], patch: [], delete: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? []; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? {}; },
    patch: async (path, body, params) => { calls.patch.push({ path, body, params }); return {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
}

describe('projectsList', () => {
  it('calls client.get with /projects', async () => {
    const client = makeClient();
    await projectsList(client);
    assert.equal(client._calls.get[0].path, '/projects');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ id: 'proj-1', name: 'My Project' }];
    const client = makeClient({ get: expected });
    const result = await projectsList(client);
    assert.deepEqual(result, expected);
  });
});

describe('projectsGet', () => {
  it('calls client.get with /projects/abcdef', async () => {
    const client = makeClient();
    await projectsGet(client, 'abcdef');
    assert.equal(client._calls.get[0].path, '/projects/abcdef');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'abcdef', name: 'Test Project' };
    const client = makeClient({ get: expected });
    const result = await projectsGet(client, 'abcdef');
    assert.deepEqual(result, expected);
  });
});
