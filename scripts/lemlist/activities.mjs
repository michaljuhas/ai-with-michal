export async function listActivities(client, filters = {}) {
  const { type, campaignId, leadId, isFirst, offset, limit } = filters;

  const query = {};
  if (type !== undefined && type !== null) query.type = type;
  if (campaignId !== undefined && campaignId !== null) query.campaignId = campaignId;
  if (leadId !== undefined && leadId !== null) query.leadId = leadId;
  if (isFirst !== undefined && isFirst !== null) query.isFirst = isFirst;
  if (offset !== undefined && offset !== null) query.offset = offset;
  if (limit !== undefined && limit !== null) query.limit = limit;

  return client.request({ method: 'GET', path: '/activities', query, apiVersion: 'v2-query' });
}
