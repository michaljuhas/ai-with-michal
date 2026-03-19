import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.RefundCreateParams) {
    return client.refunds.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.refunds.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.RefundUpdateParams) {
    return client.refunds.update(id, params);
  },

  list(client: Stripe, params?: Stripe.RefundListParams) {
    return client.refunds.list(params);
  },

  cancel(client: Stripe, id: string) {
    return client.refunds.cancel(id, undefined, { idempotencyKey: generateKey() });
  },
};
