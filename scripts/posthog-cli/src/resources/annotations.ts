import { PostHogClient } from '../lib/client';

export interface CreateAnnotationParams {
  content: string;
  date_marker?: string;   // ISO 8601 date string
  scope?: 'project' | 'organization';
}

export interface UpdateAnnotationParams {
  content?: string;
  date_marker?: string;
}

export async function listAnnotations(client: PostHogClient, params: { limit?: number; offset?: number } = {}) {
  return client.request(`/projects/${client.projectId}/annotations/`, {
    query: { limit: params.limit ?? 20, offset: params.offset },
  });
}

export async function createAnnotation(client: PostHogClient, params: CreateAnnotationParams) {
  return client.request(`/projects/${client.projectId}/annotations/`, { method: 'POST', body: params });
}

export async function updateAnnotation(client: PostHogClient, id: number | string, params: UpdateAnnotationParams) {
  return client.request(`/projects/${client.projectId}/annotations/${id}/`, { method: 'PATCH', body: params });
}

export async function deleteAnnotation(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/annotations/${id}/`, { method: 'DELETE' });
}
