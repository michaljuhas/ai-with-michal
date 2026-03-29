/**
 * Threads API — Replies endpoints
 * Pure ESM, no npm dependencies.
 */

const REPLY_FIELDS =
  'id,text,username,permalink,timestamp,media_type,has_replies,reply_audience,is_verified';

export async function listReplies(client, mediaId, paginationFlags = {}) {
  return client.get(`${mediaId}/replies`, { fields: REPLY_FIELDS, ...paginationFlags });
}

export async function getConversation(client, mediaId, paginationFlags = {}) {
  return client.get(`${mediaId}/conversation`, { fields: REPLY_FIELDS, ...paginationFlags });
}

export async function manageReply(client, replyId, hide) {
  return client.post(`${replyId}/manage_reply`, { hide: Boolean(hide) });
}

export async function listPendingReplies(client, mediaId, paginationFlags = {}) {
  return client.get(`${mediaId}/pending_replies`, { fields: REPLY_FIELDS, ...paginationFlags });
}

export async function managePendingReply(client, replyId, approve) {
  return client.post(`${replyId}/manage_pending_reply`, { approve: Boolean(approve) });
}
