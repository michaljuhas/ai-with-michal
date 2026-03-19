import Stripe from 'stripe';
import { createClient, ClientOptions } from './lib/client';
import { getApiKey } from './lib/config';
import customers from './resources/customers';
import paymentIntents from './resources/payment-intents';
import charges from './resources/charges';
import subscriptions from './resources/subscriptions';
import products from './resources/products';
import prices from './resources/prices';
import invoices from './resources/invoices';
import refunds from './resources/refunds';
import events from './resources/events';
import webhookEndpoints from './resources/webhook-endpoints';

export interface StripeCLIOptions extends ClientOptions {
  apiKey?: string;
  format?: 'json' | 'table';
}

export class StripeCLI {
  private client: Stripe;
  readonly format: 'json' | 'table';

  constructor(options: StripeCLIOptions = {}) {
    const key = options.apiKey ?? getApiKey();
    this.client = createClient(key, options);
    this.format = options.format ?? 'json';
  }

  get customers() {
    const c = this.client;
    return {
      create: (p: Stripe.CustomerCreateParams) => customers.create(c, p),
      retrieve: (id: string) => customers.retrieve(c, id),
      update: (id: string, p: Stripe.CustomerUpdateParams) => customers.update(c, id, p),
      del: (id: string) => customers.del(c, id),
      list: (p?: Stripe.CustomerListParams) => customers.list(c, p),
      search: (p: Stripe.CustomerSearchParams) => customers.search(c, p),
    };
  }

  get paymentIntents() {
    const c = this.client;
    return {
      create: (p: Stripe.PaymentIntentCreateParams) => paymentIntents.create(c, p),
      retrieve: (id: string) => paymentIntents.retrieve(c, id),
      update: (id: string, p: Stripe.PaymentIntentUpdateParams) => paymentIntents.update(c, id, p),
      list: (p?: Stripe.PaymentIntentListParams) => paymentIntents.list(c, p),
      confirm: (id: string, p?: Stripe.PaymentIntentConfirmParams) => paymentIntents.confirm(c, id, p),
      capture: (id: string, p?: Stripe.PaymentIntentCaptureParams) => paymentIntents.capture(c, id, p),
      cancel: (id: string, p?: Stripe.PaymentIntentCancelParams) => paymentIntents.cancel(c, id, p),
      search: (p: Stripe.PaymentIntentSearchParams) => paymentIntents.search(c, p),
    };
  }

  get charges() {
    const c = this.client;
    return {
      retrieve: (id: string) => charges.retrieve(c, id),
      list: (p?: Stripe.ChargeListParams) => charges.list(c, p),
      capture: (id: string, p?: Stripe.ChargeCaptureParams) => charges.capture(c, id, p),
      search: (p: Stripe.ChargeSearchParams) => charges.search(c, p),
    };
  }

  get subscriptions() {
    const c = this.client;
    return {
      create: (p: Stripe.SubscriptionCreateParams) => subscriptions.create(c, p),
      retrieve: (id: string) => subscriptions.retrieve(c, id),
      update: (id: string, p: Stripe.SubscriptionUpdateParams) => subscriptions.update(c, id, p),
      cancel: (id: string) => subscriptions.cancel(c, id),
      list: (p?: Stripe.SubscriptionListParams) => subscriptions.list(c, p),
      resume: (id: string, p: Stripe.SubscriptionResumeParams) => subscriptions.resume(c, id, p),
      search: (p: Stripe.SubscriptionSearchParams) => subscriptions.search(c, p),
    };
  }

  get products() {
    const c = this.client;
    return {
      create: (p: Stripe.ProductCreateParams) => products.create(c, p),
      retrieve: (id: string) => products.retrieve(c, id),
      update: (id: string, p: Stripe.ProductUpdateParams) => products.update(c, id, p),
      del: (id: string) => products.del(c, id),
      list: (p?: Stripe.ProductListParams) => products.list(c, p),
      search: (p: Stripe.ProductSearchParams) => products.search(c, p),
    };
  }

  get prices() {
    const c = this.client;
    return {
      create: (p: Stripe.PriceCreateParams) => prices.create(c, p),
      retrieve: (id: string) => prices.retrieve(c, id),
      update: (id: string, p: Stripe.PriceUpdateParams) => prices.update(c, id, p),
      deactivate: (id: string) => prices.deactivate(c, id),
      list: (p?: Stripe.PriceListParams) => prices.list(c, p),
      search: (p: Stripe.PriceSearchParams) => prices.search(c, p),
    };
  }

  get invoices() {
    const c = this.client;
    return {
      create: (p: Stripe.InvoiceCreateParams) => invoices.create(c, p),
      retrieve: (id: string) => invoices.retrieve(c, id),
      update: (id: string, p: Stripe.InvoiceUpdateParams) => invoices.update(c, id, p),
      del: (id: string) => invoices.del(c, id),
      list: (p?: Stripe.InvoiceListParams) => invoices.list(c, p),
      finalize: (id: string) => invoices.finalize(c, id),
      pay: (id: string) => invoices.pay(c, id),
      sendInvoice: (id: string) => invoices.sendInvoice(c, id),
      voidInvoice: (id: string) => invoices.voidInvoice(c, id),
      search: (p: Stripe.InvoiceSearchParams) => invoices.search(c, p),
    };
  }

  get refunds() {
    const c = this.client;
    return {
      create: (p: Stripe.RefundCreateParams) => refunds.create(c, p),
      retrieve: (id: string) => refunds.retrieve(c, id),
      update: (id: string, p: Stripe.RefundUpdateParams) => refunds.update(c, id, p),
      list: (p?: Stripe.RefundListParams) => refunds.list(c, p),
      cancel: (id: string) => refunds.cancel(c, id),
    };
  }

  get events() {
    const c = this.client;
    return {
      retrieve: (id: string) => events.retrieve(c, id),
      list: (p?: Stripe.EventListParams) => events.list(c, p),
    };
  }

  get webhookEndpoints() {
    const c = this.client;
    return {
      create: (p: Stripe.WebhookEndpointCreateParams) => webhookEndpoints.create(c, p),
      retrieve: (id: string) => webhookEndpoints.retrieve(c, id),
      update: (id: string, p: Stripe.WebhookEndpointUpdateParams) => webhookEndpoints.update(c, id, p),
      del: (id: string) => webhookEndpoints.del(c, id),
      list: (p?: Stripe.WebhookEndpointListParams) => webhookEndpoints.list(c, p),
    };
  }
}

// Named module exports for direct use
export {
  customers,
  paymentIntents,
  charges,
  subscriptions,
  products,
  prices,
  invoices,
  refunds,
  events,
  webhookEndpoints,
};
export { createClient } from './lib/client';
export { getApiKey } from './lib/config';
export { formatOutput } from './lib/output';
export { formatError } from './lib/errors';
export { generateKey } from './lib/idempotency';
