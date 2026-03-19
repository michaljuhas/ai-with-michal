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
export declare function runQuery(client: PostHogClient, params: HogQLQueryParams): Promise<QueryResult>;
