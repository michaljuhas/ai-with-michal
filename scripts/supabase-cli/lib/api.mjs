/**
 * Low-level HTTP clients for Supabase APIs.
 */

const MANAGEMENT_BASE = 'https://api.supabase.com/v1';

export class SupabaseApiError extends Error {
  constructor(message, httpStatus) {
    super(message);
    this.name = 'SupabaseApiError';
    this.httpStatus = httpStatus;
  }
}

async function handleResponse(response) {
  const text = await response.text();
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message ?? parsed.error ?? message;
    } catch {}
    throw new SupabaseApiError(message, response.status);
  }
  if (!text) return { success: true };
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createManagementClient(pat, fetchFn = globalThis.fetch) {
  const headers = { 'Authorization': `Bearer ${pat}` };

  async function get(path, params) {
    const url = new URL(`${MANAGEMENT_BASE}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    }
    const response = await fetchFn(url.toString(), { headers });
    return handleResponse(response);
  }

  async function post(path, body) {
    const url = `${MANAGEMENT_BASE}${path}`;
    const response = await fetchFn(url, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function del(path) {
    const url = `${MANAGEMENT_BASE}${path}`;
    const response = await fetchFn(url, { method: 'DELETE', headers });
    return handleResponse(response);
  }

  return { get, post, delete: del };
}

export function createSupabaseClient(supabaseUrl, serviceRoleKey, fetchFn = globalThis.fetch) {
  const baseUrl = supabaseUrl.replace(/\/$/, '');
  const headers = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
  };

  async function get(path, params) {
    const url = new URL(`${baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    }
    const response = await fetchFn(url.toString(), { headers });
    return handleResponse(response);
  }

  async function post(path, body, extraHeaders = {}) {
    const url = `${baseUrl}${path}`;
    const response = await fetchFn(url, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', ...extraHeaders },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function patch(path, body, params) {
    let url = `${baseUrl}${path}`;
    if (params && Object.keys(params).length) {
      url += '?' + new URLSearchParams(params).toString();
    }
    const response = await fetchFn(url, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function del(path) {
    const url = `${baseUrl}${path}`;
    const response = await fetchFn(url, { method: 'DELETE', headers });
    return handleResponse(response);
  }

  return { get, post, patch, delete: del };
}
