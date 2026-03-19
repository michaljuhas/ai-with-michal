import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockRefunds = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  cancel: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ refunds: mockRefunds }));

import { createClient } from '../../src/lib/client';
import refunds from '../../src/resources/refunds';

describe('refunds resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates refund for a charge with idempotency key', async () => {
      const params = { charge: 'ch_123', amount: 1000 };
      mockRefunds.create.mockResolvedValue({ id: 're_123', amount: 1000 });
      await refunds.create(client, params);
      expect(mockRefunds.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('creates refund for a payment intent with idempotency key', async () => {
      const params = { payment_intent: 'pi_123' };
      mockRefunds.create.mockResolvedValue({ id: 're_123' });
      await refunds.create(client, params);
      expect(mockRefunds.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockRefunds.create.mockRejectedValue(new Error('create failed'));
      await expect(refunds.create(client, { charge: 'ch_bad' })).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockRefunds.retrieve.mockResolvedValue({ id: 're_123' });
      await refunds.retrieve(client, 're_123');
      expect(mockRefunds.retrieve).toHaveBeenCalledWith('re_123');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { metadata: { reason: 'duplicate' } };
      mockRefunds.update.mockResolvedValue({ id: 're_123' });
      await refunds.update(client, 're_123', params);
      expect(mockRefunds.update).toHaveBeenCalledWith('re_123', params);
      expect(mockRefunds.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('list', () => {
    it('lists refunds for a charge', async () => {
      mockRefunds.list.mockResolvedValue({ data: [], has_more: false });
      await refunds.list(client, { charge: 'ch_123' });
      expect(mockRefunds.list).toHaveBeenCalledWith({ charge: 'ch_123' });
    });

    it('lists without params', async () => {
      mockRefunds.list.mockResolvedValue({ data: [], has_more: false });
      await refunds.list(client);
      expect(mockRefunds.list).toHaveBeenCalledWith(undefined);
    });
  });

  describe('cancel', () => {
    it('cancels with idempotency key', async () => {
      mockRefunds.cancel.mockResolvedValue({ id: 're_123', status: 'canceled' });
      await refunds.cancel(client, 're_123');
      expect(mockRefunds.cancel).toHaveBeenCalledWith(
        're_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockRefunds.cancel.mockRejectedValue(new Error('cancel failed'));
      await expect(refunds.cancel(client, 're_bad')).rejects.toThrow('cancel failed');
    });
  });
});
