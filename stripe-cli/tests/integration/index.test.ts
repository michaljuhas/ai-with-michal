jest.mock('stripe');
jest.mock('../../src/lib/config', () => ({
  getApiKey: jest.fn().mockReturnValue('sk_test_fake'),
  isLiveMode: jest.fn().mockReturnValue(false),
  validateApiKey: jest.fn(),
  ConfigError: class ConfigError extends Error {},
}));

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({
  customers: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn(), search: jest.fn() },
  paymentIntents: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), list: jest.fn(), confirm: jest.fn(), capture: jest.fn(), cancel: jest.fn(), search: jest.fn() },
  charges: { retrieve: jest.fn(), list: jest.fn(), capture: jest.fn(), search: jest.fn() },
  subscriptions: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), cancel: jest.fn(), list: jest.fn(), resume: jest.fn(), search: jest.fn() },
  products: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn(), search: jest.fn() },
  prices: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), list: jest.fn(), search: jest.fn() },
  invoices: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn(), finalizeInvoice: jest.fn(), pay: jest.fn(), sendInvoice: jest.fn(), voidInvoice: jest.fn(), search: jest.fn() },
  refunds: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), list: jest.fn(), cancel: jest.fn() },
  events: { retrieve: jest.fn(), list: jest.fn() },
  webhookEndpoints: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn() },
}));

import { StripeCLI, customers, paymentIntents, charges, subscriptions, products, prices, invoices, refunds, events, webhookEndpoints, createClient, getApiKey, formatOutput, formatError, generateKey } from '../../src/index';

describe('StripeCLI class', () => {
  let cli: StripeCLI;

  beforeEach(() => {
    jest.clearAllMocks();
    cli = new StripeCLI({ apiKey: 'sk_test_fake' });
  });

  it('constructs without error', () => {
    expect(cli).toBeInstanceOf(StripeCLI);
  });

  it('defaults format to json', () => {
    expect(cli.format).toBe('json');
  });

  it('accepts custom format', () => {
    const tableCli = new StripeCLI({ apiKey: 'sk_test_fake', format: 'table' });
    expect(tableCli.format).toBe('table');
  });

  it('exposes customers with create/retrieve/update/del/list/search', () => {
    expect(typeof cli.customers.create).toBe('function');
    expect(typeof cli.customers.retrieve).toBe('function');
    expect(typeof cli.customers.update).toBe('function');
    expect(typeof cli.customers.del).toBe('function');
    expect(typeof cli.customers.list).toBe('function');
    expect(typeof cli.customers.search).toBe('function');
  });

  it('exposes paymentIntents with all 8 operations', () => {
    expect(typeof cli.paymentIntents.create).toBe('function');
    expect(typeof cli.paymentIntents.retrieve).toBe('function');
    expect(typeof cli.paymentIntents.update).toBe('function');
    expect(typeof cli.paymentIntents.list).toBe('function');
    expect(typeof cli.paymentIntents.confirm).toBe('function');
    expect(typeof cli.paymentIntents.capture).toBe('function');
    expect(typeof cli.paymentIntents.cancel).toBe('function');
    expect(typeof cli.paymentIntents.search).toBe('function');
  });

  it('exposes charges with retrieve/list/capture/search', () => {
    expect(typeof cli.charges.retrieve).toBe('function');
    expect(typeof cli.charges.list).toBe('function');
    expect(typeof cli.charges.capture).toBe('function');
    expect(typeof cli.charges.search).toBe('function');
    expect((cli.charges as any).create).toBeUndefined();
  });

  it('exposes prices with deactivate instead of del', () => {
    expect(typeof cli.prices.deactivate).toBe('function');
    expect((cli.prices as any).del).toBeUndefined();
  });

  it('exposes events with only retrieve and list', () => {
    expect(typeof cli.events.retrieve).toBe('function');
    expect(typeof cli.events.list).toBe('function');
    expect((cli.events as any).create).toBeUndefined();
  });

  it('exposes webhookEndpoints with create/retrieve/update/del/list', () => {
    expect(typeof cli.webhookEndpoints.create).toBe('function');
    expect(typeof cli.webhookEndpoints.del).toBe('function');
  });
});

describe('Named exports', () => {
  it('exports all resource modules', () => {
    expect(customers).toBeDefined();
    expect(paymentIntents).toBeDefined();
    expect(charges).toBeDefined();
    expect(subscriptions).toBeDefined();
    expect(products).toBeDefined();
    expect(prices).toBeDefined();
    expect(invoices).toBeDefined();
    expect(refunds).toBeDefined();
    expect(events).toBeDefined();
    expect(webhookEndpoints).toBeDefined();
  });

  it('exports utility functions', () => {
    expect(typeof createClient).toBe('function');
    expect(typeof getApiKey).toBe('function');
    expect(typeof formatOutput).toBe('function');
    expect(typeof formatError).toBe('function');
    expect(typeof generateKey).toBe('function');
  });
});
