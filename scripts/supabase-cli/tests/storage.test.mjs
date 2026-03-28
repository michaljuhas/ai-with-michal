import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { storageBucketList, storageBucketCreate, storageBucketDelete, storageFileList, storageFileDelete } from '../commands/storage.mjs';

function makeClient(responses = {}) {
  const calls = { get: [], post: [], patch: [], delete: [] };
  return {
    get: async (path, params) => { calls.get.push({ path, params }); return responses.get ?? []; },
    post: async (path, body) => { calls.post.push({ path, body }); return responses.post ?? {}; },
    patch: async (path, body, params) => { calls.patch.push({ path, body, params }); return {}; },
    delete: async (path) => { calls.delete.push({ path }); return responses.delete ?? { success: true }; },
    _calls: calls,
  };
}

describe('storageBucketList', () => {
  it('calls client.get with /storage/v1/bucket', async () => {
    const client = makeClient();
    await storageBucketList(client);
    assert.equal(client._calls.get[0].path, '/storage/v1/bucket');
  });

  it('returns the value from client.get', async () => {
    const expected = [{ id: 'avatars', name: 'avatars' }];
    const client = makeClient({ get: expected });
    const result = await storageBucketList(client);
    assert.deepEqual(result, expected);
  });
});

describe('storageBucketCreate', () => {
  it('calls client.post with /storage/v1/bucket', async () => {
    const client = makeClient();
    await storageBucketCreate(client, 'my-bucket');
    assert.equal(client._calls.post[0].path, '/storage/v1/bucket');
  });

  it('body has id, name, and public: false by default', async () => {
    const client = makeClient();
    await storageBucketCreate(client, 'my-bucket');
    assert.equal(client._calls.post[0].body.id, 'my-bucket');
    assert.equal(client._calls.post[0].body.name, 'my-bucket');
    assert.equal(client._calls.post[0].body.public, false);
  });

  it('body has public: true when isPublic option set', async () => {
    const client = makeClient();
    await storageBucketCreate(client, 'my-bucket', { isPublic: true });
    assert.equal(client._calls.post[0].body.public, true);
  });
});

describe('storageBucketDelete', () => {
  it('calls client.delete with /storage/v1/bucket/my-bucket', async () => {
    const client = makeClient();
    await storageBucketDelete(client, 'my-bucket');
    assert.equal(client._calls.delete[0].path, '/storage/v1/bucket/my-bucket');
  });
});

describe('storageFileList', () => {
  it('calls client.post with /storage/v1/object/list/my-bucket', async () => {
    const client = makeClient();
    await storageFileList(client, 'my-bucket');
    assert.equal(client._calls.post[0].path, '/storage/v1/object/list/my-bucket');
  });

  it('body has default prefix empty string and limit 100', async () => {
    const client = makeClient();
    await storageFileList(client, 'my-bucket');
    assert.equal(client._calls.post[0].body.prefix, '');
    assert.equal(client._calls.post[0].body.limit, 100);
  });

  it('body uses provided prefix', async () => {
    const client = makeClient();
    await storageFileList(client, 'my-bucket', { prefix: 'images/' });
    assert.equal(client._calls.post[0].body.prefix, 'images/');
  });

  it('body parses limit to int', async () => {
    const client = makeClient();
    await storageFileList(client, 'my-bucket', { limit: '20' });
    assert.equal(client._calls.post[0].body.limit, 20);
  });
});

describe('storageFileDelete', () => {
  it('calls client.delete with bucket and path combined', async () => {
    const client = makeClient();
    await storageFileDelete(client, 'my-bucket', 'path/to/file.png');
    assert.equal(client._calls.delete[0].path, '/storage/v1/object/my-bucket/path/to/file.png');
  });
});
