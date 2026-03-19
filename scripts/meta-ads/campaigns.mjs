const DEFAULT_FIELDS = ['id', 'name', 'status', 'objective', 'created_time'];

export async function listCampaigns(client, { status = 'ALL', fields = DEFAULT_FIELDS } = {}) {
  const params = { fields: fields.join(',') };
  if (status !== 'ALL') params.effective_status = JSON.stringify([status]);
  return client.get(`/act_${client.adAccountId}/campaigns`, params);
}

export async function getCampaign(client, id, { fields = [...DEFAULT_FIELDS, 'budget_remaining'] } = {}) {
  return client.get(`/${id}`, { fields: fields.join(',') });
}

export async function createCampaign(client, { name, objective, status = 'PAUSED', specialAdCategories = [] }) {
  return client.post(`/act_${client.adAccountId}/campaigns`, {
    name,
    objective,
    status,
    special_ad_categories: specialAdCategories,
  });
}

export async function updateCampaign(client, id, updates) {
  const body = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
  return client.post(`/${id}`, body);
}

export async function deleteCampaign(client, id) {
  return client.delete(`/${id}`);
}
