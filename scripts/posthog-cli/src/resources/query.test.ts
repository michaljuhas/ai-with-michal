import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runQuery } from './query';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('query', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('sends POST to query endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await runQuery(client, { query: 'SELECT * FROM events LIMIT 5' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: unknown }];
    expect(path).toBe('/projects/42/query/');
    expect(opts.method).toBe('POST');
  });

  it('wraps query in HogQLQuery kind', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await runQuery(client, { query: 'SELECT count() FROM events' });
    const body = (vi.mocked(client.request).mock.calls[0]?.[1] as { body: { query: { kind: string; query: string } } }).body;
    expect(body.query.kind).toBe('HogQLQuery');
    expect(body.query.query).toBe('SELECT count() FROM events');
  });

  it('returns the result from the API', async () => {
    const mockResult = { results: [['pageview', 42]], columns: ['event', 'count'] };
    vi.mocked(client.request).mockResolvedValue(mockResult);
    const result = await runQuery(client, { query: 'SELECT event, count() FROM events GROUP BY event' });
    expect(result).toEqual(mockResult);
  });
});
