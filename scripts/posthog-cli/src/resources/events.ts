import { PostHogClient } from '../lib/client';

export interface ListEventsParams {
  event?: string;
  distinct_id?: string;
  limit?: number;
  after?: string;
  before?: string;
}

export interface EventResult {
  results: unknown[];
  next?: string;
}

export async function listEvents(client: PostHogClient, params: ListEventsParams = {}): Promise<EventResult> {
  const { event, distinct_id, limit = 10, after, before } = params;
  return client.request<EventResult>(`/projects/${client.projectId}/events/`, {
    query: { event, distinct_id, limit, after, before },
  });
}
