import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockPaymentIntents = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  confirm: jest.fn(),
  capture: jest.fn(),
  cancel: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ paymentIntents: mockPaymentIntents }));

import { createClient } from '../../src/lib/client';
import paymentIntents from '../../src/resources/payment-intents';

describe('payment-intents resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates a payment intent with idempotency key', async () => {
      const params = { amount: 2000, currency: 'usd' };
      mockPaymentIntents.create.mockResolvedValue({ id: 'pi_123', ...params });
      await paymentIntents.create(client, params);
      expect(mockPaymentIntents.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockPaymentIntents.create.mockRejectedValue(new Error('stripe error'));
      await expect(paymentIntents.create(client, { amount: 100, currency: 'usd' })).rejects.toThrow('stripe error');
    });
  });

  describe('retrieve', () => {
    it('retrieves a payment intent by id', async () => {
      mockPaymentIntents.retrieve.mockResolvedValue({ id: 'pi_123' });
      await paymentIntents.retrieve(client, 'pi_123');
      expect(mockPaymentIntents.retrieve).toHaveBeenCalledWith('pi_123');
    });

    it('propagates errors', async () => {
      mockPaymentIntents.retrieve.mockRejectedValue(new Error('not found'));
      await expect(paymentIntents.retrieve(client, 'pi_bad')).rejects.toThrow('not found');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { description: 'Updated' };
      mockPaymentIntents.update.mockResolvedValue({ id: 'pi_123' });
      await paymentIntents.update(client, 'pi_123', params);
      expect(mockPaymentIntents.update).toHaveBeenCalledWith('pi_123', params);
      // Verify no idempotency key passed
      const call = mockPaymentIntents.update.mock.calls[0];
      expect(call.length).toBe(2);
    });
  });

  describe('list', () => {
    it('lists with params', async () => {
      mockPaymentIntents.list.mockResolvedValue({ data: [], has_more: false });
      await paymentIntents.list(client, { limit: 5 });
      expect(mockPaymentIntents.list).toHaveBeenCalledWith({ limit: 5 });
    });
  });

  describe('confirm', () => {
    it('confirms with idempotency key', async () => {
      mockPaymentIntents.confirm.mockResolvedValue({ id: 'pi_123', status: 'succeeded' });
      await paymentIntents.confirm(client, 'pi_123');
      expect(mockPaymentIntents.confirm).toHaveBeenCalledWith(
        'pi_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockPaymentIntents.confirm.mockRejectedValue(new Error('confirm failed'));
      await expect(paymentIntents.confirm(client, 'pi_bad')).rejects.toThrow('confirm failed');
    });
  });

  describe('capture', () => {
    it('captures with idempotency key', async () => {
      mockPaymentIntents.capture.mockResolvedValue({ id: 'pi_123' });
      await paymentIntents.capture(client, 'pi_123');
      expect(mockPaymentIntents.capture).toHaveBeenCalledWith(
        'pi_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('cancel', () => {
    it('cancels with idempotency key', async () => {
      mockPaymentIntents.cancel.mockResolvedValue({ id: 'pi_123', status: 'canceled' });
      await paymentIntents.cancel(client, 'pi_123');
      expect(mockPaymentIntents.cancel).toHaveBeenCalledWith(
        'pi_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('search', () => {
    it('searches with query', async () => {
      const params = { query: "status:'succeeded'" };
      mockPaymentIntents.search.mockResolvedValue({ data: [], has_more: false });
      await paymentIntents.search(client, params);
      expect(mockPaymentIntents.search).toHaveBeenCalledWith(params);
    });
  });
});
