"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const projects_1 = require("./projects");
function makeClient() {
    return { projectId: '42', request: vitest_1.vi.fn() };
}
(0, vitest_1.describe)('projects', () => {
    let client;
    (0, vitest_1.beforeEach)(() => { client = makeClient(); });
    (0, vitest_1.it)('listProjects calls /projects/ endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ results: [] });
        await (0, projects_1.listProjects)(client);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/');
    });
    (0, vitest_1.it)('retrieveProject calls correct endpoint', async () => {
        vitest_1.vi.mocked(client.request).mockResolvedValue({ id: 1, name: 'My Project' });
        await (0, projects_1.retrieveProject)(client, 1);
        (0, vitest_1.expect)(client.request).toHaveBeenCalledWith('/projects/1/');
    });
});
//# sourceMappingURL=projects.test.js.map