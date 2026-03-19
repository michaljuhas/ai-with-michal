import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProjects, retrieveProject } from './projects';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('projects', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listProjects calls /projects/ endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listProjects(client);
    expect(client.request).toHaveBeenCalledWith('/projects/');
  });

  it('retrieveProject calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1, name: 'My Project' });
    await retrieveProject(client, 1);
    expect(client.request).toHaveBeenCalledWith('/projects/1/');
  });
});
