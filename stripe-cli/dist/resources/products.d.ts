import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.ProductCreateParams): Promise<Stripe.Response<Stripe.Product>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Product>>;
    update(client: Stripe, id: string, params: Stripe.ProductUpdateParams): Promise<Stripe.Response<Stripe.Product>>;
    del(client: Stripe, id: string): Promise<Stripe.Response<Stripe.DeletedProduct>>;
    list(client: Stripe, params?: Stripe.ProductListParams): Stripe.ApiListPromise<Stripe.Product>;
    search(client: Stripe, params: Stripe.ProductSearchParams): Stripe.ApiSearchResultPromise<Stripe.Product>;
};
export default _default;
//# sourceMappingURL=products.d.ts.map