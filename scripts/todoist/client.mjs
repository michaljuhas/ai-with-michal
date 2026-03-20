/**
 * Todoist API client
 * Pure ESM, no npm dependencies.
 */

const BASE_URL = 'https://api.todoist.com/api/v1';

export class TodoistApiError extends Error {
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = 'TodoistApiError';
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
  }
}

async function handleResponse(response) {
  const text = await response.text();

  if (!response.ok) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new TodoistApiError(`HTTP ${response.status}`, response.status, null);
    }

    const message = parsed.error ?? parsed.message ?? `HTTP ${response.status}`;
    const errorCode = parsed.error_code ?? null;
    throw new TodoistApiError(message, response.status, errorCode);
  }

  if (!text) return { success: true };

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createClient(token, fetchFn = globalThis.fetch) {
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function get(path, params) {
    let url = `${BASE_URL}${path}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${new URLSearchParams(params).toString()}`;
    }
    const response = await fetchFn(url, { headers: authHeaders });
    return handleResponse(response);
  }

  async function post(path, body) {
    const url = `${BASE_URL}${path}`;
    const response = await fetchFn(url, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function del(path) {
    const url = `${BASE_URL}${path}`;
    const response = await fetchFn(url, {
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
