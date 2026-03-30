import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import { getTeam, getTeamCredits, getTeamSenders } from '../team.mjs';

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

describe('getTeam', () => {
  it('calls GET /team with default apiVersion', async () => {
    const client = makeCapturingClient({ _id: 'tea_xxx', name: 'My Team' });
    await getTeam(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/team');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns team data', async () => {
    const data = { _id: 'tea_xxx', name: 'My Team', userIds: ['usr_xxx'], hooks: [], customDomain: null };
    const client = makeMockClient(data);
    const result = await getTeam(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on 401', async () => {
    const client = makeMockClient(new LemlistApiError('Unauthorized', 401, 'Unauthorized'));
    await assert.rejects(() => getTeam(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 401);
      return true;
    });
  });
});

describe('getTeamCredits', () => {
  it('calls GET /team/credits with default apiVersion', async () => {
    const client = makeCapturingClient({ credits: { findEmail: 100 } });
    await getTeamCredits(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/team/credits');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns credits data', async () => {
    const data = { credits: { findEmail: 100, verifyEmail: 200, linkedinEnrichment: 50, findPhone: 75 } };
    const client = makeMockClient(data);
    const result = await getTeamCredits(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on 403', async () => {
    const client = makeMockClient(new LemlistApiError('Forbidden', 403, 'Forbidden'));
    await assert.rejects(() => getTeamCredits(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 403);
      return true;
    });
  });
});

describe('getTeamSenders', () => {
  it('calls GET /team/senders with default apiVersion', async () => {
    const client = makeCapturingClient([]);
    await getTeamSenders(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/team/senders');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns senders data', async () => {
    const data = [{ _id: 'usr_xxx', email: 'user@example.com', campaigns: [] }];
    const client = makeMockClient(data);
    const result = await getTeamSenders(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on 401', async () => {
    const client = makeMockClient(new LemlistApiError('Unauthorized', 401, 'Unauthorized'));
    await assert.rejects(() => getTeamSenders(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 401);
      return true;
    });
  });
});
