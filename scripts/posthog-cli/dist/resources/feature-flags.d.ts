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
export declare function listFlags(client: PostHogClient, params?: ListFlagsParams): Promise<unknown>;
export declare function retrieveFlag(client: PostHogClient, id: number | string): Promise<unknown>;
export declare function createFlag(client: PostHogClient, params: CreateFlagParams): Promise<unknown>;
export declare function updateFlag(client: PostHogClient, id: number | string, params: UpdateFlagParams): Promise<unknown>;
export declare function deleteFlag(client: PostHogClient, id: number | string): Promise<unknown>;
