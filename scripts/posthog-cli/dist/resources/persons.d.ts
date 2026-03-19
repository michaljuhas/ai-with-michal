import { PostHogClient } from '../lib/client';
export interface ListPersonsParams {
    limit?: number;
    offset?: number;
    search?: string;
    distinct_id?: string;
}
export declare function listPersons(client: PostHogClient, params?: ListPersonsParams): Promise<unknown>;
export declare function retrievePerson(client: PostHogClient, id: number | string): Promise<unknown>;
export declare function deletePerson(client: PostHogClient, id: number | string): Promise<unknown>;
