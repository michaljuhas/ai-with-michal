import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listCohorts, retrieveCohort, createCohort, updateCohort, deleteCohort } from './cohorts';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('cohorts', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listCohorts calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listCohorts(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/cohorts/', expect.any(Object));
  });

  it('retrieveCohort calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await retrieveCohort(client, 1);
    expect(client.request).toHaveBeenCalledWith('/projects/42/cohorts/1/');
  });

  it('createCohort sends POST with name', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 5 });
    await createCohort(client, { name: 'Power Users' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: { name: string } }];
    expect(path).toBe('/projects/42/cohorts/');
    expect(opts.method).toBe('POST');
    expect(opts.body.name).toBe('Power Users');
  });

  it('updateCohort sends PATCH', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await updateCohort(client, 1, { name: 'Updated' });
    const [, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string }];
    expect(opts.method).toBe('PATCH');
  });

  it('deleteCohort sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deleteCohort(client, 9);
    expect(client.request).toHaveBeenCalledWith('/projects/42/cohorts/9/', { method: 'DELETE' });
  });
});
