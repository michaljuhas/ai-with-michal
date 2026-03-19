import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listAnnotations, createAnnotation, updateAnnotation, deleteAnnotation } from './annotations';
import { PostHogClient } from '../lib/client';

function makeClient() {
  return { projectId: '42', request: vi.fn() } as unknown as PostHogClient;
}

describe('annotations', () => {
  let client: PostHogClient;
  beforeEach(() => { client = makeClient(); });

  it('listAnnotations calls correct endpoint', async () => {
    vi.mocked(client.request).mockResolvedValue({ results: [] });
    await listAnnotations(client);
    expect(client.request).toHaveBeenCalledWith('/projects/42/annotations/', expect.any(Object));
  });

  it('createAnnotation sends POST with content', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await createAnnotation(client, { content: 'Deploy v2.0', date_marker: '2026-03-19T00:00:00Z' });
    const [path, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string; body: { content: string } }];
    expect(path).toBe('/projects/42/annotations/');
    expect(opts.method).toBe('POST');
    expect(opts.body.content).toBe('Deploy v2.0');
  });

  it('updateAnnotation sends PATCH', async () => {
    vi.mocked(client.request).mockResolvedValue({ id: 1 });
    await updateAnnotation(client, 1, { content: 'Updated' });
    const [, opts] = vi.mocked(client.request).mock.calls[0] as [string, { method: string }];
    expect(opts.method).toBe('PATCH');
  });

  it('deleteAnnotation sends DELETE', async () => {
    vi.mocked(client.request).mockResolvedValue(undefined);
    await deleteAnnotation(client, 2);
    expect(client.request).toHaveBeenCalledWith('/projects/42/annotations/2/', { method: 'DELETE' });
  });
});
