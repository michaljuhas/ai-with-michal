import { PostHogClient } from '../lib/client';

export interface CreateCohortParams {
  name: string;
  description?: string;
  filters?: Record<string, unknown>;
  is_static?: boolean;
}

export interface UpdateCohortParams {
  name?: string;
  description?: string;
  filters?: Record<string, unknown>;
}

export async function listCohorts(client: PostHogClient, params: { limit?: number; offset?: number } = {}) {
  return client.request(`/projects/${client.projectId}/cohorts/`, {
    query: { limit: params.limit ?? 20, offset: params.offset },
  });
}

export async function retrieveCohort(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/cohorts/${id}/`);
}

export async function createCohort(client: PostHogClient, params: CreateCohortParams) {
  return client.request(`/projects/${client.projectId}/cohorts/`, { method: 'POST', body: params });
}

export async function updateCohort(client: PostHogClient, id: number | string, params: UpdateCohortParams) {
  return client.request(`/projects/${client.projectId}/cohorts/${id}/`, { method: 'PATCH', body: params });
}

export async function deleteCohort(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/cohorts/${id}/`, { method: 'DELETE' });
}
