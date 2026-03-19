import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockInvoices = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
  list: jest.fn(),
  finalizeInvoice: jest.fn(),
  pay: jest.fn(),
  sendInvoice: jest.fn(),
  voidInvoice: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ invoices: mockInvoices }));

import { createClient } from '../../src/lib/client';
import invoices from '../../src/resources/invoices';

describe('invoices resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates with idempotency key', async () => {
      const params = { customer: 'cus_123' };
      mockInvoices.create.mockResolvedValue({ id: 'in_123' });
      await invoices.create(client, params);
      expect(mockInvoices.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockInvoices.create.mockRejectedValue(new Error('create failed'));
      await expect(invoices.create(client, { customer: 'cus_bad' })).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockInvoices.retrieve.mockResolvedValue({ id: 'in_123' });
      await invoices.retrieve(client, 'in_123');
      expect(mockInvoices.retrieve).toHaveBeenCalledWith('in_123');
    });
  });

  describe('update', () => {
    it('updates without idempotency key', async () => {
      const params = { description: 'Q1 Invoice' };
      mockInvoices.update.mockResolvedValue({ id: 'in_123' });
      await invoices.update(client, 'in_123', params);
      expect(mockInvoices.update).toHaveBeenCalledWith('in_123', params);
      expect(mockInvoices.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('del', () => {
    it('deletes a draft invoice', async () => {
      mockInvoices.del.mockResolvedValue({ id: 'in_123', deleted: true });
      await invoices.del(client, 'in_123');
      expect(mockInvoices.del).toHaveBeenCalledWith('in_123');
    });
  });

  describe('list', () => {
    it('lists with customer and status filters', async () => {
      mockInvoices.list.mockResolvedValue({ data: [], has_more: false });
      await invoices.list(client, { customer: 'cus_123', status: 'draft' });
      expect(mockInvoices.list).toHaveBeenCalledWith({ customer: 'cus_123', status: 'draft' });
    });
  });

  describe('finalize', () => {
    it('finalizes with idempotency key', async () => {
      mockInvoices.finalizeInvoice.mockResolvedValue({ id: 'in_123', status: 'open' });
      await invoices.finalize(client, 'in_123');
      expect(mockInvoices.finalizeInvoice).toHaveBeenCalledWith(
        'in_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('pay', () => {
    it('pays with idempotency key', async () => {
      mockInvoices.pay.mockResolvedValue({ id: 'in_123', status: 'paid' });
      await invoices.pay(client, 'in_123');
      expect(mockInvoices.pay).toHaveBeenCalledWith(
        'in_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('sendInvoice', () => {
    it('sends with idempotency key', async () => {
      mockInvoices.sendInvoice.mockResolvedValue({ id: 'in_123' });
      await invoices.sendInvoice(client, 'in_123');
      expect(mockInvoices.sendInvoice).toHaveBeenCalledWith(
        'in_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('voidInvoice', () => {
    it('voids with idempotency key', async () => {
      mockInvoices.voidInvoice.mockResolvedValue({ id: 'in_123', status: 'void' });
      await invoices.voidInvoice(client, 'in_123');
      expect(mockInvoices.voidInvoice).toHaveBeenCalledWith(
        'in_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });
  });

  describe('search', () => {
    it('searches with query', async () => {
      const params = { query: "customer:'cus_123'" };
      mockInvoices.search.mockResolvedValue({ data: [], has_more: false });
      await invoices.search(client, params);
      expect(mockInvoices.search).toHaveBeenCalledWith(params);
    });
  });
});
