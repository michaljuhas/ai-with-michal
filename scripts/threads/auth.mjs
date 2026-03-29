/**
 * Threads API — token refresh
 * Pure ESM, no npm dependencies.
 */

import { createApiClient } from './api.mjs';

/**
 * Refresh a long-lived Threads access token.
 *
 * @param {string} accessToken — current (non-expired) long-lived token
 * @returns {{ access_token: string, token_type: string, expires_in: number }}
 */
export async function refreshToken(accessToken) {
  const client = createApiClient(accessToken);
  return client.get('refresh_access_token', { grant_type: 'th_refresh_token' });
}
