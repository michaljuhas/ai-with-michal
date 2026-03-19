import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.WebhookEndpointCreateParams): Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
    update(client: Stripe, id: string, params: Stripe.WebhookEndpointUpdateParams): Promise<Stripe.Response<Stripe.WebhookEndpoint>>;
    del(client: Stripe, id: string): Promise<Stripe.Response<Stripe.DeletedWebhookEndpoint>>;
    list(client: Stripe, params?: Stripe.WebhookEndpointListParams): Stripe.ApiListPromise<Stripe.WebhookEndpoint>;
};
export default _default;
//# sourceMappingURL=webhook-endpoints.d.ts.map