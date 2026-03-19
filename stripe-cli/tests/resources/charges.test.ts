import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockCharges = {
  retrieve: jest.fn(),
  list: jest.fn(),
  capture: jest.fn(),
  search: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ charges: mockCharges }));

import { createClient } from '../../src/lib/client';
import charges from '../../src/resources/charges';

describe('charges resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  it('does NOT have a create method (charges are legacy — use PaymentIntents)', () => {
    expect((charges as any).create).toBeUndefined();
  });

  describe('retrieve', () => {
    it('retrieves a charge by id', async () => {
      mockCharges.retrieve.mockResolvedValue({ id: 'ch_123' });
      await charges.retrieve(client, 'ch_123');
      expect(mockCharges.retrieve).toHaveBeenCalledWith('ch_123');
    });

    it('propagates errors', async () => {
      mockCharges.retrieve.mockRejectedValue(new Error('not found'));
      await expect(charges.retrieve(client, 'ch_bad')).rejects.toThrow('not found');
    });
  });

  describe('list', () => {
    it('lists charges with params', async () => {
      mockCharges.list.mockResolvedValue({ data: [], has_more: false });
      await charges.list(client, { limit: 10 });
      expect(mockCharges.list).toHaveBeenCalledWith({ limit: 10 });
    });

    it('lists charges without params', async () => {
      mockCharges.list.mockResolvedValue({ data: [], has_more: false });
      await charges.list(client);
      expect(mockCharges.list).toHaveBeenCalledWith(undefined);
    });
  });

  describe('capture', () => {
    it('captures a charge with idempotency key', async () => {
      mockCharges.capture.mockResolvedValue({ id: 'ch_123', captured: true });
      await charges.capture(client, 'ch_123');
      expect(mockCharges.capture).toHaveBeenCalledWith(
        'ch_123',
        undefined,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockCharges.capture.mockRejectedValue(new Error('capture failed'));
      await expect(charges.capture(client, 'ch_bad')).rejects.toThrow('capture failed');
    });
  });

  describe('search', () => {
    it('searches charges with query', async () => {
      const params = { query: "amount>1000" };
      mockCharges.search.mockResolvedValue({ data: [], has_more: false });
      await charges.search(client, params);
      expect(mockCharges.search).toHaveBeenCalledWith(params);
    });
  });
});
