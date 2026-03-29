import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  listReplies,
  getConversation,
  manageReply,
  listPendingReplies,
  managePendingReply,
} from '../replies.mjs';
import { THREADS_BASE_URL } from '../api.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCapturingFetch({ ok = true, status = 200, json = { success: true } } = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok,
      status,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify(json),
    };
  };
  fn.calls = calls;
  return fn;
}

const TOKEN = 'test-token-abc';
const REPLY_FIELDS = 'id,text,username,permalink,timestamp,media_type,has_replies,reply_audience,is_verified';

function makeClient(mock) {
  // Minimal stub that mirrors createApiClient's get/post signatures.
  // We delegate to mock so we can inspect URL + opts in tests that need it.
  let lastUrl, lastOpts;
  return {
    get: async (path, params = {}) => {
      const qs = new URLSearchParams({ ...params, access_token: TOKEN });
      const url = `${THREADS_BASE_URL}/${path}?${qs.toString()}`;
      const opts = { headers: { Authorization: `Bearer ${TOKEN}` } };
      lastUrl = url; lastOpts = opts;
      const res = await mock(url, opts);
      return JSON.parse(await res.text());
    },
    post: async (path, body, params = {}) => {
      const qs = new URLSearchParams({ ...params, access_token: TOKEN });
      const url = `${THREADS_BASE_URL}/${path}?${qs.toString()}`;
      const opts = {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
      lastUrl = url; lastOpts = opts;
      const res = await mock(url, opts);
      return JSON.parse(await res.text());
    },
    _last: () => ({ url: lastUrl, opts: lastOpts }),
  };
}

let originalFetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; });

// ---------------------------------------------------------------------------
// listReplies
// ---------------------------------------------------------------------------

describe('listReplies', () => {
  it('calls GET /{mediaId}/replies with REPLY_FIELDS', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await listReplies(client, 'media-111');

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/media-111/replies`);
    assert.equal(parsed.searchParams.get('fields'), REPLY_FIELDS);
  });

  it('spreads paginationFlags into query params', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await listReplies(client, 'media-222', { after: 'cursor-abc', limit: '5' });

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('after'), 'cursor-abc');
    assert.equal(parsed.searchParams.get('limit'), '5');
  });
});

// ---------------------------------------------------------------------------
// getConversation
// ---------------------------------------------------------------------------

describe('getConversation', () => {
  it('calls GET /{mediaId}/conversation with REPLY_FIELDS', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await getConversation(client, 'media-333');

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/media-333/conversation`);
    assert.equal(parsed.searchParams.get('fields'), REPLY_FIELDS);
  });

  it('spreads paginationFlags into query params', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await getConversation(client, 'media-444', { before: 'cursor-xyz' });

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('before'), 'cursor-xyz');
  });
});

// ---------------------------------------------------------------------------
// manageReply
// ---------------------------------------------------------------------------

describe('manageReply', () => {
  it('calls POST /{replyId}/manage_reply with hide: true', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await manageReply(client, 'reply-555', true);

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/reply-555/manage_reply`);
    assert.equal(init.method, 'POST');
    assert.deepEqual(JSON.parse(init.body), { hide: true });
  });

  it('calls POST /{replyId}/manage_reply with hide: false', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await manageReply(client, 'reply-666', false);

    const { init } = mock.calls[0];
    assert.equal(init.method, 'POST');
    assert.deepEqual(JSON.parse(init.body), { hide: false });
  });
});

// ---------------------------------------------------------------------------
// listPendingReplies
// ---------------------------------------------------------------------------

describe('listPendingReplies', () => {
  it('calls GET /{mediaId}/pending_replies with REPLY_FIELDS', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await listPendingReplies(client, 'media-777');

    assert.equal(mock.calls.length, 1);
    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/media-777/pending_replies`);
    assert.equal(parsed.searchParams.get('fields'), REPLY_FIELDS);
  });

  it('spreads paginationFlags into query params', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await listPendingReplies(client, 'media-888', { limit: '10' });

    const { url } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('limit'), '10');
  });
});

// ---------------------------------------------------------------------------
// managePendingReply
// ---------------------------------------------------------------------------

describe('managePendingReply', () => {
  it('calls POST /{replyId}/manage_pending_reply with approve: true', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await managePendingReply(client, 'reply-999', true);

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/reply-999/manage_pending_reply`);
    assert.equal(init.method, 'POST');
    assert.deepEqual(JSON.parse(init.body), { approve: true });
  });

  it('calls POST /{replyId}/manage_pending_reply with approve: false', async () => {
    const mock = makeCapturingFetch();
    const client = makeClient(mock);

    await managePendingReply(client, 'reply-000', false);

    const { init } = mock.calls[0];
    assert.equal(init.method, 'POST');
    assert.deepEqual(JSON.parse(init.body), { approve: false });
  });
});
