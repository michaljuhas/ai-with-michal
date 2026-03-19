"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const persons_1 = require("./persons");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('persons', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listPersons calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, persons_1.listPersons)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/persons/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('listPersons passes search param', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, persons_1.listPersons)(client, { search: 'alice' });
        const q = (vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]).query;
        (0, vitest_1.expect)(q.search).toBe('alice');
    });
    (0, vitest_1.it)('listPersons passes distinct_id param', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, persons_1.listPersons)(client, { distinct_id: 'usr_abc' });
        const q = (vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]).query;
        (0, vitest_1.expect)(q.distinct_id).toBe('usr_abc');
    });
    (0, vitest_1.it)('retrievePerson calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 7 });
        await (0, persons_1.retrievePerson)(client, 7);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/persons/7/');
    });
    (0, vitest_1.it)('deletePerson sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, persons_1.deletePerson)(client, 7);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/persons/7/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=persons.test.js.map