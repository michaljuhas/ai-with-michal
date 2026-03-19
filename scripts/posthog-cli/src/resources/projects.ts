import { PostHogClient } from '../lib/client';

export async function listProjects(client: PostHogClient) {
  return client.request('/projects/');
}

export async function retrieveProject(client: PostHogClient, id: number | string) {
  return client.request(`/projects/${id}/`);
}
