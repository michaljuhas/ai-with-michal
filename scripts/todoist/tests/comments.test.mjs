/**
 * Tests for scripts/todoist/comments.mjs
 * Run: node --test scripts/todoist/tests/comments.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  listComments,
  getComment,
  addComment,
  updateComment,
  deleteComment,
} from '../comments.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { results: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: 'cmt1' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listComments', () => {
  it('calls client.get with /comments and passes task_id param', async () => {
    const client = makeClient();
    await listComments(client, { task_id: 'task1' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/comments');
    assert.deepEqual(call.params, { task_id: 'task1' });
  });

  it('calls client.get with /comments and passes project_id param', async () => {
    const client = makeClient();
    await listComments(client, { project_id: 'proj1' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/comments');
    assert.deepEqual(call.params, { project_id: 'proj1' });
  });

  it('returns the value from client.get', async () => {
    const expected = { results: [{ id: 'cmt1', content: 'Great task!' }] };
    const client = makeClient({ get: expected });
    const result = await listComments(client, { task_id: 'task1' });
    assert.deepEqual(result, expected);
  });
});

describe('getComment', () => {
  it('calls client.get with /comments/<id>', async () => {
    const client = makeClient();
    await getComment(client, 'cmt1');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/comments/cmt1');
  });

  it('returns the value from client.get', async () => {
    const expected = { id: 'cmt1', content: 'Great task!', task_id: 'task1' };
    const client = makeClient({ get: expected });
    const result = await getComment(client, 'cmt1');
    assert.deepEqual(result, expected);
  });
});

describe('addComment', () => {
  it('calls client.post with /comments and the given body', async () => {
    const client = makeClient();
    const body = { task_id: 'task1', content: 'This looks good.' };
    await addComment(client, body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/comments');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'cmt2', task_id: 'task1', content: 'This looks good.' };
    const client = makeClient({ post: expected });
    const result = await addComment(client, { task_id: 'task1', content: 'This looks good.' });
    assert.deepEqual(result, expected);
  });
});

describe('updateComment', () => {
  it('calls client.post with /comments/<id> and the given body', async () => {
    const client = makeClient();
    const body = { content: 'Updated comment text.' };
    await updateComment(client, 'cmt1', body);
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/comments/cmt1');
    assert.deepEqual(call.body, body);
  });

  it('returns the value from client.post', async () => {
    const expected = { id: 'cmt1', content: 'Updated comment text.' };
    const client = makeClient({ post: expected });
    const result = await updateComment(client, 'cmt1', { content: 'Updated comment text.' });
    assert.deepEqual(result, expected);
  });
});

describe('deleteComment', () => {
  it('calls client.delete with /comments/<id>', async () => {
    const client = makeClient();
    await deleteComment(client, 'cmt1');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/comments/cmt1');
  });

  it('returns the value from client.delete', async () => {
    const expected = { success: true };
    const client = makeClient({ delete: expected });
    const result = await deleteComment(client, 'cmt1');
    assert.deepEqual(result, expected);
  });
});
