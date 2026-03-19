import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.PaymentIntentCreateParams) {
    return client.paymentIntents.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.paymentIntents.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.PaymentIntentUpdateParams) {
    return client.paymentIntents.update(id, params);
  },

  list(client: Stripe, params?: Stripe.PaymentIntentListParams) {
    return client.paymentIntents.list(params);
  },

  confirm(client: Stripe, id: string, params?: Stripe.PaymentIntentConfirmParams) {
    return client.paymentIntents.confirm(id, params, { idempotencyKey: generateKey() });
  },

  capture(client: Stripe, id: string, params?: Stripe.PaymentIntentCaptureParams) {
    return client.paymentIntents.capture(id, params, { idempotencyKey: generateKey() });
  },

  cancel(client: Stripe, id: string, params?: Stripe.PaymentIntentCancelParams) {
    return client.paymentIntents.cancel(id, params, { idempotencyKey: generateKey() });
  },

  search(client: Stripe, params: Stripe.PaymentIntentSearchParams) {
    return client.paymentIntents.search(params);
  },
};
