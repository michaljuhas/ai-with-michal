import { PostHogClient } from '../lib/client';

export interface CreateInsightParams {
  name: string;
  filters?: Record<string, unknown>;
  description?: string;
}

export interface UpdateInsightParams {
  name?: string;
  filters?: Record<string, unknown>;
  description?: string;
}

export interface ListInsightsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export async function listInsights(client: PostHogClient, params: ListInsightsParams = {}) {
  const { limit = 20, offset, search } = params;
  return client.request(`/projects/${client.projectId}/insights/`, { query: { limit, offset, search } });
}

export async function retrieveInsight(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/insights/${id}/`);
}

export async function createInsight(client: PostHogClient, params: CreateInsightParams) {
  return client.request(`/projects/${client.projectId}/insights/`, { method: 'POST', body: params });
}

export async function updateInsight(client: PostHogClient, id: number | string, params: UpdateInsightParams) {
  return client.request(`/projects/${client.projectId}/insights/${id}/`, { method: 'PATCH', body: params });
}

export async function deleteInsight(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/insights/${id}/`, { method: 'DELETE' });
}
