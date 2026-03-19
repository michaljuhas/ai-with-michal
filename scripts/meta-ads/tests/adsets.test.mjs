import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listAdSets, getAdSet } from '../adsets.mjs';

function makeClient(getResponse = { data: [] }) {
  const calls = { get: [] };
  return {
    adAccountId: '111222333',
    get: async (path, params) => { calls.get.push({ path, params }); return getResponse; },
    _calls: calls,
  };
}

test('listAdSets calls client.get with correct path and fields param', async () => {
  const client = makeClient();
  await listAdSets(client, '456');
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].path, '/456/adsets');
  assert.ok(client._calls.get[0].params?.fields, 'fields param should be present');
});

test('listAdSets returns the value from client.get (pass-through)', async () => {
  const expected = { data: [{ id: '1', name: 'Test Ad Set' }] };
  const client = makeClient(expected);
  const result = await listAdSets(client, '456');
  assert.deepEqual(result, expected);
});

test('getAdSet calls client.get with correct path and fields containing daily_budget', async () => {
  const client = makeClient();
  await getAdSet(client, '789');
  assert.equal(client._calls.get.length, 1);
  assert.equal(client._calls.get[0].path, '/789');
  const fields = client._calls.get[0].params?.fields;
  assert.ok(fields, 'fields param should be present');
  assert.ok(fields.includes('daily_budget'), `fields should contain 'daily_budget', got: ${fields}`);
});
