import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.CustomerCreateParams) {
    return client.customers.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.customers.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.CustomerUpdateParams) {
    return client.customers.update(id, params);
  },

  del(client: Stripe, id: string) {
    return client.customers.del(id);
  },

  list(client: Stripe, params?: Stripe.CustomerListParams) {
    return client.customers.list(params);
  },

  search(client: Stripe, params: Stripe.CustomerSearchParams) {
    return client.customers.search(params);
  },
};
