jest.mock('stripe');

describe('client', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('createClient returns an object without throwing', () => {
    const MockStripe = require('stripe');
    MockStripe.mockImplementation(() => ({
      customers: {},
      paymentIntents: {},
    }));
    const { createClient } = require('../../src/lib/client');
    expect(() => createClient('sk_test_fake')).not.toThrow();
  });

  it('createClient with live option does not throw', () => {
    const MockStripe = require('stripe');
    MockStripe.mockImplementation(() => ({ customers: {} }));
    const { createClient } = require('../../src/lib/client');
    expect(() => createClient('sk_live_fake', { live: true })).not.toThrow();
  });

  it('createClient instantiates Stripe with the provided key', () => {
    const MockStripe = require('stripe');
    MockStripe.mockImplementation(() => ({}));
    const { createClient } = require('../../src/lib/client');
    createClient('sk_test_mykey');
    expect(MockStripe).toHaveBeenCalledWith('sk_test_mykey', expect.any(Object));
  });
});
