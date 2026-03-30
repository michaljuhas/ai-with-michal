import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import { listUnsubscribes, addUnsubscribe, removeUnsubscribe } from '../unsubscribes.mjs';

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

describe('listUnsubscribes', () => {
  it('calls GET /v2/unsubscribes/variables with apiVersion v2-path', async () => {
    const client = makeCapturingClient([]);
    await listUnsubscribes(client);
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/v2/unsubscribes/variables');
    assert.equal(client.calls[0].apiVersion, 'v2-path');
  });

  it('forwards offset and limit as query params', async () => {
    const client = makeCapturingClient([]);
    await listUnsubscribes(client, { offset: 20, limit: 10 });
    assert.deepEqual(client.calls[0].query, { offset: 20, limit: 10 });
  });

  it('returns response from client', async () => {
    const data = [{ _id: 'uns_1', value: 'john@example.com' }];
    const client = makeCapturingClient(data);
    const result = await listUnsubscribes(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on failure', async () => {
    const err = new LemlistApiError('Bad Request', 400, 'Bad Request');
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => listUnsubscribes(client),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.status, 400);
        return true;
      },
    );
  });
});

describe('addUnsubscribe', () => {
  it('calls POST /v2/unsubscribes/variables/:value with apiVersion v2-path', async () => {
    const client = makeCapturingClient({ _id: 'uns_1', value: 'john@example.com' });
    await addUnsubscribe(client, 'john@example.com');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].apiVersion, 'v2-path');
  });

  it('path includes the email value', async () => {
    const client = makeCapturingClient({ _id: 'uns_2', value: 'john@example.com' });
    await addUnsubscribe(client, 'john@example.com');
    assert.equal(client.calls[0].path, '/v2/unsubscribes/variables/john@example.com');
  });

  it('path includes a domain value', async () => {
    const client = makeCapturingClient({ _id: 'uns_3', value: 'example.com' });
    await addUnsubscribe(client, 'example.com');
    assert.equal(client.calls[0].path, '/v2/unsubscribes/variables/example.com');
  });

  it('returns the created record', async () => {
    const record = { _id: 'uns_4', value: 'john@example.com', variable: 'john@example.com', source: 'api' };
    const client = makeCapturingClient(record);
    const result = await addUnsubscribe(client, 'john@example.com');
    assert.deepEqual(result, record);
  });

  it('propagates LemlistApiError on failure', async () => {
    const err = new LemlistApiError('Bad Request', 400, 'Bad Request');
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => addUnsubscribe(client, 'bad-value'),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.status, 400);
        return true;
      },
    );
  });
});

describe('removeUnsubscribe', () => {
  it('calls DELETE /v2/unsubscribes/variables/:value with apiVersion v2-path', async () => {
    const client = makeCapturingClient({ deleted: true });
    await removeUnsubscribe(client, 'john@example.com');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'DELETE');
    assert.equal(client.calls[0].path, '/v2/unsubscribes/variables/john@example.com');
    assert.equal(client.calls[0].apiVersion, 'v2-path');
  });

  it('works with a domain value', async () => {
    const client = makeCapturingClient({ deleted: true });
    await removeUnsubscribe(client, 'example.com');
    assert.equal(client.calls[0].path, '/v2/unsubscribes/variables/example.com');
  });

  it('returns response from client', async () => {
    const data = { deleted: true };
    const client = makeCapturingClient(data);
    const result = await removeUnsubscribe(client, 'john@example.com');
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on 404', async () => {
    const err = new LemlistApiError('Not Found', 404, 'Not Found');
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => removeUnsubscribe(client, 'missing@example.com'),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.status, 404);
        return true;
      },
    );
  });
});
