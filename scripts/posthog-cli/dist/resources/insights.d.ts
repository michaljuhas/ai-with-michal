import { PostHogClient } from '../lib/client';
export interface CreateInsightParams {
    name: string;
    filters?: Record<string, unknown>;
    description?: string;
}
export interface UpdateInsightParams {
    name?: string;
    filters?: Record<string, unknown>;
    description?: string;
}
export interface ListInsightsParams {
    limit?: number;
    offset?: number;
    search?: string;
}
export declare function listInsights(client: PostHogClient, params?: ListInsightsParams): Promise<unknown>;
export declare function retrieveInsight(client: PostHogClient, id: number | string): Promise<unknown>;
export declare function createInsight(client: PostHogClient, params: CreateInsightParams): Promise<unknown>;
export declare function updateInsight(client: PostHogClient, id: number | string, params: UpdateInsightParams): Promise<unknown>;
export declare function deleteInsight(client: PostHogClient, id: number | string): Promise<unknown>;
