import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listInsights, retrieveInsight, createInsight, updateInsight, deleteInsight } from './insights';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('insights', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listInsights calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listInsights(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/insights/', expect.any(Object));
  });

  it('retrieveInsight calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await retrieveInsight(client, 1);
    expect(client.request).toHaveBeenCalledWith('/projects/42/insights/1/');
  });

  it('createInsight sends POST with name', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 10 });
    await createInsight(client, { name: 'DAU' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: { name: string } }];
    expect(path).toBe('/projects/42/insights/');
    expect(opts.method).toBe('POST');
    expect(opts.body.name).toBe('DAU');
  });

  it('updateInsight sends PATCH', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await updateInsight(client, 1, { name: 'Updated' });
    const [, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string }];
    expect(opts.method).toBe('PATCH');
  });

  it('deleteInsight sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deleteInsight(client, 5);
    expect(client.request).toHaveBeenCalledWith('/projects/42/insights/5/', { method: 'DELETE' });
  });
});
