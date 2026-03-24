/**
 * LinkedIn API client
 * Pure ESM, no npm dependencies.
 */

export class LinkedInApiError extends Error {
  constructor(message, httpStatus, serviceErrorCode) {
    super(message);
    this.name = 'LinkedInApiError';
    this.httpStatus = httpStatus;
    this.serviceErrorCode = serviceErrorCode;
  }
}

function linkedInHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
  };
}

async function parseErrorBody(response) {
  try {
    const body = JSON.parse(await response.text());
    return { message: body.message || response.statusText, serviceErrorCode: body.serviceErrorCode };
  } catch {
    return { message: response.statusText, serviceErrorCode: null };
  }
}

// GET https://api.linkedin.com/v2/userinfo
// Returns parsed JSON: { sub, name, given_name, family_name, picture, email }
export async function getUserInfo(token, fetchFn = globalThis.fetch) {
  const response = await fetchFn('https://api.linkedin.com/v2/userinfo', {
    headers: linkedInHeaders(token),
  });
  if (!response.ok) {
    const { message, serviceErrorCode } = await parseErrorBody(response);
    throw new LinkedInApiError(message, response.status, serviceErrorCode);
  }
  return JSON.parse(await response.text());
}

// POST https://api.linkedin.com/v2/ugcPosts
// Returns { id } where id comes from X-RestLi-Id response header
export async function createPost(token, body, fetchFn = globalThis.fetch) {
  const response = await fetchFn('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: linkedInHeaders(token),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const { message, serviceErrorCode } = await parseErrorBody(response);
    throw new LinkedInApiError(message, response.status, serviceErrorCode);
  }
  const id = response.headers.get('x-restli-id');
  return { id };
}

// POST https://api.linkedin.com/v2/assets?action=registerUpload
// Returns the full parsed JSON response (contains uploadUrl and asset URN)
export async function registerUpload(token, personUrn, fetchFn = globalThis.fetch) {
  const response = await fetchFn('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: linkedInHeaders(token),
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: personUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
      },
    }),
  });
  if (!response.ok) {
    const { message, serviceErrorCode } = await parseErrorBody(response);
    throw new LinkedInApiError(message, response.status, serviceErrorCode);
  }
  return JSON.parse(await response.text());
}

// PUT {uploadUrl} — binary upload of image/video
// Returns { success: true } on 201
export async function uploadImage(uploadUrl, token, imageBuffer, fetchFn = globalThis.fetch) {
  const response = await fetchFn(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
    },
    body: imageBuffer,
  });
  if (!response.ok) {
    const { message, serviceErrorCode } = await parseErrorBody(response);
    throw new LinkedInApiError(message, response.status, serviceErrorCode);
  }
  return { success: true };
}
