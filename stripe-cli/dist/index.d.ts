import Stripe from 'stripe';
import { ClientOptions } from './lib/client';
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
export declare class StripeCLI {
    private client;
    readonly format: 'json' | 'table';
    constructor(options?: StripeCLIOptions);
    get customers(): {
        create: (p: Stripe.CustomerCreateParams) => Promise<Stripe.Response<Stripe.Customer>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
        update: (id: string, p: Stripe.CustomerUpdateParams) => Promise<Stripe.Response<Stripe.Customer>>;
        del: (id: string) => Promise<Stripe.Response<Stripe.DeletedCustomer>>;
        list: (p?: Stripe.CustomerListParams) => Stripe.ApiListPromise<Stripe.Customer>;
        search: (p: Stripe.CustomerSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Customer>;
    };
    get paymentIntents(): {
        create: (p: Stripe.PaymentIntentCreateParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        update: (id: string, p: Stripe.PaymentIntentUpdateParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        list: (p?: Stripe.PaymentIntentListParams) => Stripe.ApiListPromise<Stripe.PaymentIntent>;
        confirm: (id: string, p?: Stripe.PaymentIntentConfirmParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        capture: (id: string, p?: Stripe.PaymentIntentCaptureParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        cancel: (id: string, p?: Stripe.PaymentIntentCancelParams) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
        search: (p: Stripe.PaymentIntentSearchParams) => Stripe.ApiSearchResultPromise<Stripe.PaymentIntent>;
    };
    get charges(): {
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Charge>>;
        list: (p?: Stripe.ChargeListParams) => Stripe.ApiListPromise<Stripe.Charge>;
        capture: (id: string, p?: Stripe.ChargeCaptureParams) => Promise<Stripe.Response<Stripe.Charge>>;
        search: (p: Stripe.ChargeSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Charge>;
    };
    get subscriptions(): {
        create: (p: Stripe.SubscriptionCreateParams) => Promise<Stripe.Response<Stripe.Subscription>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Subscription>>;
        update: (id: string, p: Stripe.SubscriptionUpdateParams) => Promise<Stripe.Response<Stripe.Subscription>>;
        cancel: (id: string) => Promise<Stripe.Response<Stripe.Subscription>>;
        list: (p?: Stripe.SubscriptionListParams) => Stripe.ApiListPromise<Stripe.Subscription>;
        resume: (id: string, p: Stripe.SubscriptionResumeParams) => Promise<Stripe.Response<Stripe.Subscription>>;
        search: (p: Stripe.SubscriptionSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Subscription>;
    };
    get products(): {
        create: (p: Stripe.ProductCreateParams) => Promise<Stripe.Response<Stripe.Product>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Product>>;
        update: (id: string, p: Stripe.ProductUpdateParams) => Promise<Stripe.Response<Stripe.Product>>;
        del: (id: string) => Promise<Stripe.Response<Stripe.DeletedProduct>>;
        list: (p?: Stripe.ProductListParams) => Stripe.ApiListPromise<Stripe.Product>;
        search: (p: Stripe.ProductSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Product>;
    };
    get prices(): {
        create: (p: Stripe.PriceCreateParams) => Promise<Stripe.Response<Stripe.Price>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Price>>;
        update: (id: string, p: Stripe.PriceUpdateParams) => Promise<Stripe.Response<Stripe.Price>>;
        deactivate: (id: string) => Promise<Stripe.Response<Stripe.Price>>;
        list: (p?: Stripe.PriceListParams) => Stripe.ApiListPromise<Stripe.Price>;
        search: (p: Stripe.PriceSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Price>;
    };
    get invoices(): {
        create: (p: Stripe.InvoiceCreateParams) => Promise<Stripe.Response<Stripe.Invoice>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Invoice>>;
        update: (id: string, p: Stripe.InvoiceUpdateParams) => Promise<Stripe.Response<Stripe.Invoice>>;
        del: (id: string) => Promise<Stripe.Response<Stripe.DeletedInvoice>>;
        list: (p?: Stripe.InvoiceListParams) => Stripe.ApiListPromise<Stripe.Invoice>;
        finalize: (id: string) => Promise<Stripe.Response<Stripe.Invoice>>;
        pay: (id: string) => Promise<Stripe.Response<Stripe.Invoice>>;
        sendInvoice: (id: string) => Promise<Stripe.Response<Stripe.Invoice>>;
        voidInvoice: (id: string) => Promise<Stripe.Response<Stripe.Invoice>>;
        search: (p: Stripe.InvoiceSearchParams) => Stripe.ApiSearchResultPromise<Stripe.Invoice>;
    };
    get refunds(): {
        create: (p: Stripe.RefundCreateParams) => Promise<Stripe.Response<Stripe.Refund>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Refund>>;
        update: (id: string, p: Stripe.RefundUpdateParams) => Promise<Stripe.Response<Stripe.Refund>>;
        list: (p?: Stripe.RefundListParams) => Stripe.ApiListPromise<Stripe.Refund>;
        cancel: (id: string) => Promise<Stripe.Response<Stripe.Refund>>;
    };
    get events(): {
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.Event>>;
        list: (p?: Stripe.EventListParams) => Stripe.ApiListPromise<Stripe.Event>;
    };
    get webhookEndpoints(): {
        create: (p: Stripe.WebhookEndpointCreateParams) => Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
        retrieve: (id: string) => Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
        update: (id: string, p: Stripe.WebhookEndpointUpdateParams) => Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
        del: (id: string) => Promise<Stripe.Response<Stripe.DeletedWebhookEndpoint>>;
        list: (p?: Stripe.WebhookEndpointListParams) => Stripe.ApiListPromise<Stripe.WebhookEndpoint>;
    };
}
export { customers, paymentIntents, charges, subscriptions, products, prices, invoices, refunds, events, webhookEndpoints, };
export { createClient } from './lib/client';
export { getApiKey } from './lib/config';
export { formatOutput } from './lib/output';
export { formatError } from './lib/errors';
export { generateKey } from './lib/idempotency';
//# sourceMappingURL=index.d.ts.map