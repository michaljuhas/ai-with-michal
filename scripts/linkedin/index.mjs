import { fileURLToPath } from 'node:url';
import { getConfig, getTokenFilePath, getAdsTokenFilePath, LINKEDIN_ADS_SCOPES } from './config.mjs';
import { loadToken, saveToken, isTokenValid, runOAuthFlow, formatTokenStatus } from './auth.mjs';
import { getUserInfo } from './api.mjs';
import { shareText, shareArticle, shareImage } from './share.mjs';

function parseArgs(argv) {
  // argv[0]: command (auth, share, whoami)
  // argv[1]: subcommand for share (text, article, image) or flag for auth (--status)
  const command = argv[0];
  const subcommand = argv[1];
  const flags = {};
  let text = null;

  let i = 2;
  // If subcommand is a share type, the next non-flag arg is the text
  if (['text', 'article', 'image'].includes(subcommand) && argv[2] && !argv[2].startsWith('--')) {
    text = argv[2];
    i = 3;
  }

  while (i < argv.length) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        flags[key] = argv[i + 1];
        i += 2;
      } else {
        flags[key] = true;
        i += 1;
      }
    } else {
      i++;
    }
  }

  return { command, subcommand, text, flags };
}

function printUsage() {
  process.stderr.write(`Usage: node --env-file=.env scripts/linkedin/index.mjs <command> [options]

Commands:
  auth                    Start OAuth flow, save token to ~/.linkedin-token.json
  auth --status           Show current token expiry and member info
  whoami                  Show currently authenticated LinkedIn member
  share text <text> [--dry-run]
  share article <text> --url <url> --title <title> [--description <desc>] [--dry-run]
  share image <text> --file <path> [--dry-run]
\n`);
}

export async function run(argv = process.argv.slice(2), fetchFn = globalThis.fetch) {
  const { command, subcommand, text, flags } = parseArgs(argv);

  if (command === 'auth') {
    if (subcommand === '--status' || flags.status === true) {
      const token = loadToken();
      console.log(formatTokenStatus(token));
      return;
    }
    const config = getConfig();
    const tokenData = await runOAuthFlow(config, fetchFn);
    const userInfo = await getUserInfo(tokenData.access_token, fetchFn);
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    saveToken({ accessToken: tokenData.access_token, expiresAt, memberId: userInfo.sub, memberName: userInfo.name });
    console.log(`Authenticated as ${userInfo.name} (${userInfo.sub}). Token saved.`);
    return;
  }

  if (command === 'auth-ads') {
    const adsPath = getAdsTokenFilePath();
    if (subcommand === '--status' || flags.status === true) {
      const token = loadToken(adsPath);
      console.log(
        formatTokenStatus(token, {
          renewCommand: 'node --env-file=.env scripts/linkedin/index.mjs auth-ads',
        }),
      );
      return;
    }
    const config = getConfig();
    const tokenData = await runOAuthFlow({ ...config, scopes: LINKEDIN_ADS_SCOPES }, fetchFn);
    const userInfo = await getUserInfo(tokenData.access_token, fetchFn);
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    saveToken(
      {
        accessToken: tokenData.access_token,
        expiresAt,
        memberId: userInfo.sub,
        memberName: userInfo.name,
      },
      adsPath,
    );
    console.log(`LinkedIn Ads API token saved for ${userInfo.name} (${userInfo.sub}).`);
    console.log(`  File: ${adsPath}`);
    console.log('');
    console.log('Optional: copy into .env for other tools:');
    console.log(`  LINKEDIN_ADS_ACCESS_TOKEN=${tokenData.access_token}`);
    console.log('');
    console.log(
      'scripts/status.mjs reads LINKEDIN_ADS_ACCESS_TOKEN or this file automatically (if not expired).',
    );
    console.log('Requires Marketing Developer Platform + r_ads_reporting on your LinkedIn app.');
    return;
  }

  if (command === 'whoami') {
    const token = loadToken();
    if (!isTokenValid(token)) {
      process.stderr.write('[LINKEDIN] Not authenticated. Run: node --env-file=.env scripts/linkedin/index.mjs auth\n');
      process.exit(1);
      return;
    }
    const userInfo = await getUserInfo(token.accessToken, fetchFn);
    console.log(JSON.stringify(userInfo, null, 2));
    return;
  }

  if (command === 'share') {
    const token = loadToken();
    if (!isTokenValid(token)) {
      process.stderr.write('[LINKEDIN] Not authenticated. Run: node --env-file=.env scripts/linkedin/index.mjs auth\n');
      process.exit(1);
      return;
    }
    const personUrn = `urn:li:person:${token.memberId}`;
    const dryRun = flags['dry-run'] === true;

    let result;
    if (subcommand === 'text') {
      result = await shareText(token.accessToken, personUrn, text, { dryRun }, fetchFn);
    } else if (subcommand === 'article') {
      result = await shareArticle(token.accessToken, personUrn, text, {
        url: flags.url, title: flags.title, description: flags.description, dryRun,
      }, fetchFn);
    } else if (subcommand === 'image') {
      result = await shareImage(token.accessToken, personUrn, text, {
        filePath: flags.file, dryRun,
      }, fetchFn);
    } else {
      printUsage();
      process.exit(1);
      return;
    }

    if (dryRun) {
      console.log('[DRY RUN] Would post:');
      console.log(JSON.stringify(result.body, null, 2));
    } else {
      console.log(`Post created. ID: ${result.id}`);
    }
    return;
  }

  printUsage();
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run().catch(err => {
    process.stderr.write(`[LINKEDIN ERROR] ${err.message}\n`);
    process.exit(1);
  });
}
