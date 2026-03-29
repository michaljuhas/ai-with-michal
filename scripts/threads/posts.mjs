/**
 * Threads API — posts/media endpoints.
 * Pure ESM, no npm dependencies.
 */

const MEDIA_FIELDS =
  'id,media_product_type,media_type,media_url,permalink,username,text,timestamp,shortcode,is_quote_post,alt_text,link_attachment_url,has_replies,reply_audience';

/**
 * Create a media container (step 1 of publishing a post).
 *
 * @param {object} client - API client from createApiClient()
 * @param {string} userId
 * @param {object} options - media_type, text, image_url, video_url, etc.
 * @returns {Promise<{id: string}>}
 */
export async function createMediaContainer(client, userId, options = {}) {
  const body = Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  );
  return client.post(`${userId}/threads`, body);
}

/**
 * Publish a media container (step 2 of publishing a post).
 *
 * @param {object} client
 * @param {string} userId
 * @param {string} creationId - id returned by createMediaContainer
 * @returns {Promise<{id: string}>}
 */
export async function publishContainer(client, userId, creationId) {
  return client.post(`${userId}/threads_publish`, { creation_id: creationId });
}

/**
 * List published posts for a user.
 *
 * @param {object} client
 * @param {string} userId
 * @param {object} paginationFlags - already normalized by pickPaginationFlags()
 * @returns {Promise<{data: object[], paging?: object}>}
 */
export async function listPosts(client, userId, paginationFlags = {}) {
  return client.get(`${userId}/threads`, { fields: MEDIA_FIELDS, ...paginationFlags });
}

/**
 * Fetch a single media object by ID.
 *
 * @param {object} client
 * @param {string} mediaId
 * @returns {Promise<object>}
 */
export async function getMedia(client, mediaId) {
  return client.get(`${mediaId}`, { fields: MEDIA_FIELDS });
}

/**
 * Delete a media object.
 *
 * @param {object} client
 * @param {string} mediaId
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteMedia(client, mediaId) {
  return client.delete(`${mediaId}`);
}

/**
 * Repost an existing media object.
 *
 * @param {object} client
 * @param {string} mediaId
 * @returns {Promise<{id: string}>}
 */
export async function repost(client, mediaId) {
  return client.post(`${mediaId}/repost`, {});
}
