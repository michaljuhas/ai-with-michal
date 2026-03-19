import { PostHogClient } from '../lib/client';

export interface CreateFlagParams {
  name: string;
  key: string;
  filters?: Record<string, unknown>;
  active?: boolean;
  rollout_percentage?: number;
}

export interface UpdateFlagParams {
  name?: string;
  active?: boolean;
  filters?: Record<string, unknown>;
  rollout_percentage?: number;
}

export interface ListFlagsParams {
  limit?: number;
  offset?: number;
  active?: boolean;
  search?: string;
}

export async function listFlags(client: PostHogClient, params: ListFlagsParams = {}) {
  const { limit = 20, offset, active, search } = params;
  return client.request(`/projects/${client.projectId}/feature_flags/`, {
    query: { limit, offset, active, search },
  });
}

export async function retrieveFlag(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/feature_flags/${id}/`);
}

export async function createFlag(client: PostHogClient, params: CreateFlagParams) {
  const body: Record<string, unknown> = { name: params.name, key: params.key };
  if (params.filters !== undefined) body['filters'] = params.filters;
  if (params.active !== undefined) body['active'] = params.active;
  if (params.rollout_percentage !== undefined) {
    body['filters'] = {
      ...((params.filters as Record<string, unknown>) ?? {}),
      groups: [{ properties: [], rollout_percentage: params.rollout_percentage }],
    };
  }
  return client.request(`/projects/${client.projectId}/feature_flags/`, { method: 'POST', body });
}

export async function updateFlag(client: PostHogClient, id: number | string, params: UpdateFlagParams) {
  return client.request(`/projects/${client.projectId}/feature_flags/${id}/`, { method: 'PATCH', body: params });
}

export async function deleteFlag(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/feature_flags/${id}/`, { method: 'DELETE' });
}
