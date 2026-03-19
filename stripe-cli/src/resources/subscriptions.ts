import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.SubscriptionCreateParams) {
    return client.subscriptions.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.subscriptions.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.SubscriptionUpdateParams) {
    return client.subscriptions.update(id, params);
  },

  cancel(client: Stripe, id: string) {
    return client.subscriptions.cancel(id);
  },

  list(client: Stripe, params?: Stripe.SubscriptionListParams) {
    return client.subscriptions.list(params);
  },

  resume(client: Stripe, id: string, params: Stripe.SubscriptionResumeParams) {
    return client.subscriptions.resume(id, params, { idempotencyKey: generateKey() });
  },

  search(client: Stripe, params: Stripe.SubscriptionSearchParams) {
    return client.subscriptions.search(params);
  },
};
