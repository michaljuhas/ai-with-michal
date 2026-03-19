describe('errors', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('formats a plain Error', () => {
    const { formatError } = require('../../src/lib/errors');
    const result = formatError(new Error('something went wrong'));
    expect(result).toContain('[ERROR]');
    expect(result).toContain('something went wrong');
  });

  it('formats a string error', () => {
    const { formatError } = require('../../src/lib/errors');
    const result = formatError('just a string');
    expect(result).toContain('[ERROR]');
    expect(result).toContain('just a string');
  });

  it('formats a Stripe-like error object', () => {
    const { formatError } = require('../../src/lib/errors');
    const stripeErr = {
      type: 'card_error',
      code: 'card_declined',
      message: 'Your card was declined.',
      param: 'card',
    };
    const result = formatError(stripeErr);
    expect(result).toContain('[ERROR]');
    expect(result).toContain('card_error');
    expect(result).toContain('card_declined');
    expect(result).toContain('Your card was declined.');
  });

  it('formats unknown objects as generic error', () => {
    const { formatError } = require('../../src/lib/errors');
    const result = formatError({ foo: 'bar' });
    expect(result).toContain('[ERROR]');
  });
});
