import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.PriceCreateParams) {
    return client.prices.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.prices.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.PriceUpdateParams) {
    return client.prices.update(id, params);
  },

  deactivate(client: Stripe, id: string) {
    return client.prices.update(id, { active: false });
  },

  list(client: Stripe, params?: Stripe.PriceListParams) {
    return client.prices.list(params);
  },

  search(client: Stripe, params: Stripe.PriceSearchParams) {
    return client.prices.search(params);
  },
};
