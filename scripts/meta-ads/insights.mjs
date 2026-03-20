const DEFAULT_FIELDS = 'impressions,clicks,spend,cpm,ctr';

export async function getInsights(client, objectId, {
  preset = null,
  since = null,
  until = null,
  level = 'campaign',
  fields = DEFAULT_FIELDS,
} = {}) {
  const params = { fields, level };
  if (since && until) {
    params.time_range = JSON.stringify({ since, until });
  } else {
    params.date_preset = preset ?? 'last_7d';
  }
  const response = await client.get(`/${objectId}/insights`, params);
  return response.data ?? [];
}
