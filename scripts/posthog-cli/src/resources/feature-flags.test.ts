import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listFlags, retrieveFlag, createFlag, updateFlag, deleteFlag } from './feature-flags';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('feature-flags', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listFlags calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listFlags(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/', expect.any(Object));
  });

  it('listFlags passes search param', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listFlags(client, { search: 'beta' });
    const q = (vi.mocked(client.request).mock.calls[0]?.[1] as { query: Record<string, unknown> }).query;
    expect(q.search).toBe('beta');
  });

  it('retrieveFlag calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await retrieveFlag(client, 1);
    expect(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/1/');
  });

  it('createFlag sends POST with name and key', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 5 });
    await createFlag(client, { name: 'My Flag', key: 'my-flag' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: Record<string, unknown> }];
    expect(path).toBe('/projects/42/feature_flags/');
    expect(opts.method).toBe('POST');
    expect(opts.body.name).toBe('My Flag');
    expect(opts.body.key).toBe('my-flag');
  });

  it('createFlag sets rollout_percentage in filters.groups', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 5 });
    await createFlag(client, { name: 'F', key: 'f', rollout_percentage: 50 });
    const body = (vi.mocked(client.request).mock.calls[0]?.[1] as { body: Record<string, unknown> }).body;
    const groups = (body['filters'] as { groups: { rollout_percentage: number }[] }).groups;
    expect(groups[0]?.rollout_percentage).toBe(50);
  });

  it('updateFlag sends PATCH', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await updateFlag(client, 1, { active: false });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string }];
    expect(path).toBe('/projects/42/feature_flags/1/');
    expect(opts.method).toBe('PATCH');
  });

  it('deleteFlag sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deleteFlag(client, 3);
    expect(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/3/', { method: 'DELETE' });
  });
});
