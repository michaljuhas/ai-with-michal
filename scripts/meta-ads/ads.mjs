const DEFAULT_AD_FIELDS = ['id', 'name', 'status', 'adset_id', 'campaign_id', 'created_time'];

export async function listAds(client, { campaignId, adSetId, fields = DEFAULT_AD_FIELDS } = {}) {
  const params = { fields: fields.join(',') };
  if (campaignId) params.campaign_id = campaignId;
  if (adSetId) params.adset_id = adSetId;
  return client.get(`/act_${client.adAccountId}/ads`, params);
}

export async function getAd(client, adId, { fields = DEFAULT_AD_FIELDS } = {}) {
  return client.get(`/${adId}`, { fields: fields.join(',') });
}
