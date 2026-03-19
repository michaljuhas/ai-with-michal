import { PostHogConfig } from './config';
export declare class ApiError extends Error {
    readonly status: number;
    readonly body: string;
    constructor(status: number, body: string);
}
export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
}
export declare class PostHogClient {
    private readonly config;
    private readonly baseUrl;
    private readonly headers;
    constructor(config: PostHogConfig);
    get projectId(): string;
    request<T = unknown>(path: string, opts?: RequestOptions): Promise<T>;
}
export declare function createClient(config: PostHogConfig): PostHogClient;
