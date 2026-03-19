"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const annotations_1 = require("./annotations");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('annotations', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listAnnotations calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, annotations_1.listAnnotations)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/annotations/', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('createAnnotation sends POST with content', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, annotations_1.createAnnotation)(client, { content: 'Deploy v2.0', date_marker: '2026-03-19T00:00:00Z' });
        const [path, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(path).toBe('/projects/42/annotations/');
        (0, vitest_1.expect)(opts.method).toBe('POST');
        (0, vitest_1.expect)(opts.body.content).toBe('Deploy v2.0');
    });
    (0, vitest_1.it)('updateAnnotation sends PATCH', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1 });
        await (0, annotations_1.updateAnnotation)(client, 1, { content: 'Updated' });
        const [, opts] = vitest_1.vi.mocked(client.request).mock.calls[0];
        (0, vitest_1.expect)(opts.method).toBe('PATCH');
    });
    (0, vitest_1.it)('deleteAnnotation sends DELETE', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue(undefined);
        await (0, annotations_1.deleteAnnotation)(client, 2);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/42/annotations/2/', { method: 'DELETE' });
    });
});
//# sourceMappingURL=annotations.test.js.map