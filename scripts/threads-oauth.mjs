#!/usr/bin/env node
/**
 * Threads OAuth flow — manual code exchange.
 *
 * Usage:
 *   node --env-file=.env scripts/threads-oauth.mjs
 *
 * Required in .env:
 *   THREADS_APP_ID      — your Threads App ID
 *   THREADS_APP_SECRET  — your Threads App Secret
 *
 * Redirect URI to register in Meta App Dashboard:
 *   https://aiwithmichal.com/api/threads-oauth
 */

import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { exec } from 'node:child_process';

const REDIRECT_URI = 'https://aiwithmichal.com/api/threads-oauth';
const SCOPES = [
  'threads_basic',
  'threads_content_publish',
  'threads_manage_replies',
  'threads_read_replies',
  'threads_manage_insights',
  'threads_delete',
  'threads_profile_discovery',
].join(',');

const APP_ID = process.env.THREADS_APP_ID;
const APP_SECRET = process.env.THREADS_APP_SECRET;

if (!APP_ID || !APP_SECRET) {
  process.stderr.write(
    'Error: THREADS_APP_ID and THREADS_APP_SECRET must be set in .env\n\n' +
    'Add to your .env file:\n' +
    '  THREADS_APP_ID=1292474292739629\n' +
    '  THREADS_APP_SECRET=your_app_secret_here\n',
  );
  process.exit(1);
}

const authUrl =
  `https://threads.net/oauth/authorize` +
  `?client_id=${APP_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&response_type=code`;

process.stdout.write('\nThreads OAuth — manual flow\n');
process.stdout.write('═'.repeat(52) + '\n\n');

process.stdout.write('Step 1 of 3 — Register this redirect URI in Meta App Dashboard\n');
process.stdout.write('  (App Dashboard → Threads API → Redirect URIs → Add)\n\n');
process.stdout.write(`  ${REDIRECT_URI}\n\n`);
process.stdout.write('  (deploy first if you haven\'t already: ./scripts/deploy.sh "add threads oauth callback")\n\n');

process.stdout.write('Step 2 of 3 — Open this URL in your browser and authorize:\n\n');
process.stdout.write(`  ${authUrl}\n\n`);
process.stdout.write('After authorizing, you\'ll land on aiwithmichal.com/api/threads-oauth\n');
process.stdout.write('which shows your authorization code with a Copy button.\n\n');

// Open browser automatically
const openCmd =
  process.platform === 'darwin' ? 'open' :
  process.platform === 'win32' ? 'start' : 'xdg-open';
exec(`${openCmd} "${authUrl}"`);

const rl = createInterface({ input: process.stdin, output: process.stdout });

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

const pasted = await prompt('Step 3 of 3 — Paste the authorization code from the browser here:\n> ');
rl.close();

// Extract code from the pasted URL
let code;
try {
  // Handle both full URL and bare code
  if (pasted.startsWith('http')) {
    const url = new URL(pasted.trim());
    code = url.searchParams.get('code');
  } else {
    code = pasted.trim();
  }
} catch {
  code = pasted.trim();
}

if (!code) {
  process.stderr.write('\nError: No authorization code found in the URL you pasted.\n');
  process.exit(1);
}

// Strip trailing '#_' that Meta sometimes appends
code = code.replace(/#.*$/, '').trim();

process.stdout.write('\nExchanging code for short-lived token...\n');

const tokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: APP_ID,
    client_secret: APP_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  }),
});

const tokenData = await tokenRes.json();

if (tokenData.error || tokenData.error_message) {
  const msg = tokenData.error?.message ?? tokenData.error_message ?? JSON.stringify(tokenData);
  process.stderr.write(`\nError: ${msg}\n`);
  process.stderr.write('Common causes:\n');
  process.stderr.write('  • Redirect URI in Meta App Dashboard does not exactly match: ' + REDIRECT_URI + '\n');
  process.stderr.write('  • Authorization code already used (codes are single-use — restart the script)\n');
  process.stderr.write('  • App is in Development mode and your account is not a Threads Tester\n');
  process.exit(1);
}

const shortLivedToken = tokenData.access_token;
const userId = tokenData.user_id?.toString();
process.stdout.write(`Short-lived token obtained (User ID: ${userId})\n`);

process.stdout.write('Exchanging for long-lived token (60 days)...\n');

const longRes = await fetch(
  `https://graph.threads.net/access_token` +
  `?grant_type=th_exchange_token` +
  `&client_id=${APP_ID}` +
  `&client_secret=${APP_SECRET}` +
  `&access_token=${encodeURIComponent(shortLivedToken)}`,
);

const longData = await longRes.json();

if (longData.error || longData.error_message) {
  const msg = longData.error?.message ?? longData.error_message ?? JSON.stringify(longData);
  process.stderr.write(`\nError exchanging for long-lived token: ${msg}\n`);
  process.exit(1);
}

const accessToken = longData.access_token;
const expiresInDays = Math.round((longData.expires_in ?? 5184000) / 86400);

process.stdout.write('\n' + '═'.repeat(52) + '\n');
process.stdout.write('SUCCESS\n');
process.stdout.write('═'.repeat(52) + '\n\n');
process.stdout.write(`THREADS_ACCESS_TOKEN=${accessToken}\n`);
process.stdout.write(`THREADS_USER_ID=${userId}\n`);
process.stdout.write(`\nToken expires in ~${expiresInDays} days.\n`);

// Write to .env automatically
const envPath = resolve(process.cwd(), '.env');
try {
  let env = readFileSync(envPath, 'utf-8');

  if (env.includes('THREADS_ACCESS_TOKEN=')) {
    env = env.replace(/^THREADS_ACCESS_TOKEN=.*/m, `THREADS_ACCESS_TOKEN=${accessToken}`);
  } else {
    env += `\nTHREADS_ACCESS_TOKEN=${accessToken}\n`;
  }

  if (env.includes('THREADS_USER_ID=')) {
    env = env.replace(/^THREADS_USER_ID=.*/m, `THREADS_USER_ID=${userId}`);
  } else {
    env += `THREADS_USER_ID=${userId}\n`;
  }

  writeFileSync(envPath, env, 'utf-8');
  process.stdout.write(`\n✓ Written to .env automatically.\n`);
  process.stdout.write(`\nTest it:\n  node --env-file=.env scripts/threads/index.mjs profile me --pretty\n\n`);
} catch {
  process.stdout.write('\nCould not write to .env — copy the values above manually.\n\n');
}
