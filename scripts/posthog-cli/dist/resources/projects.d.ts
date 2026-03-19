import { PostHogClient } from '../lib/client';
export declare function listProjects(client: PostHogClient): Promise<unknown>;
export declare function retrieveProject(client: PostHogClient, id: number | string): Promise<unknown>;
