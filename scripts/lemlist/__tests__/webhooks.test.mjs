import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import { listWebhooks, createWebhook, deleteWebhook } from '../webhooks.mjs';

function makeCapturingClient(response) {
  const calls = [];
  const client = {
    request: async (opts) => {
      calls.push(opts);
      if (response instanceof Error) throw response;
      return response;
    },
  };
  client.calls = calls;
  return client;
}

function makeMockClient(response) {
  return {
    request: async (_opts) => {
      if (response instanceof Error) throw response;
      return response;
    },
  };
}

describe('listWebhooks', () => {
  it('calls GET /hooks with default apiVersion', async () => {
    const client = makeCapturingClient([]);
    await listWebhooks(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/hooks');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response from client', async () => {
    const data = [{ _id: 'hoo_1', targetUrl: 'https://example.com/hook', type: 'emailsReplied' }];
    const client = makeMockClient(data);
    const result = await listWebhooks(client);
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on failure', async () => {
    const client = makeMockClient(new LemlistApiError('Unauthorized', 401, 'Unauthorized'));
    await assert.rejects(() => listWebhooks(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 401);
      return true;
    });
  });
});

describe('createWebhook', () => {
  it('calls POST /hooks with default apiVersion', async () => {
    const client = makeCapturingClient({ _id: 'hoo_new' });
    await createWebhook(client, 'https://example.com/hook', 'emailsReplied');
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/hooks');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('passes targetUrl and type in body', async () => {
    const client = makeCapturingClient({ _id: 'hoo_new' });
    await createWebhook(client, 'https://example.com/hook', 'emailsReplied');
    assert.equal(client.calls[0].body.targetUrl, 'https://example.com/hook');
    assert.equal(client.calls[0].body.type, 'emailsReplied');
  });

  it('omits type from body when not provided', async () => {
    const client = makeCapturingClient({ _id: 'hoo_new' });
    await createWebhook(client, 'https://example.com/hook');
    assert.equal(client.calls[0].body.targetUrl, 'https://example.com/hook');
    assert.equal(client.calls[0].body.type, undefined);
  });

  it('returns the created webhook', async () => {
    const data = { _id: 'hoo_new', targetUrl: 'https://example.com/hook', type: 'emailsClicked' };
    const client = makeMockClient(data);
    const result = await createWebhook(client, 'https://example.com/hook', 'emailsClicked');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 400', async () => {
    const client = makeMockClient(new LemlistApiError('Bad Request', 400, 'Bad Request'));
    await assert.rejects(() => createWebhook(client, ''), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 400);
      return true;
    });
  });
});

describe('deleteWebhook', () => {
  it('calls DELETE /hooks/:hookId with default apiVersion', async () => {
    const client = makeCapturingClient({ _id: 'hoo_1' });
    await deleteWebhook(client, 'hoo_1');
    assert.equal(client.calls[0].method, 'DELETE');
    assert.equal(client.calls[0].path, '/hooks/hoo_1');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response from client', async () => {
    const data = { _id: 'hoo_1', targetUrl: 'https://example.com/hook' };
    const client = makeMockClient(data);
    const result = await deleteWebhook(client, 'hoo_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => deleteWebhook(client, 'hoo_missing'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});
