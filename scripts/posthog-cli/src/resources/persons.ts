import { PostHogClient } from '../lib/client';

export interface ListPersonsParams {
  limit?: number;
  offset?: number;
  search?: string;
  distinct_id?: string;
}

export async function listPersons(client: PostHogClient, params: ListPersonsParams = {}) {
  const { limit = 20, offset, search, distinct_id } = params;
  return client.request(`/projects/${client.projectId}/persons/`, {
    query: { limit, offset, search, distinct_id },
  });
}

export async function retrievePerson(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/persons/${id}/`);
}

export async function deletePerson(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${client.projectId}/persons/${id}/`, { method: 'DELETE' });
}
