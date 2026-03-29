/**
 * Threads Graph API client
 * Pure ESM, no npm dependencies.
 */

export const THREADS_BASE_URL = 'https://graph.threads.net/v1.0';

export class ThreadsApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'ThreadsApiError';
    this.code = code;
    this.status = status;
  }
}

async function handleResponse(response) {
  const text = await response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ThreadsApiError(
      `HTTP ${response.status}: ${text.slice(0, 200)}`,
      null,
      response.status,
    );
  }

  if (parsed.error) {
    throw new ThreadsApiError(
      parsed.error.message,
      parsed.error.code ?? null,
      response.status,
    );
  }

  if (!response.ok) {
    throw new ThreadsApiError(
      `HTTP ${response.status}`,
      null,
      response.status,
    );
  }

  return parsed;
}

export function createApiClient(accessToken) {
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };

  function buildUrl(path, params) {
    const qs = new URLSearchParams({ ...params, access_token: accessToken });
    return `${THREADS_BASE_URL}/${path}?${qs.toString()}`;
  }

  async function get(path, params) {
    const url = buildUrl(path, params);
    const response = await fetch(url, { headers: authHeaders });
    return handleResponse(response);
  }

  async function post(path, body, params) {
    const url = buildUrl(path, params);
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function del(path, params) {
    const url = buildUrl(path, params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders,
    });
    return handleResponse(response);
  }

  return {
    get,
    post,
    delete: del,
  };
}
