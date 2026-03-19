import { PostHogClient } from '../lib/client';

export interface CreateDashboardParams {
  name: string;
  description?: string;
}

export interface UpdateDashboardParams {
  name?: string;
  description?: string;
}

export async function listDashboards(client: PostHogClient, params: { limit?: number; offset?: number } = {}) {
  return client.request(`/projects/${client.projectId}/dashboards/`, {
    query: { limit: params.limit ?? 20, offset: params.offset },
  });
}

export async function retrieveDashboard(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/dashboards/${id}/`);
}

export async function createDashboard(client: PostHogClient, params: CreateDashboardParams) {
  return client.request(`/projects/${client.projectId}/dashboards/`, { method: 'POST', body: params });
}

export async function updateDashboard(client: PostHogClient, id: number | string, params: UpdateDashboardParams) {
  return client.request(`/projects/${client.projectId}/dashboards/${id}/`, { method: 'PATCH', body: params });
}

export async function deleteDashboard(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/dashboards/${id}/`, { method: 'DELETE' });
}
