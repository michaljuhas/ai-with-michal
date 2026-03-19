import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listDashboards, retrieveDashboard, createDashboard, updateDashboard, deleteDashboard } from './dashboards';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('dashboards', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listDashboards calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listDashboards(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/dashboards/', expect.any(Object));
  });

  it('retrieveDashboard calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await retrieveDashboard(client, 1);
    expect(client.request).toHaveBeenCalledWith('/projects/42/dashboards/1/');
  });

  it('createDashboard sends POST with name', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 2 });
    await createDashboard(client, { name: 'Product KPIs' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: { name: string } }];
    expect(path).toBe('/projects/42/dashboards/');
    expect(opts.method).toBe('POST');
    expect(opts.body.name).toBe('Product KPIs');
  });

  it('updateDashboard sends PATCH', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await updateDashboard(client, 1, { name: 'New Name' });
    const [, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string }];
    expect(opts.method).toBe('PATCH');
  });

  it('deleteDashboard sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deleteDashboard(client, 3);
    expect(client.request).toHaveBeenCalledWith('/projects/42/dashboards/3/', { method: 'DELETE' });
  });
});
