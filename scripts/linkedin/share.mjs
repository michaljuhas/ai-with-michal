/**
 * LinkedIn Share helpers
 * Pure ESM, no npm dependencies.
 */

import { createPost, registerUpload, uploadImage } from './api.mjs';
import { readFileSync } from 'node:fs';

export function buildPersonUrn(memberId) {
  return `urn:li:person:${memberId}`;
}

export function buildTextPostBody(personUrn, text) {
  return {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };
}

export function buildArticlePostBody(personUrn, text, { url, title, description = '' }) {
  return {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'ARTICLE',
        media: [{
          status: 'READY',
          description: { text: description },
          originalUrl: url,
          title: { text: title },
        }],
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };
}

export function buildImagePostBody(personUrn, text, assetUrn) {
  return {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'IMAGE',
        media: [{ status: 'READY', media: assetUrn }],
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };
}

// High-level share functions. fetchFn is injected for testing.

export async function shareText(token, personUrn, text, { dryRun = false } = {}, fetchFn = globalThis.fetch) {
  const body = buildTextPostBody(personUrn, text);
  if (dryRun) return { dryRun: true, body };
  return createPost(token, body, fetchFn);
}

export async function shareArticle(token, personUrn, text, { url, title, description, dryRun = false } = {}, fetchFn = globalThis.fetch) {
  const body = buildArticlePostBody(personUrn, text, { url, title, description });
  if (dryRun) return { dryRun: true, body };
  return createPost(token, body, fetchFn);
}

// imageBuffer is optional — if not provided, reads from filePath. This makes the function testable without fs.
export async function shareImage(token, personUrn, text, { filePath, imageBuffer, dryRun = false } = {}, fetchFn = globalThis.fetch) {
  if (dryRun) {
    const body = buildImagePostBody(personUrn, text, 'urn:li:digitalmediaAsset:DRY_RUN');
    return { dryRun: true, body };
  }
  const buffer = imageBuffer || readFileSync(filePath);
  const uploadResponse = await registerUpload(token, personUrn, fetchFn);
  const uploadUrl = uploadResponse.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const assetUrn = uploadResponse.value.asset;
  await uploadImage(uploadUrl, token, buffer, fetchFn);
  const body = buildImagePostBody(personUrn, text, assetUrn);
  return createPost(token, body, fetchFn);
}
