import Stripe from 'stripe';

export default {
  retrieve(client: Stripe, id: string) {
    return client.events.retrieve(id);
  },

  list(client: Stripe, params?: Stripe.EventListParams) {
    return client.events.list(params);
  },
};
