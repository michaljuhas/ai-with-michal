/**
 * Threads Graph API — Insights helpers
 *
 * Note: followers_count does not support since/until date filtering.
 * User insights are not available before April 13, 2024 (Unix 1712991600).
 */

const DEFAULT_POST_METRICS = ['views', 'likes', 'replies', 'reposts', 'quotes', 'shares'];
const DEFAULT_ACCOUNT_METRICS = ['views', 'likes', 'replies', 'reposts', 'quotes', 'followers_count'];

/**
 * Fetch insights for a single post/media object.
 *
 * @param {object} client - API client from createApiClient()
 * @param {string} mediaId - The media/post ID
 * @param {string[]} [metrics] - Metrics to fetch; defaults to DEFAULT_POST_METRICS
 */
export async function getPostInsights(client, mediaId, metrics = DEFAULT_POST_METRICS) {
  const metricList = Array.isArray(metrics) ? metrics : [metrics];
  return client.get(`${mediaId}/insights`, { metric: metricList.join(',') });
}

/**
 * Fetch account-level insights for a user.
 *
 * @param {object} client - API client from createApiClient()
 * @param {string} userId - The user ID
 * @param {string[]} [metrics] - Metrics to fetch; defaults to DEFAULT_ACCOUNT_METRICS
 * @param {number} [since] - Start of range as Unix timestamp (not supported for followers_count)
 * @param {number} [until] - End of range as Unix timestamp (not supported for followers_count)
 */
export async function getAccountInsights(client, userId, metrics = DEFAULT_ACCOUNT_METRICS, since, until) {
  // Note: followers_count does not support since/until date filtering
  const metricList = Array.isArray(metrics) ? metrics : [metrics];
  const params = { metric: metricList.join(',') };
  if (since) params.since = since;
  if (until) params.until = until;
  return client.get(`${userId}/threads_insights`, params);
}
