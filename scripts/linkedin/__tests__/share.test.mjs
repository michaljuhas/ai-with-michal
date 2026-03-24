/**
 * Tests for scripts/linkedin/share.mjs
 * Run: node --test scripts/linkedin/__tests__/share.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPersonUrn,
  buildTextPostBody,
  buildArticlePostBody,
  buildImagePostBody,
  shareText,
  shareArticle,
  shareImage,
} from '../share.mjs';

function makeMockFetch(status, body, headers = {}) {
  return async (url, init) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function makeCapturingFetch(status, body, headers = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return makeMockFetch(status, body, headers)(url, init);
  };
  fn.calls = calls;
  return fn;
}

// Returns different responses per call index
function makeSequentialFetch(responses) {
  let i = 0;
  return async (url, init) => {
    const r = responses[i++] || responses[responses.length - 1];
    return {
      ok: r.ok !== undefined ? r.ok : true,
      status: r.status || 200,
      headers: { get: (name) => r.headers?.[name.toLowerCase()] ?? null },
      text: async () => (typeof r.body === 'string' ? r.body : JSON.stringify(r.body)),
    };
  };
}

// ---------------------------------------------------------------------------
// buildPersonUrn
// ---------------------------------------------------------------------------
describe('buildPersonUrn', () => {
  it('returns urn:li:person:<memberId>', () => {
    assert.equal(buildPersonUrn('abc123'), 'urn:li:person:abc123');
  });
});

// ---------------------------------------------------------------------------
// buildTextPostBody
// ---------------------------------------------------------------------------
describe('buildTextPostBody', () => {
  const personUrn = 'urn:li:person:test42';
  const text = 'Hello LinkedIn!';
  const body = buildTextPostBody(personUrn, text);
  const content = body.specificContent['com.linkedin.ugc.ShareContent'];

  it('author equals personUrn', () => {
    assert.equal(body.author, personUrn);
  });

  it('shareMediaCategory equals NONE', () => {
    assert.equal(content.shareMediaCategory, 'NONE');
  });

  it('shareCommentary.text equals provided text', () => {
    assert.equal(content.shareCommentary.text, text);
  });

  it('lifecycleState equals PUBLISHED', () => {
    assert.equal(body.lifecycleState, 'PUBLISHED');
  });

  it('visibility value equals PUBLIC', () => {
    assert.equal(body.visibility['com.linkedin.ugc.MemberNetworkVisibility'], 'PUBLIC');
  });
});

// ---------------------------------------------------------------------------
// buildArticlePostBody
// ---------------------------------------------------------------------------
describe('buildArticlePostBody', () => {
  const personUrn = 'urn:li:person:art99';
  const text = 'Check this article';
  const url = 'https://example.com/article';
  const title = 'My Article';
  const body = buildArticlePostBody(personUrn, text, { url, title });
  const content = body.specificContent['com.linkedin.ugc.ShareContent'];

  it('shareMediaCategory equals ARTICLE', () => {
    assert.equal(content.shareMediaCategory, 'ARTICLE');
  });

  it('media[0].originalUrl equals provided URL', () => {
    assert.equal(content.media[0].originalUrl, url);
  });

  it('media[0].title.text equals provided title', () => {
    assert.equal(content.media[0].title.text, title);
  });

  it('author equals personUrn', () => {
    assert.equal(body.author, personUrn);
  });
});

// ---------------------------------------------------------------------------
// buildImagePostBody
// ---------------------------------------------------------------------------
describe('buildImagePostBody', () => {
  const personUrn = 'urn:li:person:img77';
  const text = 'Look at this image';
  const assetUrn = 'urn:li:digitalmediaAsset:someAsset';
  const body = buildImagePostBody(personUrn, text, assetUrn);
  const content = body.specificContent['com.linkedin.ugc.ShareContent'];

  it('shareMediaCategory equals IMAGE', () => {
    assert.equal(content.shareMediaCategory, 'IMAGE');
  });

  it('media[0].media equals provided assetUrn', () => {
    assert.equal(content.media[0].media, assetUrn);
  });

  it('author equals personUrn', () => {
    assert.equal(body.author, personUrn);
  });
});

// ---------------------------------------------------------------------------
// shareText
// ---------------------------------------------------------------------------
describe('shareText', () => {
  const token = 'tok';
  const personUrn = 'urn:li:person:abc';
  const text = 'Hello!';

  it('dryRun: true returns { dryRun: true, body } without calling fetch', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareText(token, personUrn, text, { dryRun: true }, throwingFetch);
    assert.equal(result.dryRun, true);
    assert.ok(result.body);
  });

  it('dryRun: false calls fetch', async () => {
    const mockFetch = makeCapturingFetch(201, {}, { 'x-restli-id': 'urn:li:share:1' });
    await shareText(token, personUrn, text, { dryRun: false }, mockFetch);
    assert.equal(mockFetch.calls.length, 1);
  });

  it('dryRun: true body has shareMediaCategory: NONE', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareText(token, personUrn, text, { dryRun: true }, throwingFetch);
    const content = result.body.specificContent['com.linkedin.ugc.ShareContent'];
    assert.equal(content.shareMediaCategory, 'NONE');
  });
});

// ---------------------------------------------------------------------------
// shareArticle
// ---------------------------------------------------------------------------
describe('shareArticle', () => {
  const token = 'tok';
  const personUrn = 'urn:li:person:abc';
  const text = 'Great article';
  const url = 'https://example.com/post';
  const title = 'Post Title';

  it('dryRun: true returns { dryRun: true, body } without calling fetch', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareArticle(token, personUrn, text, { url, title, dryRun: true }, throwingFetch);
    assert.equal(result.dryRun, true);
    assert.ok(result.body);
  });

  it('dryRun: true body has shareMediaCategory: ARTICLE and correct URL', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareArticle(token, personUrn, text, { url, title, dryRun: true }, throwingFetch);
    const content = result.body.specificContent['com.linkedin.ugc.ShareContent'];
    assert.equal(content.shareMediaCategory, 'ARTICLE');
    assert.equal(content.media[0].originalUrl, url);
  });
});

// ---------------------------------------------------------------------------
// shareImage
// ---------------------------------------------------------------------------
describe('shareImage', () => {
  const token = 'tok';
  const personUrn = 'urn:li:person:abc';
  const text = 'Nice photo';

  it('dryRun: true returns { dryRun: true, body } without calling fetch', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareImage(token, personUrn, text, { dryRun: true }, throwingFetch);
    assert.equal(result.dryRun, true);
    assert.ok(result.body);
  });

  it('dryRun: true body has shareMediaCategory: IMAGE', async () => {
    const throwingFetch = async () => { throw new Error('fetch must not be called in dry-run'); };
    const result = await shareImage(token, personUrn, text, { dryRun: true }, throwingFetch);
    const content = result.body.specificContent['com.linkedin.ugc.ShareContent'];
    assert.equal(content.shareMediaCategory, 'IMAGE');
  });

  it('dryRun: false calls fetch 3 times and returns id from createPost', async () => {
    const seqFetch = makeSequentialFetch([
      {
        body: {
          value: {
            uploadMechanism: {
              'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
                uploadUrl: 'https://example.com/upload',
              },
            },
            asset: 'urn:li:digitalmediaAsset:abc',
          },
        },
      },
      { status: 201, body: '' },
      { status: 201, body: {}, headers: { 'x-restli-id': 'urn:li:share:999' } },
    ]);

    const result = await shareImage(
      token,
      personUrn,
      text,
      { imageBuffer: Buffer.from('fake'), dryRun: false },
      seqFetch,
    );

    assert.equal(result.id, 'urn:li:share:999');
  });
});
