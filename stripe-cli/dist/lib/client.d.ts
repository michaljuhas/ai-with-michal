import Stripe from 'stripe';
export interface ClientOptions {
    live?: boolean;
}
export declare function createClient(apiKey: string, options?: ClientOptions): Stripe;
//# sourceMappingURL=client.d.ts.map