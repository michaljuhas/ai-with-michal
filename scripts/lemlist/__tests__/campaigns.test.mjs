import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import {
  listCampaigns,
  getCampaign,
  createCampaign,
  duplicateCampaign,
  startCampaign,
  pauseCampaign,
  getCampaignStats,
  getCampaignReports,
} from '../campaigns.mjs';

function makeMockClient(response) {
  return {
    request: async (_opts) => {
      if (response instanceof Error) throw response;
      return response;
    },
  };
}

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

describe('listCampaigns', () => {
  it('calls GET /campaigns with apiVersion v2-query', async () => {
    const client = makeCapturingClient([]);
    await listCampaigns(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/campaigns');
    assert.equal(client.calls[0].apiVersion, 'v2-query');
  });

  it('passes query params when provided', async () => {
    const client = makeCapturingClient([]);
    await listCampaigns(client, { offset: 10, limit: 5, status: 'active' });
    const { query } = client.calls[0];
    assert.equal(query.offset, 10);
    assert.equal(query.limit, 5);
    assert.equal(query.status, 'active');
  });

  it('returns the response from client', async () => {
    const data = [{ id: 'camp_1', name: 'My Campaign' }];
    const client = makeMockClient(data);
    const result = await listCampaigns(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on failure', async () => {
    const client = makeMockClient(new LemlistApiError('Unauthorized', 401, 'Unauthorized'));
    await assert.rejects(() => listCampaigns(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 401);
      return true;
    });
  });
});

describe('getCampaign', () => {
  it('calls GET /campaigns/:campaignId with default apiVersion', async () => {
    const client = makeCapturingClient({ id: 'camp_1' });
    await getCampaign(client, 'camp_1');
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/campaigns/camp_1');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns campaign data', async () => {
    const data = { id: 'camp_1', name: 'Test Campaign' };
    const client = makeMockClient(data);
    const result = await getCampaign(client, 'camp_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => getCampaign(client, 'nope'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('createCampaign', () => {
  it('calls POST /campaigns with body { name }', async () => {
    const client = makeCapturingClient({ id: 'camp_new' });
    await createCampaign(client, 'New Campaign');
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns');
    assert.deepEqual(client.calls[0].body, { name: 'New Campaign' });
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the created campaign', async () => {
    const data = { id: 'camp_new', name: 'New Campaign' };
    const client = makeMockClient(data);
    const result = await createCampaign(client, 'New Campaign');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 400', async () => {
    const client = makeMockClient(new LemlistApiError('Bad Request', 400, 'Bad Request'));
    await assert.rejects(() => createCampaign(client, ''), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 400);
      return true;
    });
  });
});

describe('duplicateCampaign', () => {
  it('calls POST /campaigns/:campaignId/duplicate', async () => {
    const client = makeCapturingClient({ id: 'camp_2' });
    await duplicateCampaign(client, 'camp_1');
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/duplicate');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns duplicated campaign data', async () => {
    const data = { id: 'camp_2', name: 'Copy of Campaign' };
    const client = makeMockClient(data);
    const result = await duplicateCampaign(client, 'camp_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => duplicateCampaign(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('startCampaign', () => {
  it('calls POST /campaigns/:campaignId/start', async () => {
    const client = makeCapturingClient({ status: 'started' });
    await startCampaign(client, 'camp_1');
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/start');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response', async () => {
    const data = { status: 'started' };
    const client = makeMockClient(data);
    const result = await startCampaign(client, 'camp_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => startCampaign(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('pauseCampaign', () => {
  it('calls POST /campaigns/:campaignId/pause', async () => {
    const client = makeCapturingClient({ status: 'paused' });
    await pauseCampaign(client, 'camp_1');
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/pause');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response', async () => {
    const data = { status: 'paused' };
    const client = makeMockClient(data);
    const result = await pauseCampaign(client, 'camp_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => pauseCampaign(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('getCampaignStats', () => {
  it('calls GET /v2/campaigns/:campaignId/stats with apiVersion v2-path', async () => {
    const client = makeCapturingClient({ opens: 10 });
    await getCampaignStats(client, 'camp_1');
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/v2/campaigns/camp_1/stats');
    assert.equal(client.calls[0].apiVersion, 'v2-path');
  });

  it('passes query params when provided', async () => {
    const client = makeCapturingClient({ opens: 5 });
    await getCampaignStats(client, 'camp_1', { startDate: '2026-01-01', endDate: '2026-01-31' });
    const { query } = client.calls[0];
    assert.equal(query.startDate, '2026-01-01');
    assert.equal(query.endDate, '2026-01-31');
  });

  it('returns stats data', async () => {
    const data = { opens: 10, clicks: 5 };
    const client = makeMockClient(data);
    const result = await getCampaignStats(client, 'camp_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => getCampaignStats(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('getCampaignReports', () => {
  it('calls GET /campaigns/reports with campaignIds joined by comma', async () => {
    const client = makeCapturingClient([]);
    await getCampaignReports(client, ['camp_1', 'camp_2']);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/campaigns/reports');
    assert.equal(client.calls[0].query.campaignIds, 'camp_1,camp_2');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('handles single campaign id', async () => {
    const client = makeCapturingClient([]);
    await getCampaignReports(client, ['camp_1']);
    assert.equal(client.calls[0].query.campaignIds, 'camp_1');
  });

  it('returns reports data', async () => {
    const data = [{ campaignId: 'camp_1', sentCount: 100 }];
    const client = makeMockClient(data);
    const result = await getCampaignReports(client, ['camp_1']);
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 400', async () => {
    const client = makeMockClient(new LemlistApiError('Bad Request', 400, 'Bad Request'));
    await assert.rejects(() => getCampaignReports(client, []), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 400);
      return true;
    });
  });
});
