/**
 * Meta Graph API client
 * Pure ESM, no npm dependencies.
 */

const BASE_URL = 'https://graph.facebook.com/v25.0';

export class MetaApiError extends Error {
  constructor(message, code, type, fbtrace_id) {
    super(message);
    this.name = 'MetaApiError';
    this.code = code;
    this.type = type;
    this.fbtrace_id = fbtrace_id;
  }
}

export class RateLimitError extends MetaApiError {
  constructor(message, code, type, fbtrace_id) {
    super(message, code, type, fbtrace_id);
    this.name = 'RateLimitError';
  }
}

function checkRateLimit(response) {
  const header = response.headers.get('x-business-use-case-usage');
  if (!header) return;

  let usage;
  try {
    usage = JSON.parse(header);
  } catch {
    return;
  }

  for (const entries of Object.values(usage)) {
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.call_count >= 80) {
          process.stderr.write(`[META WARNING] Rate limit usage at ${entry.call_count}%\n`);
        }
      }
    }
  }
}

async function handleResponse(response) {
  checkRateLimit(response);

  if (!response.ok) {
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new MetaApiError(text, response.status, null, null);
    }

    const err = parsed.error ?? {};
    const { message, code, type, fbtrace_id } = err;

    if (code === 80004) {
      throw new RateLimitError(message, code, type, fbtrace_id);
    }
    throw new MetaApiError(message, code, type, fbtrace_id);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createClient(token, adAccountId) {
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function get(path, params) {
    let url = `${BASE_URL}${path}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${new URLSearchParams(params).toString()}`;
    }
    const response = await fetch(url, { headers: authHeaders });
    return handleResponse(response);
  }

  async function post(path, body) {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function patch(path, body) {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  }

  async function del(path) {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders,
    });
    return handleResponse(response);
  }

  return {
    adAccountId,
    get,
    post,
    patch,
    delete: del,
  };
}
