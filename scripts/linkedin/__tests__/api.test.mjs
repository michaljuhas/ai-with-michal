/**
 * Tests for scripts/linkedin/api.mjs
 * Run: node --test scripts/linkedin/__tests__/api.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getUserInfo, createPost, registerUpload, uploadImage, LinkedInApiError } from '../api.mjs';

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

// ---------------------------------------------------------------------------
// getUserInfo
// ---------------------------------------------------------------------------
describe('getUserInfo', () => {
  it('calls fetch with https://api.linkedin.com/v2/userinfo', async () => {
    const mockFetch = makeCapturingFetch(200, { sub: 'abc' });
    await getUserInfo('tok', mockFetch);
    assert.equal(mockFetch.calls.length, 1);
    assert.equal(mockFetch.calls[0].url, 'https://api.linkedin.com/v2/userinfo');
  });

  it('sends Authorization: Bearer tok header', async () => {
    const mockFetch = makeCapturingFetch(200, { sub: 'abc' });
    await getUserInfo('tok', mockFetch);
    assert.equal(mockFetch.calls[0].init.headers['Authorization'], 'Bearer tok');
  });

  it('sends X-Restli-Protocol-Version: 2.0.0 header', async () => {
    const mockFetch = makeCapturingFetch(200, { sub: 'abc' });
    await getUserInfo('tok', mockFetch);
    assert.equal(mockFetch.calls[0].init.headers['X-Restli-Protocol-Version'], '2.0.0');
  });

  it('returns parsed JSON body on 200', async () => {
    const payload = { sub: 'u123', name: 'Ada Lovelace', email: 'ada@example.com' };
    const mockFetch = makeMockFetch(200, payload);
    const result = await getUserInfo('tok', mockFetch);
    assert.deepEqual(result, payload);
  });

  it('throws LinkedInApiError with httpStatus: 401 on 401 response', async () => {
    const mockFetch = makeMockFetch(401, { message: 'Unauthorized' });
    await assert.rejects(
      () => getUserInfo('bad-tok', mockFetch),
      (err) => {
        assert.ok(err instanceof LinkedInApiError);
        assert.equal(err.httpStatus, 401);
        return true;
      },
    );
  });
});

// ---------------------------------------------------------------------------
// createPost
// ---------------------------------------------------------------------------
describe('createPost', () => {
  it('calls fetch with https://api.linkedin.com/v2/ugcPosts', async () => {
    const mockFetch = makeCapturingFetch(201, {}, { 'x-restli-id': 'urn:li:share:1' });
    await createPost('tok', { author: 'urn:li:person:abc' }, mockFetch);
    assert.equal(mockFetch.calls[0].url, 'https://api.linkedin.com/v2/ugcPosts');
  });

  it('uses method POST', async () => {
    const mockFetch = makeCapturingFetch(201, {}, { 'x-restli-id': 'urn:li:share:1' });
    await createPost('tok', { author: 'urn:li:person:abc' }, mockFetch);
    assert.equal(mockFetch.calls[0].init.method, 'POST');
  });

  it('sends body as JSON string', async () => {
    const mockFetch = makeCapturingFetch(201, {}, { 'x-restli-id': 'urn:li:share:1' });
    const postBody = { author: 'urn:li:person:abc', lifecycleState: 'PUBLISHED' };
    await createPost('tok', postBody, mockFetch);
    assert.deepEqual(JSON.parse(mockFetch.calls[0].init.body), postBody);
  });

  it('sends Content-Type: application/json', async () => {
    const mockFetch = makeCapturingFetch(201, {}, { 'x-restli-id': 'urn:li:share:1' });
    await createPost('tok', {}, mockFetch);
    assert.equal(mockFetch.calls[0].init.headers['Content-Type'], 'application/json');
  });

  it('returns { id: "urn:li:share:123" } extracted from x-restli-id response header on 201', async () => {
    const mockFetch = makeMockFetch(201, {}, { 'x-restli-id': 'urn:li:share:123' });
    const result = await createPost('tok', {}, mockFetch);
    assert.deepEqual(result, { id: 'urn:li:share:123' });
  });

  it('throws LinkedInApiError on 403 response', async () => {
    const mockFetch = makeMockFetch(403, { message: 'Forbidden' });
    await assert.rejects(
      () => createPost('tok', {}, mockFetch),
      (err) => {
        assert.ok(err instanceof LinkedInApiError);
        assert.equal(err.httpStatus, 403);
        return true;
      },
    );
  });
});

// ---------------------------------------------------------------------------
// registerUpload
// ---------------------------------------------------------------------------
describe('registerUpload', () => {
  it('calls fetch with URL containing https://api.linkedin.com/v2/assets and action=registerUpload', async () => {
    const mockFetch = makeCapturingFetch(200, { value: { uploadMechanism: {} } });
    await registerUpload('tok', 'urn:li:person:abc', mockFetch);
    const { url } = mockFetch.calls[0];
    assert.ok(url.startsWith('https://api.linkedin.com/v2/assets'), `URL should start with assets endpoint, got: ${url}`);
    assert.ok(url.includes('action=registerUpload'), `URL should contain action=registerUpload, got: ${url}`);
  });

  it('uses method POST', async () => {
    const mockFetch = makeCapturingFetch(200, { value: {} });
    await registerUpload('tok', 'urn:li:person:abc', mockFetch);
    assert.equal(mockFetch.calls[0].init.method, 'POST');
  });

  it('request body contains registerUploadRequest.owner equal to provided personUrn', async () => {
    const mockFetch = makeCapturingFetch(200, { value: {} });
    const personUrn = 'urn:li:person:xyz999';
    await registerUpload('tok', personUrn, mockFetch);
    const parsed = JSON.parse(mockFetch.calls[0].init.body);
    assert.equal(parsed.registerUploadRequest.owner, personUrn);
  });

  it('returns parsed JSON on 200', async () => {
    const payload = { value: { uploadMechanism: { uploadUrl: 'https://upload.example.com' }, asset: 'urn:li:digitalmediaAsset:123' } };
    const mockFetch = makeMockFetch(200, payload);
    const result = await registerUpload('tok', 'urn:li:person:abc', mockFetch);
    assert.deepEqual(result, payload);
  });

  it('throws LinkedInApiError on 400', async () => {
    const mockFetch = makeMockFetch(400, { message: 'Bad Request', serviceErrorCode: 1234 });
    await assert.rejects(
      () => registerUpload('tok', 'urn:li:person:abc', mockFetch),
      (err) => {
        assert.ok(err instanceof LinkedInApiError);
        assert.equal(err.httpStatus, 400);
        return true;
      },
    );
  });
});

// ---------------------------------------------------------------------------
// uploadImage
// ---------------------------------------------------------------------------
describe('uploadImage', () => {
  const uploadUrl = 'https://upload.linkedin.com/media/upload/C4D10AQFake123';

  it('calls fetch with the exact uploadUrl provided', async () => {
    const mockFetch = makeCapturingFetch(201, '');
    await uploadImage(uploadUrl, 'tok', Buffer.from('imgdata'), mockFetch);
    assert.equal(mockFetch.calls[0].url, uploadUrl);
  });

  it('uses method PUT', async () => {
    const mockFetch = makeCapturingFetch(201, '');
    await uploadImage(uploadUrl, 'tok', Buffer.from('imgdata'), mockFetch);
    assert.equal(mockFetch.calls[0].init.method, 'PUT');
  });

  it('sends imageBuffer as body', async () => {
    const mockFetch = makeCapturingFetch(201, '');
    const imageBuffer = Buffer.from('fake-image-bytes');
    await uploadImage(uploadUrl, 'tok', imageBuffer, mockFetch);
    assert.equal(mockFetch.calls[0].init.body, imageBuffer);
  });

  it('sends Content-Type: application/octet-stream', async () => {
    const mockFetch = makeCapturingFetch(201, '');
    await uploadImage(uploadUrl, 'tok', Buffer.from('imgdata'), mockFetch);
    assert.equal(mockFetch.calls[0].init.headers['Content-Type'], 'application/octet-stream');
  });

  it('returns { success: true } on 201', async () => {
    const mockFetch = makeMockFetch(201, '');
    const result = await uploadImage(uploadUrl, 'tok', Buffer.from('imgdata'), mockFetch);
    assert.deepEqual(result, { success: true });
  });
});

// ---------------------------------------------------------------------------
// LinkedInApiError
// ---------------------------------------------------------------------------
describe('LinkedInApiError', () => {
  it('extends Error', () => {
    const err = new LinkedInApiError('something went wrong', 500, null);
    assert.ok(err instanceof Error);
  });

  it('has httpStatus and serviceErrorCode matching constructor args', () => {
    const err = new LinkedInApiError('not found', 404, 7890);
    assert.equal(err.httpStatus, 404);
    assert.equal(err.serviceErrorCode, 7890);
    assert.equal(err.message, 'not found');
    assert.equal(err.name, 'LinkedInApiError');
  });
});
