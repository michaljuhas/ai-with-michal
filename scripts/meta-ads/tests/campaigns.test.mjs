import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign } from '../campaigns.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], delete: [] };
  const client = {
    adAccountId: '111222333',
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? { data: [] }; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? { id: '999' }; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
  return client;
}

describe('listCampaigns', () => {
  it('calls client.get with the account campaigns path and includes fields param', async () => {
    const client = makeClient();
    await listCampaigns(client);
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/act_111222333/campaigns');
    assert.ok(call.params && call.params.fields, 'fields param is missing');
  });

  it('passes effective_status param containing ACTIVE when status is ACTIVE', async () => {
    const client = makeClient();
    await listCampaigns(client, { status: 'ACTIVE' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.ok(
      call.params && call.params.effective_status,
      'effective_status param is missing'
    );
    const statuses = call.params.effective_status;
    const statusList = Array.isArray(statuses) ? statuses : [statuses];
    assert.ok(statusList.includes('ACTIVE'), 'effective_status does not contain ACTIVE');
  });

  it('does NOT pass effective_status param when status is ALL', async () => {
    const client = makeClient();
    await listCampaigns(client, { status: 'ALL' });
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.ok(
      !call.params || call.params.effective_status === undefined,
      'effective_status should not be present when status is ALL'
    );
  });
});

describe('getCampaign', () => {
  it('calls client.get with path /{campaign_id} and a fields param', async () => {
    const client = makeClient();
    await getCampaign(client, '123456');
    const call = client._calls.get[0];
    assert.ok(call, 'client.get was not called');
    assert.equal(call.path, '/123456');
    assert.ok(call.params && call.params.fields, 'fields param is missing');
  });
});

describe('createCampaign', () => {
  it('calls client.post with account campaigns path and body containing required fields, status defaults to PAUSED', async () => {
    const client = makeClient();
    await createCampaign(client, { name: 'My Campaign', objective: 'OUTCOME_TRAFFIC' });
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/act_111222333/campaigns');
    assert.ok(call.body, 'request body is missing');
    assert.equal(call.body.name, 'My Campaign');
    assert.equal(call.body.objective, 'OUTCOME_TRAFFIC');
    assert.ok(
      call.body.special_ad_categories !== undefined,
      'special_ad_categories is missing from body'
    );
    assert.equal(call.body.status, 'PAUSED', 'status should default to PAUSED');
  });

  it('uses provided status when status is explicitly set to ACTIVE', async () => {
    const client = makeClient();
    await createCampaign(client, { name: 'X', objective: 'OUTCOME_LEADS', status: 'ACTIVE' });
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.body.status, 'ACTIVE');
  });
});

describe('updateCampaign', () => {
  it('calls client.post with path /{campaign_id} and the given body', async () => {
    const client = makeClient();
    await updateCampaign(client, '123', { status: 'ACTIVE' });
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/123');
    assert.deepEqual(call.body, { status: 'ACTIVE' });
  });

  it('passes all provided fields in the body', async () => {
    const client = makeClient();
    await updateCampaign(client, '123', { name: 'New Name', status: 'PAUSED' });
    const call = client._calls.post[0];
    assert.ok(call, 'client.post was not called');
    assert.equal(call.path, '/123');
    assert.equal(call.body.name, 'New Name');
    assert.equal(call.body.status, 'PAUSED');
  });
});

describe('deleteCampaign', () => {
  it('calls client.delete with path /{campaign_id}', async () => {
    const client = makeClient();
    await deleteCampaign(client, '123');
    const call = client._calls.delete[0];
    assert.ok(call, 'client.delete was not called');
    assert.equal(call.path, '/123');
  });
});
