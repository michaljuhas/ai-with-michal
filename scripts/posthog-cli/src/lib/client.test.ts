import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostHogClient, ApiError } from './client';
import type { PostHogConfig } from './config';

const cfg: PostHogConfig = {
  personalApiKey: 'phx_test',
  projectId: '42',
  host: 'https://us.posthog.com',
};

function mockFetch(status: number, body: unknown) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(text),
  }));
}

describe('PostHogClient', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('sends GET with Authorization header', async () => {
    mockFetch(200, { results: [] });
    const client = new PostHogClient(cfg);
    await client.request('/projects/42/events/');
    const fetchArgs = vi.mocked(fetch).mock.calls[0];
    expect(fetchArgs?.[0]).toContain('/projects/42/events/');
    expect((fetchArgs?.[1] as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer phx_test',
    });
    expect((fetchArgs?.[1] as RequestInit).method).toBe('GET');
  });

  it('sends POST with JSON body', async () => {
    mockFetch(201, { id: 1 });
    const client = new PostHogClient(cfg);
    await client.request('/projects/42/feature_flags/', {
      method: 'POST',
      body: { name: 'test-flag', key: 'test-flag', filters: {} },
    });
    const init = vi.mocked(fetch).mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string).name).toBe('test-flag');
  });

  it('appends query params to URL', async () => {
    mockFetch(200, { results: [] });
    const client = new PostHogClient(cfg);
    await client.request('/projects/42/events/', { query: { limit: 5, event: 'pageview' } });
    const url = vi.mocked(fetch).mock.calls[0]?.[0] as string;
    expect(url).toContain('limit=5');
    expect(url).toContain('event=pageview');
  });

  it('skips undefined query params', async () => {
    mockFetch(200, { results: [] });
    const client = new PostHogClient(cfg);
    await client.request('/projects/42/events/', { query: { limit: 5, event: undefined } });
    const url = vi.mocked(fetch).mock.calls[0]?.[0] as string;
    expect(url).not.toContain('event=');
  });

  it('throws ApiError on non-ok response', async () => {
    mockFetch(404, 'Not found');
    const client = new PostHogClient(cfg);
    await expect(client.request('/projects/42/missing/')).rejects.toThrow(ApiError);
    await expect(client.request('/projects/42/missing/')).rejects.toThrow('404');
  });

  it('returns undefined for empty response body', async () => {
    mockFetch(204, '');
    const client = new PostHogClient(cfg);
    const result = await client.request('/projects/42/persons/1/');
    expect(result).toBeUndefined();
  });

  it('exposes projectId', () => {
    const client = new PostHogClient(cfg);
    expect(client.projectId).toBe('42');
  });
});
