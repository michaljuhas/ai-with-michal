import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.PaymentIntentCreateParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    update(client: Stripe, id: string, params: Stripe.PaymentIntentUpdateParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    list(client: Stripe, params?: Stripe.PaymentIntentListParams): Stripe.ApiListPromise<Stripe.PaymentIntent>;
    confirm(client: Stripe, id: string, params?: Stripe.PaymentIntentConfirmParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    capture(client: Stripe, id: string, params?: Stripe.PaymentIntentCaptureParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    cancel(client: Stripe, id: string, params?: Stripe.PaymentIntentCancelParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    search(client: Stripe, params: Stripe.PaymentIntentSearchParams): Stripe.ApiSearchResultPromise<Stripe.PaymentIntent>;
};
export default _default;
//# sourceMappingURL=payment-intents.d.ts.map