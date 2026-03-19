import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.RefundCreateParams): Promise<Stripe.Response<Stripe.Refund>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Refund>>;
    update(client: Stripe, id: string, params: Stripe.RefundUpdateParams): Promise<Stripe.Response<Stripe.Refund>>;
    list(client: Stripe, params?: Stripe.RefundListParams): Stripe.ApiListPromise<Stripe.Refund>;
    cancel(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Refund>>;
};
export default _default;
//# sourceMappingURL=refunds.d.ts.map