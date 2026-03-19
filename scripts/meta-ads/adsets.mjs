const DEFAULT_ADSET_FIELDS = ['id', 'name', 'status', 'daily_budget', 'targeting', 'start_time', 'end_time'];

export async function listAdSets(client, campaignId, { fields = DEFAULT_ADSET_FIELDS } = {}) {
  return client.get(`/${campaignId}/adsets`, { fields: fields.join(',') });
}

export async function getAdSet(client, adSetId, { fields = DEFAULT_ADSET_FIELDS } = {}) {
  return client.get(`/${adSetId}`, { fields: fields.join(',') });
}
