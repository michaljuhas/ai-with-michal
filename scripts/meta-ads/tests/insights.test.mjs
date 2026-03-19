import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getInsights } from '../insights.mjs';

function makeClient(data = []) {
  const calls = { get: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return { data }; },
    _calls: calls,
  };
}

describe('getInsights', () => {
  it('calls client.get with correct path and default params', async () => {
    const client = makeClient();
    await getInsights(client, '123');
    const call = client._calls.get[0];
    assert.equal(call.path, '/123/insights');
    assert.equal(call.params.date_preset, 'last_7d');
    assert.equal(call.params.level, 'campaign');
  });

  it('default fields param includes impressions, clicks, spend', async () => {
    const client = makeClient();
    await getInsights(client, '123');
    const { params } = client._calls.get[0];
    assert.ok(typeof params.fields === 'string', 'fields should be a string');
    assert.ok(params.fields.includes('impressions'), 'fields should include impressions');
    assert.ok(params.fields.includes('clicks'), 'fields should include clicks');
    assert.ok(params.fields.includes('spend'), 'fields should include spend');
  });

  it('accepts custom preset option', async () => {
    const client = makeClient();
    await getInsights(client, '123', { preset: 'last_30d' });
    const { params } = client._calls.get[0];
    assert.equal(params.date_preset, 'last_30d');
  });

  it('accepts custom level option', async () => {
    const client = makeClient();
    await getInsights(client, '123', { level: 'ad' });
    const { params } = client._calls.get[0];
    assert.equal(params.level, 'ad');
  });

  it('accepts custom fields option', async () => {
    const client = makeClient();
    await getInsights(client, '123', { fields: 'impressions,ctr' });
    const { params } = client._calls.get[0];
    assert.equal(params.fields, 'impressions,ctr');
  });

  it('returns the data array from the response', async () => {
    const mockData = [{ impressions: '100' }];
    const client = makeClient(mockData);
    const result = await getInsights(client, '123');
    assert.deepEqual(result, mockData);
  });
});
