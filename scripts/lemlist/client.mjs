import { LemlistApiError } from './errors.mjs';

const BASE_URL = 'https://api.lemlist.com/api';

export function createClient(apiKey, fetchFn = globalThis.fetch) {
  const authHeader = 'Basic ' + Buffer.from(':' + apiKey).toString('base64');

  async function request({ method = 'GET', path, query = {}, body, apiVersion = 'default' } = {}) {
    let resolvedPath = path;

    if (apiVersion === 'v2-path') {
      if (!resolvedPath.startsWith('/v2')) {
        resolvedPath = '/v2' + resolvedPath;
      }
    }

    const params = new URLSearchParams();
    if (apiVersion === 'v2-query') {
      params.set('version', 'v2');
    }
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    }

    const qs = params.toString();
    const url = BASE_URL + resolvedPath + (qs ? '?' + qs : '');

    const headers = {
      Authorization: authHeader,
    };

    const init = { method, headers };

    if (body !== undefined && ['POST', 'PATCH', 'PUT'].includes(method)) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    let response = await fetchFn(url, init);

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitMs = retryAfter ? parseFloat(retryAfter) * 1000 : 1000;
      await new Promise((r) => setTimeout(r, waitMs));
      response = await fetchFn(url, init);
    }

    const rawBody = await response.text();

    if (response.status === 500 && rawBody.trim() === 'Lead in graveyard') {
      const err = new LemlistApiError('Lead in graveyard', 500, rawBody);
      err.graveyard = true;
      throw err;
    }

    if (!response.ok) {
      let parsed = null;
      try {
        parsed = JSON.parse(rawBody);
      } catch {
        // not JSON
      }

      if (parsed && parsed.error && parsed.error.code) {
        throw new LemlistApiError(
          parsed.error.message || rawBody.trim() || 'HTTP ' + response.status,
          response.status,
          rawBody,
          parsed.error.code,
        );
      }

      throw new LemlistApiError(
        rawBody.trim() || 'HTTP ' + response.status,
        response.status,
        rawBody,
      );
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  return { request };
}
