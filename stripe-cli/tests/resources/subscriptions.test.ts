import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockSubscriptions = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  cancel: jest.fn(),
  list: jest.fn(),
  resume: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ subscriptions: mockSubscriptions }));

import { createClient } from '../../src/lib/client';
import subscriptions from '../../src/resources/subscriptions';

describe('subscriptions resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates with idempotency key', async () => {
      const params = { customer: 'cus_123', items: [{ price: 'price_abc' }] };
      mockSubscriptions.create.mockResolvedValue({ id: 'sub_123' });
      await subscriptions.create(client, params as any);
      expect(mockSubscriptions.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockSubscriptions.create.mockRejectedValue(new Error('create failed'));
      await expect(subscriptions.create(client, { customer: 'cus_bad', items: [] } as any)).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockSubscriptions.retrieve.mockResolvedValue({ id: 'sub_123' });
      await subscriptions.retrieve(client, 'sub_123');
      expect(mockSubscriptions.retrieve).toHaveBeenCalledWith('sub_123');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { cancel_at_period_end: true };
      mockSubscriptions.update.mockResolvedValue({ id: 'sub_123' });
      await subscriptions.update(client, 'sub_123', params);
      expect(mockSubscriptions.update).toHaveBeenCalledWith('sub_123', params);
      expect(mockSubscriptions.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('cancel', () => {
    it('cancels a subscription', async () => {
      mockSubscriptions.cancel.mockResolvedValue({ id: 'sub_123', status: 'canceled' });
      await subscriptions.cancel(client, 'sub_123');
      expect(mockSubscriptions.cancel).toHaveBeenCalledWith('sub_123');
    });

    it('propagates errors', async () => {
      mockSubscriptions.cancel.mockRejectedValue(new Error('cancel failed'));
      await expect(subscriptions.cancel(client, 'sub_bad')).rejects.toThrow('cancel failed');
    });
  });

  describe('list', () => {
    it('lists with customer filter', async () => {
      mockSubscriptions.list.mockResolvedValue({ data: [], has_more: false });
      await subscriptions.list(client, { customer: 'cus_123' });
      expect(mockSubscriptions.list).toHaveBeenCalledWith({ customer: 'cus_123' });
    });
  });

  describe('resume', () => {
    it('resumes with idempotency key', async () => {
      const params = { billing_cycle_anchor: 'now' as const };
      mockSubscriptions.resume.mockResolvedValue({ id: 'sub_123', status: 'active' });
      await subscriptions.resume(client, 'sub_123', params);
      expect(mockSubscriptions.resume).toHaveBeenCalledWith(
        'sub_123',
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('search', () => {
    it('searches with query', async () => {
      const params = { query: "status:'active'" };
      mockSubscriptions.search.mockResolvedValue({ data: [], has_more: false });
      await subscriptions.search(client, params);
      expect(mockSubscriptions.search).toHaveBeenCalledWith(params);
    });
  });
});
