import { generateKey } from '../../src/lib/idempotency';

jest.mock('stripe');
jest.mock('../../src/lib/idempotency', () => ({
  generateKey: jest.fn().mockReturnValue('test-idempotency-key'),
}));

const mockWebhookEndpoints = {
  create: jest.fn(),
  retrieve: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
  list: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ webhookEndpoints: mockWebhookEndpoints }));

import { createClient } from '../../src/lib/client';
import webhookEndpoints from '../../src/resources/webhook-endpoints';

describe('webhook-endpoints resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    (generateKey as jest.Mock).mockReturnValue('test-idempotency-key');
    client = createClient('sk_test_fake');
  });

  describe('create', () => {
    it('creates with wildcard events and idempotency key', async () => {
      const params = { url: 'https://example.com/webhook', enabled_events: ['*'] as any };
      mockWebhookEndpoints.create.mockResolvedValue({ id: 'we_123' });
      await webhookEndpoints.create(client, params);
      expect(mockWebhookEndpoints.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('creates with specific events', async () => {
      const params = {
        url: 'https://example.com/webhook',
        enabled_events: ['payment_intent.succeeded', 'payment_intent.payment_failed'] as any,
      };
      mockWebhookEndpoints.create.mockResolvedValue({ id: 'we_123' });
      await webhookEndpoints.create(client, params);
      expect(mockWebhookEndpoints.create).toHaveBeenCalledWith(
        params,
        expect.objectContaining({ idempotencyKey: 'test-idempotency-key' })
      );
    });

    it('propagates errors', async () => {
      mockWebhookEndpoints.create.mockRejectedValue(new Error('create failed'));
      await expect(webhookEndpoints.create(client, { url: 'bad', enabled_events: ['*'] as any })).rejects.toThrow('create failed');
    });
  });

  describe('retrieve', () => {
    it('retrieves by id', async () => {
      mockWebhookEndpoints.retrieve.mockResolvedValue({ id: 'we_123' });
      await webhookEndpoints.retrieve(client, 'we_123');
      expect(mockWebhookEndpoints.retrieve).toHaveBeenCalledWith('we_123');
    });
  });

  describe('update', () => {
    it('updates url and enabled_events without idempotency key', async () => {
      const params = { url: 'https://example.com/new-webhook', enabled_events: ['payment_intent.succeeded'] as any };
      mockWebhookEndpoints.update.mockResolvedValue({ id: 'we_123' });
      await webhookEndpoints.update(client, 'we_123', params);
      expect(mockWebhookEndpoints.update).toHaveBeenCalledWith('we_123', params);
      expect(mockWebhookEndpoints.update.mock.calls[0].length).toBe(2);
    });
  });

  describe('del', () => {
    it('deletes a webhook endpoint', async () => {
      mockWebhookEndpoints.del.mockResolvedValue({ id: 'we_123', deleted: true });
      await webhookEndpoints.del(client, 'we_123');
      expect(mockWebhookEndpoints.del).toHaveBeenCalledWith('we_123');
    });

    it('propagates errors', async () => {
      mockWebhookEndpoints.del.mockRejectedValue(new Error('delete failed'));
      await expect(webhookEndpoints.del(client, 'we_bad')).rejects.toThrow('delete failed');
    });
  });

  describe('list', () => {
    it('lists webhook endpoints', async () => {
      mockWebhookEndpoints.list.mockResolvedValue({ data: [], has_more: false });
      await webhookEndpoints.list(client);
      expect(mockWebhookEndpoints.list).toHaveBeenCalledWith(undefined);
    });
  });
});
