import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { createApiClient, THREADS_BASE_URL } from '../api.mjs';
import {
  createMediaContainer,
  publishContainer,
  listPosts,
  getMedia,
  deleteMedia,
  repost,
} from '../posts.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCapturingFetch({ ok = true, status = 200, json = {} } = {}) {
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

const TOKEN = 'test-token-posts';
const USER_ID = 'me';
const MEDIA_ID = '987654321';
const MEDIA_FIELDS =
  'id,media_product_type,media_type,media_url,permalink,username,text,timestamp,shortcode,is_quote_post,alt_text,link_attachment_url,has_replies,reply_audience';

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let originalFetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; });

// ---------------------------------------------------------------------------
// createMediaContainer
// ---------------------------------------------------------------------------

describe('createMediaContainer', () => {
  it('sends POST to /{userId}/threads', async () => {
    const mock = makeCapturingFetch({ json: { id: 'container-1' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await createMediaContainer(client, USER_ID, { media_type: 'TEXT', text: 'hello' });

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${USER_ID}/threads`);
    assert.equal(init.method, 'POST');
  });

  it('includes media_type and text in the POST body', async () => {
    const mock = makeCapturingFetch({ json: { id: 'container-2' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await createMediaContainer(client, USER_ID, { media_type: 'TEXT', text: 'hello' });

    const body = JSON.parse(mock.calls[0].init.body);
    assert.equal(body.media_type, 'TEXT');
    assert.equal(body.text, 'hello');
  });

  it('strips undefined fields from the POST body', async () => {
    const mock = makeCapturingFetch({ json: { id: 'container-3' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await createMediaContainer(client, USER_ID, { media_type: 'IMAGE', image_url: undefined });

    const body = JSON.parse(mock.calls[0].init.body);
    assert.ok(!('image_url' in body), 'undefined fields should be stripped');
  });
});

// ---------------------------------------------------------------------------
// publishContainer
// ---------------------------------------------------------------------------

describe('publishContainer', () => {
  it('sends POST to /{userId}/threads_publish', async () => {
    const mock = makeCapturingFetch({ json: { id: 'post-published' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await publishContainer(client, USER_ID, 'creation-abc');

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${USER_ID}/threads_publish`);
    assert.equal(init.method, 'POST');
  });

  it('sends creation_id in the POST body', async () => {
    const mock = makeCapturingFetch({ json: { id: 'post-published' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await publishContainer(client, USER_ID, 'creation-abc');

    const body = JSON.parse(mock.calls[0].init.body);
    assert.equal(body.creation_id, 'creation-abc');
  });
});

// ---------------------------------------------------------------------------
// listPosts
// ---------------------------------------------------------------------------

describe('listPosts', () => {
  it('sends GET to /{userId}/threads with MEDIA_FIELDS', async () => {
    const mock = makeCapturingFetch({ json: { data: [] } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await listPosts(client, USER_ID);

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    assert.equal(init.method, undefined); // GET — no explicit method override
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${USER_ID}/threads`);
    assert.equal(parsed.searchParams.get('fields'), MEDIA_FIELDS);
  });

  it('spreads pagination flags into the query string', async () => {
    const mock = makeCapturingFetch({ json: { data: [] } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await listPosts(client, USER_ID, { limit: 10, after: 'cursor-xyz' });

    const parsed = new URL(mock.calls[0].url);
    assert.equal(parsed.searchParams.get('limit'), '10');
    assert.equal(parsed.searchParams.get('after'), 'cursor-xyz');
  });
});

// ---------------------------------------------------------------------------
// getMedia
// ---------------------------------------------------------------------------

describe('getMedia', () => {
  it('sends GET to /{mediaId}', async () => {
    const mock = makeCapturingFetch({ json: { id: MEDIA_ID } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getMedia(client, MEDIA_ID);

    assert.equal(mock.calls.length, 1);
    const parsed = new URL(mock.calls[0].url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${MEDIA_ID}`);
  });

  it('includes MEDIA_FIELDS in the query string', async () => {
    const mock = makeCapturingFetch({ json: { id: MEDIA_ID } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await getMedia(client, MEDIA_ID);

    const parsed = new URL(mock.calls[0].url);
    assert.equal(parsed.searchParams.get('fields'), MEDIA_FIELDS);
  });
});

// ---------------------------------------------------------------------------
// deleteMedia
// ---------------------------------------------------------------------------

describe('deleteMedia', () => {
  it('sends DELETE to /{mediaId}', async () => {
    const mock = makeCapturingFetch({ json: { success: true } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await deleteMedia(client, MEDIA_ID);

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${MEDIA_ID}`);
    assert.equal(init.method, 'DELETE');
  });

  it('does not send a request body', async () => {
    const mock = makeCapturingFetch({ json: { success: true } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await deleteMedia(client, MEDIA_ID);

    const { init } = mock.calls[0];
    assert.equal(init.body, undefined);
  });
});

// ---------------------------------------------------------------------------
// repost
// ---------------------------------------------------------------------------

describe('repost', () => {
  it('sends POST to /{mediaId}/repost', async () => {
    const mock = makeCapturingFetch({ json: { id: 'repost-1' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await repost(client, MEDIA_ID);

    assert.equal(mock.calls.length, 1);
    const { url, init } = mock.calls[0];
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, `${THREADS_BASE_URL}/${MEDIA_ID}/repost`);
    assert.equal(init.method, 'POST');
  });

  it('sends an empty JSON object as the body', async () => {
    const mock = makeCapturingFetch({ json: { id: 'repost-2' } });
    globalThis.fetch = mock;

    const client = createApiClient(TOKEN);
    await repost(client, MEDIA_ID);

    const body = JSON.parse(mock.calls[0].init.body);
    assert.deepEqual(body, {});
  });
});
