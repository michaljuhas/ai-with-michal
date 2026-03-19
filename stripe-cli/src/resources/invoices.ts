import Stripe from 'stripe';
import { generateKey } from '../lib/idempotency';

export default {
  create(client: Stripe, params: Stripe.InvoiceCreateParams) {
    return client.invoices.create(params, { idempotencyKey: generateKey() });
  },

  retrieve(client: Stripe, id: string) {
    return client.invoices.retrieve(id);
  },

  update(client: Stripe, id: string, params: Stripe.InvoiceUpdateParams) {
    return client.invoices.update(id, params);
  },

  del(client: Stripe, id: string) {
    return client.invoices.del(id);
  },

  list(client: Stripe, params?: Stripe.InvoiceListParams) {
    return client.invoices.list(params);
  },

  finalize(client: Stripe, id: string, params?: Stripe.InvoiceFinalizeInvoiceParams) {
    return client.invoices.finalizeInvoice(id, params, { idempotencyKey: generateKey() });
  },

  pay(client: Stripe, id: string, params?: Stripe.InvoicePayParams) {
    return client.invoices.pay(id, params, { idempotencyKey: generateKey() });
  },

  sendInvoice(client: Stripe, id: string) {
    return client.invoices.sendInvoice(id, undefined, { idempotencyKey: generateKey() });
  },

  voidInvoice(client: Stripe, id: string) {
    return client.invoices.voidInvoice(id, undefined, { idempotencyKey: generateKey() });
  },

  search(client: Stripe, params: Stripe.InvoiceSearchParams) {
    return client.invoices.search(params);
  },
};
