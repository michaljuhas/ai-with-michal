import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import { upsertContact, listContacts, getContact } from '../contacts.mjs';

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

describe('upsertContact', () => {
  it('sends POST to /contacts with the provided body', async () => {
    const client = makeCapturingClient({ _id: 'cid_1', email: 'alice@example.com', created: true });
    const data = { email: 'alice@example.com', firstName: 'Alice' };

    const result = await upsertContact(client, data);

    assert.equal(client.calls.length, 1);
    const call = client.calls[0];
    assert.equal(call.method, 'POST');
    assert.equal(call.path, '/contacts');
    assert.deepEqual(call.body, data);
    assert.deepEqual(result, { _id: 'cid_1', email: 'alice@example.com', created: true });
  });

  it('uses default apiVersion', async () => {
    const client = makeCapturingClient({ created: true });
    await upsertContact(client, { email: 'bob@example.com' });

    const call = client.calls[0];
    assert.ok(
      call.apiVersion === undefined || call.apiVersion === 'default',
      `apiVersion should be default or omitted, got: ${call.apiVersion}`,
    );
  });

  it('propagates LemlistApiError with code MISSING_IDENTIFIER', async () => {
    const err = new LemlistApiError(
      'At least one identifier is required',
      400,
      JSON.stringify({ success: false, error: { code: 'MISSING_IDENTIFIER', message: 'At least one identifier is required' } }),
      'MISSING_IDENTIFIER',
    );
    const client = makeCapturingClient(err);

    await assert.rejects(
      () => upsertContact(client, {}),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.code, 'MISSING_IDENTIFIER');
        assert.equal(thrown.status, 400);
        return true;
      },
    );
  });

  it('propagates LemlistApiError with code INVALID_EMAIL', async () => {
    const err = new LemlistApiError(
      'Invalid email address',
      400,
      JSON.stringify({ success: false, error: { code: 'INVALID_EMAIL', message: 'Invalid email address' } }),
      'INVALID_EMAIL',
    );
    const client = makeCapturingClient(err);

    await assert.rejects(
      () => upsertContact(client, { email: 'not-an-email' }),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.code, 'INVALID_EMAIL');
        return true;
      },
    );
  });
});

describe('listContacts', () => {
  it('sends GET to /contacts', async () => {
    const client = makeCapturingClient({ data: [], total: 0 });
    const result = await listContacts(client);

    assert.equal(client.calls.length, 1);
    const call = client.calls[0];
    assert.equal(call.method, 'GET');
    assert.equal(call.path, '/contacts');
    assert.deepEqual(result, { data: [], total: 0 });
  });

  it('passes query params through', async () => {
    const client = makeCapturingClient({ data: [], total: 0 });
    await listContacts(client, { offset: 10, limit: 25 });

    const call = client.calls[0];
    assert.deepEqual(call.query, { offset: 10, limit: 25 });
  });

  it('defaults to empty query when no params provided', async () => {
    const client = makeCapturingClient({ data: [] });
    await listContacts(client);

    const call = client.calls[0];
    assert.deepEqual(call.query, {});
  });
});

describe('getContact', () => {
  it('sends GET to /contacts/:contactId', async () => {
    const client = makeCapturingClient({ _id: 'cid_42', email: 'carol@example.com' });
    const result = await getContact(client, 'cid_42');

    assert.equal(client.calls.length, 1);
    const call = client.calls[0];
    assert.equal(call.method, 'GET');
    assert.equal(call.path, '/contacts/cid_42');
    assert.deepEqual(result, { _id: 'cid_42', email: 'carol@example.com' });
  });

  it('interpolates different contactId values into the path', async () => {
    const client = makeCapturingClient({ _id: 'cid_99' });
    await getContact(client, 'cid_99');

    assert.equal(client.calls[0].path, '/contacts/cid_99');
  });
});
