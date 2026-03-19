import Stripe from 'stripe';
declare const _default: {
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Charge>>;
    list(client: Stripe, params?: Stripe.ChargeListParams): Stripe.ApiListPromise<Stripe.Charge>;
    capture(client: Stripe, id: string, params?: Stripe.ChargeCaptureParams): Promise<Stripe.Response<Stripe.Charge>>;
    search(client: Stripe, params: Stripe.ChargeSearchParams): Stripe.ApiSearchResultPromise<Stripe.Charge>;
};
export default _default;
//# sourceMappingURL=charges.d.ts.map