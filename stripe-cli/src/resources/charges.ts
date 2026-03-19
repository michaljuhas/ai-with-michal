import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  retrieve(client: Stripe, id: string) {
    return client.charges.retrieve(id);
  },

  list(client: Stripe, params?: Stripe.ChargeListParams) {
    return client.charges.list(params);
  },

  capture(client: Stripe, id: string, params?: Stripe.ChargeCaptureParams) {
    return client.charges.capture(id, params, { idempotencyKey: generateKey() });
  },

  search(client: Stripe, params: Stripe.ChargeSearchParams) {
    return client.charges.search(params);
  },
};
