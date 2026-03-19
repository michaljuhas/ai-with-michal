"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const insights_1 = require("./insights");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('insights', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listInsights calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, insights_1.listInsights)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/insights/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('retrieveInsight calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, insights_1.retrieveInsight)(client, 1);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/insights/1/');
    });
    (0, vitest_1.it)('createInsight sends POST with name', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 10 });
        await (0, insights_1.createInsight)(client, { name: 'DAU' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/insights/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
        (0, vitest_1.expect)(opts.body.name).toBe('DAU');
    });
    (0, vitest_1.it)('updateInsight sends PATCH', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, insights_1.updateInsight)(client, 1, { name: 'Updated' });
        const [, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(opts.method).toBe('PATCH');
    });
    (0, vitest_1.it)('deleteInsight sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, insights_1.deleteInsight)(client, 5);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/insights/5/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=insights.test.js.map