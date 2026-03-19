const DEFAULT_FIELDS = 'impressions,clicks,spend,cpm,ctr';

export async function getInsights(client, objectId, {
  preset = 'last_7d',
  level = 'campaign',
  fields = DEFAULT_FIELDS,
} = {}) {
  const response = await client.get(`/${objectId}/insights`, {
    fields,
    date_preset: preset,
    level,
  });
  return response.data ?? [];
}
