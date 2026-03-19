import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.SubscriptionCreateParams): Promise<Stripe.Response<Stripe.Subscription>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Subscription>>;
    update(client: Stripe, id: string, params: Stripe.SubscriptionUpdateParams): Promise<Stripe.Response<Stripe.Subscription>>;
    cancel(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Subscription>>;
    list(client: Stripe, params?: Stripe.SubscriptionListParams): Stripe.ApiListPromise<Stripe.Subscription>;
    resume(client: Stripe, id: string, params: Stripe.SubscriptionResumeParams): Promise<Stripe.Response<Stripe.Subscription>>;
    search(client: Stripe, params: Stripe.SubscriptionSearchParams): Stripe.ApiSearchResultPromise<Stripe.Subscription>;
};
export default _default;
//# sourceMappingURL=subscriptions.d.ts.map