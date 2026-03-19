import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.CustomerCreateParams): Promise<Stripe.Response<Stripe.Customer>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    update(client: Stripe, id: string, params: Stripe.CustomerUpdateParams): Promise<Stripe.Response<Stripe.Customer>>;
    del(client: Stripe, id: string): Promise<Stripe.Response<Stripe.DeletedCustomer>>;
    list(client: Stripe, params?: Stripe.CustomerListParams): Stripe.ApiListPromise<Stripe.Customer>;
    search(client: Stripe, params: Stripe.CustomerSearchParams): Stripe.ApiSearchResultPromise<Stripe.Customer>;
};
export default _default;
//# sourceMappingURL=customers.d.ts.map