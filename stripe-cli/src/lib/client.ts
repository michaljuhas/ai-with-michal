import Stripe from 'stripe';

export interface ClientOptions {
  live?: boolean;
}

export function createClient(apiKey: string, options?: ClientOptions): Stripe {
  return new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    typescript: true,
  });
}
