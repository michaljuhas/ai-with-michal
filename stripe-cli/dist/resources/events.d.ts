import Stripe from 'stripe';
declare const _default: {
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Event>>;
    list(client: Stripe, params?: Stripe.EventListParams): Stripe.ApiListPromise<Stripe.Event>;
};
export default _default;
//# sourceMappingURL=events.d.ts.map