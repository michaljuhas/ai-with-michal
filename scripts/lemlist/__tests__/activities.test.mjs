import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listActivities } from '../activities.mjs';
import { LemlistApiError } from '../errors.mjs';

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

describe('listActivities', () => {
  it('uses apiVersion v2-query', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client);
    assert.equal(client.calls[0].apiVersion, 'v2-query');
  });

  it('requests path /activities', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client);
    assert.equal(client.calls[0].path, '/activities');
  });

  it('passes type filter in query', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client, { type: 'emailsOpened' });
    assert.equal(client.calls[0].query.type, 'emailsOpened');
  });

  it('passes campaignId filter in query', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client, { campaignId: 'camp_abc' });
    assert.equal(client.calls[0].query.campaignId, 'camp_abc');
  });

  it('passes leadId filter in query', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client, { leadId: 'lead_xyz' });
    assert.equal(client.calls[0].query.leadId, 'lead_xyz');
  });

  it('passes offset and limit in query', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client, { offset: 10, limit: 50 });
    assert.equal(client.calls[0].query.offset, 10);
    assert.equal(client.calls[0].query.limit, 50);
  });

  it('omits undefined query params', async () => {
    const client = makeCapturingClient([]);
    await listActivities(client, { type: 'emailsSent' });
    const query = client.calls[0].query;
    assert.ok(!('campaignId' in query), 'campaignId should not be present');
    assert.ok(!('leadId' in query), 'leadId should not be present');
    assert.ok(!('offset' in query), 'offset should not be present');
    assert.ok(!('limit' in query), 'limit should not be present');
  });

  it('propagates LemlistApiError', async () => {
    const err = new LemlistApiError('Unauthorized', 401, 'Unauthorized');
    const client = makeCapturingClient(err);
    await assert.rejects(() => listActivities(client), (thrown) => {
      assert.ok(thrown instanceof LemlistApiError);
      assert.equal(thrown.status, 401);
      return true;
    });
  });

  it('returns the response from client.request', async () => {
    const data = [{ _id: 'act_1', type: 'emailsOpened' }];
    const client = makeCapturingClient(data);
    const result = await listActivities(client);
    assert.deepEqual(result, data);
  });
});
