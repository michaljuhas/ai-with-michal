import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listAds, getAd } from '../ads.mjs';

function makeClient(getResponse = { data: [] }) {
  const calls = { get: [] };
  return {
    adAccountId: '111222333',
    get: async (path, params) => { calls.get.push({ path, params }); return getResponse; },
    _calls: calls,
  };
}

test('listAds calls client.get with correct path and fields param', async () => {
  const client = makeClient();
  await listAds(client);
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].path, '/act_111222333/ads');
  assert.ok(client._calls.get[0].params?.fields, 'fields param should be present');
});

test('listAds with campaignId includes campaign_id in params', async () => {
  const client = makeClient();
  await listAds(client, { campaignId: '456' });
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].params?.campaign_id, '456');
});

test('listAds with adSetId includes adset_id in params', async () => {
  const client = makeClient();
  await listAds(client, { adSetId: '789' });
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].params?.adset_id, '789');
});

test('listAds with both campaignId and adSetId includes both in params', async () => {
  const client = makeClient();
  await listAds(client, { campaignId: '1', adSetId: '2' });
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].params?.campaign_id, '1');
  assert.equal(client._calls.get[0].params?.adset_id, '2');
});

test('getAd calls client.get with correct path and fields param', async () => {
  const client = makeClient();
  await getAd(client, '321');
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].path, '/321');
  assert.ok(client._calls.get[0].params?.fields, 'fields param should be present');
});
