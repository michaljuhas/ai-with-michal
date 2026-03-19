import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockCustomers = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
  list: jest.fn(),
  search: jest.fn(),
};

const mockStripeInstance = { customers: mockCustomers };

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => mockStripeInstance);

import { createClient } from '../../src/lib/client';
import customers from '../../src/resources/customers';

describe('customers resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates a customer with idempotency key', async () => {
      const params = { email: 'test@example.com', name: 'Test User' };
      mockCustomers.create.mockResolvedValue({ id: 'cus_123', ...params });

      await customers.create(client, params);

      expect(mockCustomers.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors from stripe', async () => {
      mockCustomers.create.mockRejectedValue(new Error('stripe error'));
      await expect(customers.create(client, { email: 'a@b.com' })).rejects.toThrow('stripe error');
    });
  });

  describe('retrieve', () => {
    it('retrieves a customer by id', async () => {
      mockCustomers.retrieve.mockResolvedValue({ id: 'cus_123' });
      await customers.retrieve(client, 'cus_123');
      expect(mockCustomers.retrieve).toHaveBeenCalledWith('cus_123');
    });

    it('propagates errors from stripe', async () => {
      mockCustomers.retrieve.mockRejectedValue(new Error('not found'));
      await expect(customers.retrieve(client, 'cus_bad')).rejects.toThrow('not found');
    });
  });

  describe('update', () => {
    it('updates a customer', async () => {
      const params = { name: 'Updated Name' };
      mockCustomers.update.mockResolvedValue({ id: 'cus_123', ...params });
      await customers.update(client, 'cus_123', params);
      expect(mockCustomers.update).toHaveBeenCalledWith('cus_123', params);
    });

    it('propagates errors from stripe', async () => {
      mockCustomers.update.mockRejectedValue(new Error('update failed'));
      await expect(customers.update(client, 'cus_bad', {})).rejects.toThrow('update failed');
    });
  });

  describe('del', () => {
    it('deletes a customer', async () => {
      mockCustomers.del.mockResolvedValue({ id: 'cus_123', deleted: true });
      await customers.del(client, 'cus_123');
      expect(mockCustomers.del).toHaveBeenCalledWith('cus_123');
    });

    it('propagates errors from stripe', async () => {
      mockCustomers.del.mockRejectedValue(new Error('delete failed'));
      await expect(customers.del(client, 'cus_bad')).rejects.toThrow('delete failed');
    });
  });

  describe('list', () => {
    it('lists customers with params', async () => {
      const params = { limit: 10, starting_after: 'cus_prev' };
      mockCustomers.list.mockResolvedValue({ data: [], has_more: false });
      await customers.list(client, params);
      expect(mockCustomers.list).toHaveBeenCalledWith(params);
    });

    it('lists customers without params', async () => {
      mockCustomers.list.mockResolvedValue({ data: [], has_more: false });
      await customers.list(client);
      expect(mockCustomers.list).toHaveBeenCalledWith(undefined);
    });
  });

  describe('search', () => {
    it('searches customers with query', async () => {
      const params = { query: "email:'test@example.com'" };
      mockCustomers.search.mockResolvedValue({ data: [], has_more: false });
      await customers.search(client, params);
      expect(mockCustomers.search).toHaveBeenCalledWith(params);
    });
  });
});
