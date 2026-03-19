import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listPersons, retrievePerson, deletePerson } from './persons';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('persons', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listPersons calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listPersons(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/persons/', expect.any(Object));
  });

  it('listPersons passes search param', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listPersons(client, { search: 'alice' });
    const q = (vi.mocked(client.request).mock.calls[0]?.[1] as { query: Record<string, unknown> }).query;
    expect(q.search).toBe('alice');
  });

  it('listPersons passes distinct_id param', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listPersons(client, { distinct_id: 'usr_abc' });
    const q = (vi.mocked(client.request).mock.calls[0]?.[1] as { query: Record<string, unknown> }).query;
    expect(q.distinct_id).toBe('usr_abc');
  });

  it('retrievePerson calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 7 });
    await retrievePerson(client, 7);
    expect(client.request).toHaveBeenCalledWith('/projects/42/persons/7/');
  });

  it('deletePerson sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deletePerson(client, 7);
    expect(client.request).toHaveBeenCalledWith('/projects/42/persons/7/', { method: 'DELETE' });
  });
});
