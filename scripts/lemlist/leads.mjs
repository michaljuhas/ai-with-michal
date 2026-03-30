export async function listLeads(client, campaignId, query = {}) {
  return client.request({
    method: 'GET',
    path: `/campaigns/${campaignId}/leads`,
    query,
  });
}

export async function getLead(client, email) {
  return client.request({
    method: 'GET',
    path: `/leads/${email}`,
    apiVersion: 'v2-query',
  });
}

export async function createLead(client, campaignId, leadData, query = {}) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/leads`,
    body: leadData,
    query,
  });
}

export async function updateLead(client, campaignId, leadId, updates) {
  return client.request({
    method: 'PATCH',
    path: `/campaigns/${campaignId}/leads/${leadId}`,
    body: updates,
  });
}

export async function deleteLead(client, campaignId, leadId) {
  return client.request({
    method: 'DELETE',
    path: `/campaigns/${campaignId}/leads/${leadId}`,
  });
}

export async function pauseLead(client, campaignId, leadId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/leads/${leadId}/pause`,
  });
}

export async function resumeLead(client, campaignId, leadId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/leads/${leadId}/resume`,
  });
}

export async function markLeadInterested(client, campaignId, leadId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/leads/${leadId}/interested`,
  });
}

export async function markLeadNotInterested(client, campaignId, leadId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/leads/${leadId}/notInterested`,
  });
}
