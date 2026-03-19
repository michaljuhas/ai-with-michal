jest.mock('../../src/resources/customers');
jest.mock('../../src/resources/payment-intents');
jest.mock('../../src/lib/config', () => ({
  getApiKey: jest.fn().mockReturnValue('sk_test_fake'),
  isLiveMode: jest.fn().mockReturnValue(false),
  validateApiKey: jest.fn(),
  ConfigError: class ConfigError extends Error {},
}));
jest.mock('stripe');

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({
  customers: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn(), search: jest.fn() },
  paymentIntents: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), list: jest.fn(), confirm: jest.fn(), capture: jest.fn(), cancel: jest.fn(), search: jest.fn() },
}));

import customers from '../../src/resources/customers';
import paymentIntents from '../../src/resources/payment-intents';

const mockCustomers = customers as jest.Mocked<typeof customers>;
const mockPaymentIntents = paymentIntents as jest.Mocked<typeof paymentIntents>;

describe('CLI routing', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('routes customers list to customers.list()', async () => {
    mockCustomers.list = jest.fn().mockResolvedValue({ data: [], has_more: false });
    const { program } = require('../../src/cli');
    await program.parseAsync(['node', 'stripe-cli', 'customers', 'list']);
    expect(mockCustomers.list).toHaveBeenCalled();
  });

  it('routes customers retrieve to customers.retrieve()', async () => {
    mockCustomers.retrieve = jest.fn().mockResolvedValue({ id: 'cus_123' });
    const { program } = require('../../src/cli');
    await program.parseAsync(['node', 'stripe-cli', 'customers', 'retrieve', 'cus_123']);
    expect(mockCustomers.retrieve).toHaveBeenCalledWith(expect.anything(), 'cus_123');
  });

  it('routes payment-intents confirm to paymentIntents.confirm()', async () => {
    mockPaymentIntents.confirm = jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' });
    const { program } = require('../../src/cli');
    await program.parseAsync(['node', 'stripe-cli', 'payment-intents', 'confirm', 'pi_123']);
    expect(mockPaymentIntents.confirm).toHaveBeenCalledWith(expect.anything(), 'pi_123', expect.anything());
  });

  it('passes --format table to formatOutput', async () => {
    mockCustomers.list = jest.fn().mockResolvedValue({ data: [{ id: 'cus_1' }], has_more: false });
    const { program } = require('../../src/cli');
    await program.parseAsync(['node', 'stripe-cli', '--format', 'table', 'customers', 'list']);
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('calls process.exit(1) on error', async () => {
    mockCustomers.retrieve = jest.fn().mockRejectedValue(new Error('not found'));
    const { program } = require('../../src/cli');
    await program.parseAsync(['node', 'stripe-cli', 'customers', 'retrieve', 'cus_bad']);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
