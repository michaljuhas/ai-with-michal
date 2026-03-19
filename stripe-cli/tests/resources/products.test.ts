import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockProducts = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
  list: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ products: mockProducts }));

import { createClient } from '../../src/lib/client';
import products from '../../src/resources/products';

describe('products resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates with idempotency key', async () => {
      const params = { name: 'Pro Plan' };
      mockProducts.create.mockResolvedValue({ id: 'prod_123', name: 'Pro Plan' });
      await products.create(client, params);
      expect(mockProducts.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockProducts.create.mockRejectedValue(new Error('create failed'));
      await expect(products.create(client, { name: 'Bad' })).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockProducts.retrieve.mockResolvedValue({ id: 'prod_123' });
      await products.retrieve(client, 'prod_123');
      expect(mockProducts.retrieve).toHaveBeenCalledWith('prod_123');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { name: 'Pro Plan v2' };
      mockProducts.update.mockResolvedValue({ id: 'prod_123' });
      await products.update(client, 'prod_123', params);
      expect(mockProducts.update).toHaveBeenCalledWith('prod_123', params);
      expect(mockProducts.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('del', () => {
    it('deletes a product', async () => {
      mockProducts.del.mockResolvedValue({ id: 'prod_123', deleted: true });
      await products.del(client, 'prod_123');
      expect(mockProducts.del).toHaveBeenCalledWith('prod_123');
    });

    it('propagates errors', async () => {
      mockProducts.del.mockRejectedValue(new Error('delete failed'));
      await expect(products.del(client, 'prod_bad')).rejects.toThrow('delete failed');
    });
  });

  describe('list', () => {
    it('lists with active filter', async () => {
      mockProducts.list.mockResolvedValue({ data: [], has_more: false });
      await products.list(client, { active: true });
      expect(mockProducts.list).toHaveBeenCalledWith({ active: true });
    });

    it('lists without params', async () => {
      mockProducts.list.mockResolvedValue({ data: [], has_more: false });
      await products.list(client);
      expect(mockProducts.list).toHaveBeenCalledWith(undefined);
    });
  });

  describe('search', () => {
    it('searches with query', async () => {
      const params = { query: "name~'Pro'" };
      mockProducts.search.mockResolvedValue({ data: [], has_more: false });
      await products.search(client, params);
      expect(mockProducts.search).toHaveBeenCalledWith(params);
    });
  });
});
