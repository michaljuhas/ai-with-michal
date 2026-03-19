"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const events_1 = require("./events");
function makeClient() {
    const client = { projectId: '42', request: vitest_1.vi.fn() };
    return client;
}
(0, vitest_1.describe)('events', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('calls the events endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, events_1.listEvents)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/events/', vitest_1.expect.objectContaining({ query: vitest_1.expect.objectContaining({ limit: 10 }) }));
    });
    (0, vitest_1.it)('passes event filter', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, events_1.listEvents)(client, { event: 'pageview' });
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith(vitest_1.expect.any(String), vitest_1.expect.objectContaining({ query: vitest_1.expect.objectContaining({ event: 'pageview' }) }));
    });
    (0, vitest_1.it)('passes distinct_id filter', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, events_1.listEvents)(client, { distinct_id: 'user-123' });
        const query = vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]?.query;
        (0, vitest_1.expect)(query?.distinct_id).toBe('user-123');
    });
    (0, vitest_1.it)('returns the result from the API', async () => {
        const mockResult = { results: [{ uuid: 'abc', event: 'pageview' }], next: null };
        vitest_1.vi.mocked(client.request).mockResolvedValue(mockResult);
        const result = await (0, events_1.listEvents)(client);
        (0, vitest_1.expect)(result).toEqual(mockResult);
    });
});
//# sourceMappingURL=events.test.js.map