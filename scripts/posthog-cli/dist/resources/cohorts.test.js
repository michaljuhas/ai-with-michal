"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cohorts_1 = require("./cohorts");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('cohorts', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listCohorts calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, cohorts_1.listCohorts)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/cohorts/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('retrieveCohort calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, cohorts_1.retrieveCohort)(client, 1);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/cohorts/1/');
    });
    (0, vitest_1.it)('createCohort sends POST with name', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 5 });
        await (0, cohorts_1.createCohort)(client, { name: 'Power Users' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/cohorts/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
        (0, vitest_1.expect)(opts.body.name).toBe('Power Users');
    });
    (0, vitest_1.it)('updateCohort sends PATCH', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, cohorts_1.updateCohort)(client, 1, { name: 'Updated' });
        const [, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(opts.method).toBe('PATCH');
    });
    (0, vitest_1.it)('deleteCohort sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, cohorts_1.deleteCohort)(client, 9);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/cohorts/9/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=cohorts.test.js.map