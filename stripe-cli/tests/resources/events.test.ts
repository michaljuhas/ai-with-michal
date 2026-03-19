jest.mock('stripe');

const mockEvents = {
  retrieve: jest.fn(),
  list: jest.fn(),
};

const MockStripe = require('stripe');
MockStripe.mockImplementation(() => ({ events: mockEvents }));

import { createClient } from '../../src/lib/client';
import events from '../../src/resources/events';

describe('events resource', () => {
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    client = createClient('sk_test_fake');
  });

  it('does NOT have a create method (events are read-only)', () => {
    expect((events as any).create).toBeUndefined();
  });

  it('does NOT have a del method (events are read-only)', () => {
    expect((events as any).del).toBeUndefined();
  });

  it('does NOT have an update method (events are read-only)', () => {
    expect((events as any).update).toBeUndefined();
  });

  describe('retrieve', () => {
    it('retrieves an event by id', async () => {
      mockEvents.retrieve.mockResolvedValue({ id: 'evt_123', type: 'payment_intent.succeeded' });
      await events.retrieve(client, 'evt_123');
      expect(mockEvents.retrieve).toHaveBeenCalledWith('evt_123');
    });

    it('propagates errors', async () => {
      mockEvents.retrieve.mockRejectedValue(new Error('not found'));
      await expect(events.retrieve(client, 'evt_bad')).rejects.toThrow('not found');
    });
  });

  describe('list', () => {
    it('lists events filtered by type', async () => {
      mockEvents.list.mockResolvedValue({ data: [], has_more: false });
      await events.list(client, { type: 'payment_intent.succeeded' });
      expect(mockEvents.list).toHaveBeenCalledWith({ type: 'payment_intent.succeeded' });
    });

    it('lists events filtered by created timestamp', async () => {
      const params = { created: { gte: 1700000000 } };
      mockEvents.list.mockResolvedValue({ data: [], has_more: false });
      await events.list(client, params as any);
      expect(mockEvents.list).toHaveBeenCalledWith(params);
    });

    it('lists without params', async () => {
      mockEvents.list.mockResolvedValue({ data: [], has_more: false });
      await events.list(client);
      expect(mockEvents.list).toHaveBeenCalledWith(undefined);
    });
  });
});
