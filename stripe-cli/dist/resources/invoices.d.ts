import Stripe from 'stripe';
declare const _default: {
    create(client: Stripe, params: Stripe.InvoiceCreateParams): Promise<Stripe.Response<Stripe.Invoice>>;
    retrieve(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Invoice>>;
    update(client: Stripe, id: string, params: Stripe.InvoiceUpdateParams): Promise<Stripe.Response<Stripe.Invoice>>;
    del(client: Stripe, id: string): Promise<Stripe.Response<Stripe.DeletedInvoice>>;
    list(client: Stripe, params?: Stripe.InvoiceListParams): Stripe.ApiListPromise<Stripe.Invoice>;
    finalize(client: Stripe, id: string, params?: Stripe.InvoiceFinalizeInvoiceParams): Promise<Stripe.Response<Stripe.Invoice>>;
    pay(client: Stripe, id: string, params?: Stripe.InvoicePayParams): Promise<Stripe.Response<Stripe.Invoice>>;
    sendInvoice(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Invoice>>;
    voidInvoice(client: Stripe, id: string): Promise<Stripe.Response<Stripe.Invoice>>;
    search(client: Stripe, params: Stripe.InvoiceSearchParams): Stripe.ApiSearchResultPromise<Stripe.Invoice>;
};
export default _default;
//# sourceMappingURL=invoices.d.ts.map