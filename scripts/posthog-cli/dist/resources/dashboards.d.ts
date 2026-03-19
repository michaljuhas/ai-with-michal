import { PostHogClient } from '../lib/client';
export interface CreateDashboardParams {
    name: string;
    description?: string;
}
export interface UpdateDashboardParams {
    name?: string;
    description?: string;
}
export declare function listDashboards(client: PostHogClient, params?: {
    limit?: number;
    offset?: number;
}): Promise<unknown>;
export declare function retrieveDashboard(client: PostHogClient, id: number | string): Promise<unknown>;
export declare function createDashboard(client: PostHogClient, params: CreateDashboardParams): Promise<unknown>;
export declare function updateDashboard(client: PostHogClient, id: number | string, params: UpdateDashboardParams): Promise<unknown>;
export declare function deleteDashboard(client: PostHogClient, id: number | string): Promise<unknown>;
