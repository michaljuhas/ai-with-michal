import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LemlistApiError } from '../errors.mjs';
import {
  listSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../schedules.mjs';

function makeCapturingClient(response) {
  const calls = [];
  const client = {
    request: async (opts) => {
      calls.push(opts);
      if (response instanceof Error) throw response;
      return response;
    },
  };
  client.calls = calls;
  return client;
}

function makeMockClient(response) {
  return {
    request: async (_opts) => {
      if (response instanceof Error) throw response;
      return response;
    },
  };
}

describe('listSchedules', () => {
  it('calls GET /schedules with default apiVersion', async () => {
    const client = makeCapturingClient([]);
    await listSchedules(client);
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/schedules');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response from client', async () => {
    const data = [{ _id: 'skd_1', name: 'Business Hours EU' }];
    const client = makeMockClient(data);
    const result = await listSchedules(client);
    assert.deepEqual(result, data);
  });

  it('propagates LemlistApiError on failure', async () => {
    const client = makeMockClient(new LemlistApiError('Unauthorized', 401, 'Unauthorized'));
    await assert.rejects(() => listSchedules(client), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 401);
      return true;
    });
  });
});

describe('getSchedule', () => {
  it('calls GET /schedules/:scheduleId with default apiVersion', async () => {
    const client = makeCapturingClient({ _id: 'skd_1' });
    await getSchedule(client, 'skd_1');
    assert.equal(client.calls[0].method, 'GET');
    assert.equal(client.calls[0].path, '/schedules/skd_1');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns schedule data', async () => {
    const data = { _id: 'skd_1', name: 'Business Hours EU', timezone: 'Europe/Paris' };
    const client = makeMockClient(data);
    const result = await getSchedule(client, 'skd_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => getSchedule(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('createSchedule', () => {
  const scheduleData = {
    name: 'Business Hours EU',
    timezone: 'Europe/Paris',
    start: '09:00',
    end: '18:00',
    weekdays: [1, 2, 3, 4, 5],
    secondsToWait: 1200,
    public: false,
  };

  it('calls POST /schedules with body passed through', async () => {
    const client = makeCapturingClient({ _id: 'skd_new' });
    await createSchedule(client, scheduleData);
    assert.equal(client.calls[0].method, 'POST');
    assert.equal(client.calls[0].path, '/schedules');
    assert.deepEqual(client.calls[0].body, scheduleData);
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the created schedule', async () => {
    const data = { _id: 'skd_new', ...scheduleData };
    const client = makeMockClient(data);
    const result = await createSchedule(client, scheduleData);
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 400', async () => {
    const client = makeMockClient(new LemlistApiError('Bad Request', 400, 'Bad Request'));
    await assert.rejects(() => createSchedule(client, {}), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 400);
      return true;
    });
  });
});

describe('updateSchedule', () => {
  it('calls PATCH /schedules/:scheduleId with body passed through', async () => {
    const updates = { name: 'Updated Hours', end: '17:00' };
    const client = makeCapturingClient({ _id: 'skd_1' });
    await updateSchedule(client, 'skd_1', updates);
    assert.equal(client.calls[0].method, 'PATCH');
    assert.equal(client.calls[0].path, '/schedules/skd_1');
    assert.deepEqual(client.calls[0].body, updates);
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the updated schedule', async () => {
    const data = { _id: 'skd_1', name: 'Updated Hours' };
    const client = makeMockClient(data);
    const result = await updateSchedule(client, 'skd_1', { name: 'Updated Hours' });
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => updateSchedule(client, 'bad_id', {}), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});

describe('deleteSchedule', () => {
  it('calls DELETE /schedules/:scheduleId with default apiVersion', async () => {
    const client = makeCapturingClient({ deleted: true });
    await deleteSchedule(client, 'skd_1');
    assert.equal(client.calls[0].method, 'DELETE');
    assert.equal(client.calls[0].path, '/schedules/skd_1');
    assert.equal(client.calls[0].apiVersion, 'default');
  });

  it('returns the response', async () => {
    const data = { deleted: true };
    const client = makeMockClient(data);
    const result = await deleteSchedule(client, 'skd_1');
    assert.deepEqual(result, data);
  });

  it('throws LemlistApiError on 404', async () => {
    const client = makeMockClient(new LemlistApiError('Not Found', 404, 'Not Found'));
    await assert.rejects(() => deleteSchedule(client, 'bad_id'), (err) => {
      assert.ok(err instanceof LemlistApiError);
      assert.equal(err.status, 404);
      return true;
    });
  });
});
