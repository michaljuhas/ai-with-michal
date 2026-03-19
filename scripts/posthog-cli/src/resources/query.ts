import { PostHogClient } from '../lib/client';

export interface HogQLQueryParams {
  query: string;
}

export interface QueryResult {
  results: unknown[][];
  columns?: string[];
  types?: string[];
  hogql?: string;
  timings?: unknown[];
}

export async function runQuery(client: PostHogClient, params: HogQLQueryParams): Promise<QueryResult> {
  return client.request<QueryResult>(`/projects/${client.projectId}/query/`, {
    method: 'POST',
    body: { query: { kind: 'HogQLQuery', query: params.query } },
  });
}
