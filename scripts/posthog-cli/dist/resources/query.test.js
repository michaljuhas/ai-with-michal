"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const query_1 = require("./query");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('query', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('sends POST to query endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, query_1.runQuery)(client, { query: 'SELECT * FROM events LIMIT 5' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/query/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
    });
    (0, vitest_1.it)('wraps query in HogQLQuery kind', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, query_1.runQuery)(client, { query: 'SELECT count() FROM events' });
        const body = (vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]).body;
        (0, vitest_1.expect)(body.query.kind).toBe('HogQLQuery');
        (0, vitest_1.expect)(body.query.query).toBe('SELECT count() FROM events');
    });
    (0, vitest_1.it)('returns the result from the API', async () => {
        const mockResult = { results: [['pageview', 42]], columns: ['event', 'count'] };
        vitest_1.vi.mocked(client.request).mockResolvedValue(mockResult);
        const result = await (0, query_1.runQuery)(client, { query: 'SELECT event, count() FROM events GROUP BY event' });
        (0, vitest_1.expect)(result).toEqual(mockResult);
    });
});
//# sourceMappingURL=query.test.js.map