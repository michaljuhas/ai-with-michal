import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listEvents } from './events';
import { PostHogClient } from '../lib/client';

function makeClient() {
  const client = { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
  return client;
}

describe('events', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('calls the events endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listEvents(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/events/', expect.objectContaining({ query: expect.objectContaining({ limit: 10 }) }));
  });

  it('passes event filter', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listEvents(client, { event: 'pageview' });
    expect(client.request).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ query: expect.objectContaining({ event: 'pageview' }) }));
  });

  it('passes distinct_id filter', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listEvents(client, { distinct_id: 'user-123' });
    const query = (vi.mocked(client.request).mock.calls[0]?.[1] as { query: Record<string, unknown> })?.query;
    expect(query?.distinct_id).toBe('user-123');
  });

  it('returns the result from the API', async () => {
    const mockResult = { results: [{ uuid: 'abc', event: 'pageview' }], next: null };
    vi.mocked(client.request).mockResolvedValue(mockResult);
    const result = await listEvents(client);
    expect(result).toEqual(mockResult);
  });
});
