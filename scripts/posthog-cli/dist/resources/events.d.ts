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
export declare function listEvents(client: PostHogClient, params?: ListEventsParams): Promise<EventResult>;
