/**
 * Threads CLI — entry point and command dispatcher.
 * Pure ESM, no external dependencies.
 */

import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { createApiClient } from './api.mjs';
import * as auth from './auth.mjs';
import * as posts from './posts.mjs';
import * as replies from './replies.mjs';
import * as insights from './insights.mjs';
import * as profile from './profile.mjs';
import { printOutput, printError } from './format.mjs';
import { pickPaginationFlags } from './pagination.mjs';

const USAGE = `Threads CLI — wrapper for the Threads Graph API

Usage: node --env-file=.env scripts/threads/index.mjs <resource> <subcommand> [flags]

Resources:
  profile me
  profile lookup --username <username>
  profile publishing-limit

  posts list [--limit N] [--after cursor] [--before cursor] [--since unix] [--until unix]
  posts get <media-id>
  posts container --media-type TEXT|IMAGE|VIDEO|CAROUSEL [--text ...] [--image-url ...] [--video-url ...] [--reply-to-id ...] [--reply-control ...] [--link-attachment ...] [--quote-post-id ...] [--topic-tag ...] [--alt-text ...] [--auto-publish-text]
  posts publish --creation-id <id>
  posts delete <media-id>
  posts repost <media-id>

  replies list <media-id> [--limit N] [--after cursor] [--before cursor]
  replies conversation <media-id> [--limit N] [--after cursor] [--before cursor]
  replies hide <reply-id>
  replies unhide <reply-id>
  replies pending <media-id> [--limit N] [--after cursor] [--before cursor]
  replies approve <reply-id>
  replies ignore <reply-id>

  insights post <media-id> [--metric views,likes,replies,reposts,quotes,shares]
  insights account [--metric views,likes,replies,reposts,quotes,followers_count] [--since unix] [--until unix]

  auth refresh

Global flags:
  --pretty    Human-readable output (default: compact JSON)
  --help, -h  Show this help

Environment variables:
  THREADS_ACCESS_TOKEN  Required for all commands
  THREADS_USER_ID       Required for user-scoped commands
`;

function parseMetric(raw) {
  if (!raw) return undefined;
  return String(raw).split(',').map((m) => m.trim()).filter(Boolean);
}

export async function run(argv = process.argv) {
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    allowPositionals: true,
    strict: false,
    options: {
      pretty: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
      // profile
      username: { type: 'string' },
      // posts list / replies pagination
      limit: { type: 'string' },
      after: { type: 'string' },
      before: { type: 'string' },
      since: { type: 'string' },
      until: { type: 'string' },
      // posts container
      'media-type': { type: 'string' },
      text: { type: 'string' },
      'image-url': { type: 'string' },
      'video-url': { type: 'string' },
      'reply-to-id': { type: 'string' },
      'reply-control': { type: 'string' },
      'link-attachment': { type: 'string' },
      'quote-post-id': { type: 'string' },
      'topic-tag': { type: 'string' },
      'alt-text': { type: 'string' },
      'auto-publish-text': { type: 'boolean', default: false },
      // posts publish
      'creation-id': { type: 'string' },
      // insights
      metric: { type: 'string' },
    },
  });

  const [resource, subcommand, positionalArg] = positionals;
  const pretty = values.pretty;

  if (values.help || !resource) {
    process.stdout.write(USAGE);
    process.exit(0);
    return;
  }

  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  if (!accessToken) {
    process.stderr.write('Error: THREADS_ACCESS_TOKEN is not set in environment\n');
    process.exit(1);
    return;
  }

  const userId = process.env.THREADS_USER_ID;

  // Commands that require THREADS_USER_ID
  const needsUserId = (
    (resource === 'posts' && (subcommand === 'list' || subcommand === 'container' || subcommand === 'publish')) ||
    (resource === 'profile' && subcommand === 'publishing-limit') ||
    (resource === 'insights' && subcommand === 'account')
  );

  if (needsUserId && !userId) {
    process.stderr.write('Error: THREADS_USER_ID is not set in environment\n');
    process.exit(1);
    return;
  }

  const client = createApiClient(accessToken);

  try {
    let result;

    if (resource === 'profile') {
      if (subcommand === 'me') {
        result = await profile.getMe(client);
      } else if (subcommand === 'lookup') {
        if (!values.username) {
          process.stderr.write('Error: --username is required for profile lookup\n');
          process.exit(1);
          return;
        }
        result = await profile.profileLookup(client, values.username);
      } else if (subcommand === 'publishing-limit') {
        result = await profile.getPublishingLimit(client, userId);
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'posts') {
      const paginationFlags = pickPaginationFlags({
        limit: values.limit,
        after: values.after,
        before: values.before,
        since: values.since,
        until: values.until,
      });

      if (subcommand === 'list') {
        result = await posts.listPosts(client, userId, paginationFlags);
      } else if (subcommand === 'get') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for posts get\n');
          process.exit(1);
          return;
        }
        result = await posts.getMedia(client, mediaId);
      } else if (subcommand === 'container') {
        if (!values['media-type']) {
          process.stderr.write('Error: --media-type is required for posts container\n');
          process.exit(1);
          return;
        }
        const options = {
          media_type: values['media-type'],
          text: values.text,
          image_url: values['image-url'],
          video_url: values['video-url'],
          reply_to_id: values['reply-to-id'],
          reply_control: values['reply-control'],
          link_attachment: values['link-attachment'],
          quote_post_id: values['quote-post-id'],
          topic_tag: values['topic-tag'],
          alt_text: values['alt-text'],
          auto_publish_text: values['auto-publish-text'] || undefined,
        };
        result = await posts.createMediaContainer(client, userId, options);
      } else if (subcommand === 'publish') {
        if (!values['creation-id']) {
          process.stderr.write('Error: --creation-id is required for posts publish\n');
          process.exit(1);
          return;
        }
        result = await posts.publishContainer(client, userId, values['creation-id']);
      } else if (subcommand === 'delete') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for posts delete\n');
          process.exit(1);
          return;
        }
        result = await posts.deleteMedia(client, mediaId);
      } else if (subcommand === 'repost') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for posts repost\n');
          process.exit(1);
          return;
        }
        result = await posts.repost(client, mediaId);
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'replies') {
      const paginationFlags = pickPaginationFlags({
        limit: values.limit,
        after: values.after,
        before: values.before,
      });

      if (subcommand === 'list') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for replies list\n');
          process.exit(1);
          return;
        }
        result = await replies.listReplies(client, mediaId, paginationFlags);
      } else if (subcommand === 'conversation') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for replies conversation\n');
          process.exit(1);
          return;
        }
        result = await replies.getConversation(client, mediaId, paginationFlags);
      } else if (subcommand === 'hide') {
        const replyId = positionalArg;
        if (!replyId) {
          process.stderr.write('Error: <reply-id> is required for replies hide\n');
          process.exit(1);
          return;
        }
        result = await replies.manageReply(client, replyId, true);
      } else if (subcommand === 'unhide') {
        const replyId = positionalArg;
        if (!replyId) {
          process.stderr.write('Error: <reply-id> is required for replies unhide\n');
          process.exit(1);
          return;
        }
        result = await replies.manageReply(client, replyId, false);
      } else if (subcommand === 'pending') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for replies pending\n');
          process.exit(1);
          return;
        }
        result = await replies.listPendingReplies(client, mediaId, paginationFlags);
      } else if (subcommand === 'approve') {
        const replyId = positionalArg;
        if (!replyId) {
          process.stderr.write('Error: <reply-id> is required for replies approve\n');
          process.exit(1);
          return;
        }
        result = await replies.managePendingReply(client, replyId, true);
      } else if (subcommand === 'ignore') {
        const replyId = positionalArg;
        if (!replyId) {
          process.stderr.write('Error: <reply-id> is required for replies ignore\n');
          process.exit(1);
          return;
        }
        result = await replies.managePendingReply(client, replyId, false);
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'insights') {
      const metrics = parseMetric(values.metric);

      if (subcommand === 'post') {
        const mediaId = positionalArg;
        if (!mediaId) {
          process.stderr.write('Error: <media-id> is required for insights post\n');
          process.exit(1);
          return;
        }
        result = await insights.getPostInsights(client, mediaId, metrics);
      } else if (subcommand === 'account') {
        const since = values.since ? parseInt(values.since, 10) : undefined;
        const until = values.until ? parseInt(values.until, 10) : undefined;
        result = await insights.getAccountInsights(client, userId, metrics, since, until);
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else if (resource === 'auth') {
      if (subcommand === 'refresh') {
        result = await auth.refreshToken(accessToken);
        printOutput(result, { pretty });
        process.stdout.write('Note: Update THREADS_ACCESS_TOKEN in your .env file with the new token above.\n');
        return;
      } else {
        process.stdout.write(USAGE);
        process.exit(0);
        return;
      }

    } else {
      process.stdout.write(USAGE);
      process.exit(0);
      return;
    }

    printOutput(result, { pretty });
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run(process.argv).catch((err) => {
    process.stderr.write(`Unhandled error: ${err.message}\n`);
    process.exit(1);
  });
}
