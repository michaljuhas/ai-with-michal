import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.PriceCreateParams): Promise<Stripe.Response<Stripe.Price>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Price>>;
    update(client: Stripe, id: string, params: Stripe.PriceUpdateParams): Promise<Stripe.Response<Stripe.Price>>;
    deactivate(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Price>>;
    list(client: Stripe, params?: Stripe.PriceListParams): Stripe.ApiListPromise<Stripe.Price>;
    search(client: Stripe, params: Stripe.PriceSearchParams): Stripe.ApiSearchResultPromise<Stripe.Price>;
};
export default _default;
//# sourceMappingURL=prices.d.ts.map