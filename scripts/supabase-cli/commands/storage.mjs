/**
 * Supabase Storage operations.
 */

export async function storageBucketList(client) {
  return client.get('/storage/v1/bucket');
}

export async function storageBucketCreate(client, name, { isPublic = false } = {}) {
  return client.post('/storage/v1/bucket', { id: name, name, public: isPublic });
}

export async function storageBucketDelete(client, name) {
  return client.delete(`/storage/v1/bucket/${name}`);
}

export async function storageFileList(client, bucket, { prefix = '', limit = 100 } = {}) {
  return client.post(`/storage/v1/object/list/${bucket}`, {
    prefix,
    limit: parseInt(limit, 10),
    offset: 0,
  });
}

export async function storageFileUpload(client, bucket, localPath, remotePath) {
  throw new Error('storageFileUpload: binary uploads require raw fetch — not implemented in CLI');
}

export async function storageFileDownload(client, bucket, remotePath, outputPath) {
  throw new Error('storageFileDownload: binary downloads require raw fetch — not implemented in CLI');
}

export async function storageFileDelete(client, bucket, remotePath) {
  return client.delete(`/storage/v1/object/${bucket}/${remotePath}`);
}
