/**
 * LinkedIn OAuth authentication helpers.
 * Pure ESM. Functions accept config as arguments for independent testability.
 * The entry point (index.mjs) wires them together with config.mjs.
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { homedir } from 'node:os';

// Token file shape: { accessToken, expiresAt (ms epoch), memberId, memberName }

/**
 * Load a stored token from disk.
 * @param {string} [tokenPath] - Optional path override (defaults to ~/.linkedin-token.json).
 * @returns {{ accessToken: string, expiresAt: number, memberId: string, memberName: string } | null}
 */
export function loadToken(tokenPath) {
  const path = tokenPath || getDefaultTokenPath();
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Persist a token to disk with restricted permissions (0o600).
 * @param {{ accessToken: string, expiresAt: number, memberId: string, memberName: string }} token
 * @param {string} [tokenPath] - Optional path override.
 */
export function saveToken({ accessToken, expiresAt, memberId, memberName }, tokenPath) {
  const path = tokenPath || getDefaultTokenPath();
  writeFileSync(
    path,
    JSON.stringify({ accessToken, expiresAt, memberId, memberName }, null, 2),
    { mode: 0o600 },
  );
}

/**
 * Returns true if the token exists and has not expired.
 * @param {object | null} token
 * @returns {boolean}
 */
export function isTokenValid(token) {
  if (!token || !token.accessToken) return false;
  if (token.expiresAt <= Date.now()) return false;
  return true;
}

/**
 * Build the LinkedIn OAuth authorization URL.
 * @param {{ clientId: string, redirectUri: string, scopes?: string[] }} opts
 * @returns {string}
 */
export function buildAuthUrl({ clientId, redirectUri, scopes = ['w_member_social', 'openid', 'profile'] }) {
  const state = randomBytes(8).toString('hex');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchange an authorization code for an access token.
 * @param {{ code: string, clientId: string, clientSecret: string, redirectUri: string }} opts
 * @param {Function} [fetchFn] - Fetch implementation (injectable for testing).
 * @returns {Promise<object>} Raw token response from LinkedIn.
 */
export async function exchangeCode(
  { code, clientId, clientSecret, redirectUri },
  fetchFn = globalThis.fetch,
) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetchFn('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${text}`);
  }

  return JSON.parse(await response.text());
}

/**
 * Run the full OAuth flow: print auth URL, spin up a local callback server,
 * wait for the redirect, then exchange the code.
 * NOT tested (requires real HTTP server + user interaction).
 * @param {{ clientId: string, clientSecret: string, redirectUri: string }} opts
 * @param {Function} [fetchFn]
 * @returns {Promise<object>} Raw token response from LinkedIn.
 */
export async function runOAuthFlow(
  { clientId, clientSecret, redirectUri },
  fetchFn = globalThis.fetch,
) {
  const url = buildAuthUrl({ clientId, redirectUri });
  process.stdout.write(
    `\nOpen this URL to authenticate:\n${url}\n\nWaiting for callback on ${redirectUri}...\n`,
  );

  const port = parseInt(new URL(redirectUri).port) || 3000;

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const reqUrl = new URL(req.url, `http://localhost:${port}`);
      const code = reqUrl.searchParams.get('code');
      const error = reqUrl.searchParams.get('error');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body><h1>Authentication complete. You can close this window.</h1></body></html>');
      server.close();
      if (error) reject(new Error(`OAuth error: ${error}`));
      else if (code) resolve(code);
      else reject(new Error('No code in callback'));
    });
    server.listen(port, () => {});
    server.on('error', reject);
  });

  return exchangeCode({ code, clientId, clientSecret, redirectUri }, fetchFn);
}

/**
 * Return a human-readable string describing the current token status.
 * @param {object | null} token
 * @returns {string}
 */
export function formatTokenStatus(token) {
  if (!token || !token.accessToken) {
    return 'No token found. Run: node --env-file=.env scripts/linkedin/index.mjs auth';
  }
  if (token.expiresAt <= Date.now()) {
    const d = new Date(token.expiresAt).toISOString().split('T')[0];
    return `Token EXPIRED on ${d}. Run: node --env-file=.env scripts/linkedin/index.mjs auth`;
  }
  const daysLeft = Math.floor((token.expiresAt - Date.now()) / 86400000);
  const expiryDate = new Date(token.expiresAt).toISOString().split('T')[0];
  const member = token.memberName || token.memberId || 'unknown';
  return `Token valid. Expires in ${daysLeft} days (${expiryDate}). Member: ${member}`;
}

function getDefaultTokenPath() {
  return join(homedir(), '.linkedin-token.json');
}
