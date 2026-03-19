import { PostHogClient } from '../lib/client';
export interface CreateAnnotationParams {
    content: string;
    date_marker?: string;
    scope?: 'project' | 'organization';
}
export interface UpdateAnnotationParams {
    content?: string;
    date_marker?: string;
}
export declare function listAnnotations(client: PostHogClient, params?: {
    limit?: number;
    offset?: number;
}): Promise<unknown>;
export declare function createAnnotation(client: PostHogClient, params: CreateAnnotationParams): Promise<unknown>;
export declare function updateAnnotation(client: PostHogClient, id: number | string, params: UpdateAnnotationParams): Promise<unknown>;
export declare function deleteAnnotation(client: PostHogClient, id: number | string): Promise<unknown>;
