import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.ProductCreateParams) {
    return client.products.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.products.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.ProductUpdateParams) {
    return client.products.update(id, params);
  },

  del(client: Stripe, id: string) {
    return client.products.del(id);
  },

  list(client: Stripe, params?: Stripe.ProductListParams) {
    return client.products.list(params);
  },

  search(client: Stripe, params: Stripe.ProductSearchParams) {
    return client.products.search(params);
  },
};
