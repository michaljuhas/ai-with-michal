import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockPrices = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ prices: mockPrices }));

import { createClient } from '../../src/lib/client';
import prices from '../../src/resources/prices';

describe('prices resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  it('does NOT have a del method (prices cannot be deleted, only deactivated)', () => {
    expect((prices as any).del).toBeUndefined();
  });

  describe('create', () => {
    it('creates with idempotency key', async () => {
      const params = { currency: 'usd', unit_amount: 2999, product: 'prod_123' };
      mockPrices.create.mockResolvedValue({ id: 'price_123' });
      await prices.create(client, params as any);
      expect(mockPrices.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockPrices.create.mockRejectedValue(new Error('create failed'));
      await expect(prices.create(client, { currency: 'usd', unit_amount: 100, product: 'p' } as any)).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockPrices.retrieve.mockResolvedValue({ id: 'price_123' });
      await prices.retrieve(client, 'price_123');
      expect(mockPrices.retrieve).toHaveBeenCalledWith('price_123');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { metadata: { tier: 'pro' } };
      mockPrices.update.mockResolvedValue({ id: 'price_123' });
      await prices.update(client, 'price_123', params);
      expect(mockPrices.update).toHaveBeenCalledWith('price_123', params);
      expect(mockPrices.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('deactivate', () => {
    it('deactivates by setting active: false', async () => {
      mockPrices.update.mockResolvedValue({ id: 'price_123', active: false });
      await prices.deactivate(client, 'price_123');
      expect(mockPrices.update).toHaveBeenCalledWith('price_123', { active: false });
    });
  });

  describe('list', () => {
    it('lists with product and active filters', async () => {
      mockPrices.list.mockResolvedValue({ data: [], has_more: false });
      await prices.list(client, { product: 'prod_123', active: true });
      expect(mockPrices.list).toHaveBeenCalledWith({ product: 'prod_123', active: true });
    });
  });

  describe('search', () => {
    it('searches with query', async () => {
      const params = { query: "product:'prod_123'" };
      mockPrices.search.mockResolvedValue({ data: [], has_more: false });
      await prices.search(client, params);
      expect(mockPrices.search).toHaveBeenCalledWith(params);
    });
  });
});
