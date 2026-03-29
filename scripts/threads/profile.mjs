/**
 * Threads Profile API — profile lookups and publishing limits.
 */

const PROFILE_FIELDS = 'id,username,name,threads_profile_picture_url,threads_biography';
const LOOKUP_FIELDS = 'username,name,follower_count,biography,is_verified';
const LIMIT_FIELDS = 'quota_usage,config,reply_quota_usage,reply_config,delete_quota_usage,delete_config';

export async function getMe(client) {
  return client.get('me', { fields: PROFILE_FIELDS });
}

export async function profileLookup(client, username) {
  return client.get('profile_lookup', { username, fields: LOOKUP_FIELDS });
}

export async function getPublishingLimit(client, userId) {
  return client.get(`${userId}/threads_publishing_limit`, { fields: LIMIT_FIELDS });
}
