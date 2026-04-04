/**
 * LinkedIn API configuration
 * Pure ESM, no npm dependencies — only node: builtins.
 */

import { homedir } from 'node:os';
import { join } from 'node:path';

export const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
export const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2';
/** Dedicated port so OAuth does not collide with Next.js (`next dev` on :3000). */
export const DEFAULT_REDIRECT_URI = 'http://localhost:3910/callback';
export const REQUIRED_SCOPES = ['w_member_social', 'openid', 'profile'];

/** Scopes for Marketing API ad reporting (`scripts/linkedin/index.mjs auth-ads`). Requires Marketing Developer Platform on the LinkedIn app. */
export const LINKEDIN_ADS_SCOPES = ['r_ads_reporting', 'openid', 'profile'];

// Lazy getter so tests can override HOME before calling
export function getTokenFilePath() {
  return join(homedir(), '.linkedin-token.json');
}

export function getAdsTokenFilePath() {
  return join(homedir(), '.linkedin-ads-token.json');
}

export function getConfig() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || DEFAULT_REDIRECT_URI;

  if (!clientId) throw new Error('Missing required environment variable: LINKEDIN_CLIENT_ID');
  if (!clientSecret) throw new Error('Missing required environment variable: LINKEDIN_CLIENT_SECRET');

  return { clientId, clientSecret, redirectUri };
}
