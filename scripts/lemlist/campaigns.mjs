export async function listCampaigns(client, query = {}) {
  return client.request({
    method: 'GET',
    path: '/campaigns',
    query,
    apiVersion: 'v2-query',
  });
}

export async function getCampaign(client, campaignId) {
  return client.request({
    method: 'GET',
    path: `/campaigns/${campaignId}`,
    apiVersion: 'default',
  });
}

export async function createCampaign(client, name) {
  return client.request({
    method: 'POST',
    path: '/campaigns',
    body: { name },
    apiVersion: 'default',
  });
}

export async function duplicateCampaign(client, campaignId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/duplicate`,
    apiVersion: 'default',
  });
}

export async function startCampaign(client, campaignId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/start`,
    apiVersion: 'default',
  });
}

export async function pauseCampaign(client, campaignId) {
  return client.request({
    method: 'POST',
    path: `/campaigns/${campaignId}/pause`,
    apiVersion: 'default',
  });
}

export async function getCampaignStats(client, campaignId, query = {}) {
  return client.request({
    method: 'GET',
    path: `/v2/campaigns/${campaignId}/stats`,
    query,
    apiVersion: 'v2-path',
  });
}

export async function getCampaignReports(client, campaignIds) {
  return client.request({
    method: 'GET',
    path: '/campaigns/reports',
    query: { campaignIds: campaignIds.join(',') },
    apiVersion: 'default',
  });
}
