import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.WebhookEndpointCreateParams) {
    return client.webhookEndpoints.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.webhookEndpoints.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.WebhookEndpointUpdateParams) {
    return client.webhookEndpoints.update(id, params);
  },

  del(client: Stripe, id: string) {
    return client.webhookEndpoints.del(id);
  },

  list(client: Stripe, params?: Stripe.WebhookEndpointListParams) {
    return client.webhookEndpoints.list(params);
  },
};
