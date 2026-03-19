"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const feature_flags_1 = require("./feature-flags");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('feature-flags', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listFlags calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, feature_flags_1.listFlags)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('listFlags passes search param', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, feature_flags_1.listFlags)(client, { search: 'beta' });
        const q = (vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]).query;
        (0, vitest_1.expect)(q.search).toBe('beta');
    });
    (0, vitest_1.it)('retrieveFlag calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, feature_flags_1.retrieveFlag)(client, 1);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/1/');
    });
    (0, vitest_1.it)('createFlag sends POST with name and key', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 5 });
        await (0, feature_flags_1.createFlag)(client, { name: 'My Flag', key: 'my-flag' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/feature_flags/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
        (0, vitest_1.expect)(opts.body.name).toBe('My Flag');
        (0, vitest_1.expect)(opts.body.key).toBe('my-flag');
    });
    (0, vitest_1.it)('createFlag sets rollout_percentage in filters.groups', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 5 });
        await (0, feature_flags_1.createFlag)(client, { name: 'F', key: 'f', rollout_percentage: 50 });
        const body = (vitest_1.vi.mocked(client.request).mock.calls[0]?.[1]).body;
        const groups = body['filters'].groups;
        (0, vitest_1.expect)(groups[0]?.rollout_percentage).toBe(50);
    });
    (0, vitest_1.it)('updateFlag sends PATCH', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, feature_flags_1.updateFlag)(client, 1, { active: false });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/feature_flags/1/');
        (0, vitest_1.expect)(opts.method).toBe('PATCH');
    });
    (0, vitest_1.it)('deleteFlag sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, feature_flags_1.deleteFlag)(client, 3);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/feature_flags/3/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=feature-flags.test.js.map