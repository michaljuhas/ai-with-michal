import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  pauseLead,
  resumeLead,
  markLeadInterested,
  markLeadNotInterested,
} from '../leads.mjs';

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

describe('listLeads', () => {
  it('calls GET /campaigns/:campaignId/leads with default apiVersion', async () => {
    const client = makeCapturingClient([]);
    await listLeads(client, 'camp_123');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/campaigns/camp_123/leads');
    assert.equal(client.calls[0].apiVersion ?? 'default', 'default');
  });

  it('forwards query params (offset, limit)', async () => {
    const client = makeCapturingClient([]);
    await listLeads(client, 'camp_123', { offset: 10, limit: 5 });
    assert.deepEqual(client.calls[0].query, { offset: 10, limit: 5 });
  });

  it('returns response from client', async () => {
    const data = [{ email: 'a@b.com' }];
    const client = makeCapturingClient(data);
    const result = await listLeads(client, 'camp_abc');
    assert.deepEqual(result, data);
  });
});

describe('getLead', () => {
  it('calls GET /leads/:email with apiVersion v2-query', async () => {
    const client = makeCapturingClient({ email: 'user@example.com' });
    await getLead(client, 'user@example.com');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/leads/user@example.com');
    assert.equal(client.calls[0].apiVersion, 'v2-query');
  });

  it('propagates LemlistApiError with graveyard:true', async () => {
    const err = new LemlistApiError('Lead in graveyard', 500, 'Lead in graveyard');
    err.graveyard = true;
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => getLead(client, 'buried@example.com'),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.graveyard, true);
        return true;
      },
    );
  });

  it('propagates 404 LemlistApiError', async () => {
    const err = new LemlistApiError('Not Found', 404, 'Not Found');
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => getLead(client, 'missing@example.com'),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.status, 404);
        return true;
      },
    );
  });
});

describe('createLead', () => {
  it('calls POST /campaigns/:campaignId/leads with body containing email', async () => {
    const leadData = { email: 'new@example.com', firstName: 'New' };
    const client = makeCapturingClient({ _id: 'lead_1' });
    await createLead(client, 'camp_123', leadData);
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_123/leads');
    assert.equal(client.calls[0].body.email, 'new@example.com');
  });

  it('forwards optional query params', async () => {
    const client = makeCapturingClient({ _id: 'lead_2' });
    await createLead(client, 'camp_xyz', { email: 'x@y.com' }, { deduplicate: true });
    assert.deepEqual(client.calls[0].query, { deduplicate: true });
  });

  it('uses default apiVersion', async () => {
    const client = makeCapturingClient({});
    await createLead(client, 'camp_1', { email: 'a@b.com' });
    assert.equal(client.calls[0].apiVersion ?? 'default', 'default');
  });
});

describe('updateLead', () => {
  it('calls PATCH /campaigns/:campaignId/leads/:leadId', async () => {
    const client = makeCapturingClient({ updated: true });
    await updateLead(client, 'camp_1', 'lead_1', { firstName: 'Updated' });
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'PATCH');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1');
    assert.deepEqual(client.calls[0].body, { firstName: 'Updated' });
  });

  it('propagates 404 error when lead does not exist', async () => {
    const err = new LemlistApiError('Not Found', 404, 'Not Found');
    const client = makeCapturingClient(err);
    await assert.rejects(
      () => updateLead(client, 'camp_1', 'lead_nope', { firstName: 'X' }),
      (thrown) => {
        assert.ok(thrown instanceof LemlistApiError);
        assert.equal(thrown.status, 404);
        return true;
      },
    );
  });
});

describe('deleteLead', () => {
  it('calls DELETE /campaigns/:campaignId/leads/:leadId', async () => {
    const client = makeCapturingClient({ deleted: true });
    await deleteLead(client, 'camp_1', 'lead_1');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'DELETE');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1');
  });

  it('uses default apiVersion', async () => {
    const client = makeCapturingClient({});
    await deleteLead(client, 'camp_1', 'lead_1');
    assert.equal(client.calls[0].apiVersion ?? 'default', 'default');
  });
});

describe('pauseLead', () => {
  it('calls POST /campaigns/:campaignId/leads/:leadId/pause', async () => {
    const client = makeCapturingClient({ paused: true });
    await pauseLead(client, 'camp_1', 'lead_1');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1/pause');
  });
});

describe('resumeLead', () => {
  it('calls POST /campaigns/:campaignId/leads/:leadId/resume', async () => {
    const client = makeCapturingClient({ resumed: true });
    await resumeLead(client, 'camp_1', 'lead_1');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1/resume');
  });
});

describe('markLeadInterested', () => {
  it('calls POST /campaigns/:campaignId/leads/:leadId/interested', async () => {
    const client = makeCapturingClient({ ok: true });
    await markLeadInterested(client, 'camp_1', 'lead_1');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1/interested');
  });
});

describe('markLeadNotInterested', () => {
  it('calls POST /campaigns/:campaignId/leads/:leadId/notInterested', async () => {
    const client = makeCapturingClient({ ok: true });
    await markLeadNotInterested(client, 'camp_1', 'lead_1');
    assert.equal(client.calls.length, 1);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/campaigns/camp_1/leads/lead_1/notInterested');
  });
});
