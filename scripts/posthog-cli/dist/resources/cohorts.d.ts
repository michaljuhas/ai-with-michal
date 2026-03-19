import { PostHogClient } from '../lib/client';
export interface CreateCohortParams {
    name: string;
    description?: string;
    filters?: Record<string, unknown>;
    is_static?: boolean;
}
export interface UpdateCohortParams {
    name?: string;
    description?: string;
    filters?: Record<string, unknown>;
}
export declare function listCohorts(client: PostHogClient, params?: {
    limit?: number;
    offset?: number;
}): Promise<unknown>;
export declare function retrieveCohort(client: PostHogClient, id: number | string): Promise<unknown>;
export declare function createCohort(client: PostHogClient, params: CreateCohortParams): Promise<unknown>;
export declare function updateCohort(client: PostHogClient, id: number | string, params: UpdateCohortParams): Promise<unknown>;
export declare function deleteCohort(client: PostHogClient, id: number | string): Promise<unknown>;
