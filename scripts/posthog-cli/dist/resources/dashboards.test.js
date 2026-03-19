"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const dashboards_1 = require("./dashboards");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('dashboards', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listDashboards calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, dashboards_1.listDashboards)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/dashboards/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('retrieveDashboard calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, dashboards_1.retrieveDashboard)(client, 1);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/dashboards/1/');
    });
    (0, vitest_1.it)('createDashboard sends POST with name', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 2 });
        await (0, dashboards_1.createDashboard)(client, { name: 'Product KPIs' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/dashboards/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
        (0, vitest_1.expect)(opts.body.name).toBe('Product KPIs');
    });
    (0, vitest_1.it)('updateDashboard sends PATCH', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, dashboards_1.updateDashboard)(client, 1, { name: 'New Name' });
        const [, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(opts.method).toBe('PATCH');
    });
    (0, vitest_1.it)('deleteDashboard sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, dashboards_1.deleteDashboard)(client, 3);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/dashboards/3/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=dashboards.test.js.map