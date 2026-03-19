"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("./client");
const cfg = {
    personalApiKey: 'phx_test',
    projectId: '42',
    host: 'https://us.posthog.com',
};
function mockFetch(status, body) {
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    vitest_1.vi.stubGlobal('fetch', vitest_1.vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        text: () => Promise.resolve(text),
    }));
}
(0, vitest_1.describe)('PostHogClient', () => {
    (0, vitest_1.beforeEach)(() => { vitest_1.vi.restoreAllMocks(); });
    (0, vitest_1.it)('sends GET with Authorization header', async () => {
        mockFetch(200, { results: [] });
        const client = new client_1.PostHogClient(cfg);
        await client.request('/projects/42/events/');
        const fetchArgs = vitest_1.vi.mocked(fetch).mock.calls[0];
        (0, vitest_1.expect)(fetchArgs?.[0]).toContain('/projects/42/events/');
        (0, vitest_1.expect)((fetchArgs?.[1]).headers).toMatchObject({
            Authorization: 'Bearer phx_test',
        });
        (0, vitest_1.expect)((fetchArgs?.[1]).method).toBe('GET');
    });
    (0, vitest_1.it)('sends POST with JSON body', async () => {
        mockFetch(201, { id: 1 });
        const client = new client_1.PostHogClient(cfg);
        await client.request('/projects/42/feature_flags/', {
            method: 'POST',
            body: { name: 'test-flag', key: 'test-flag', filters: {} },
        });
        const init = vitest_1.vi.mocked(fetch).mock.calls[0]?.[1];
        (0, vitest_1.expect)(init.method).toBe('POST');
        (0, vitest_1.expect)(JSON.parse(init.body).name).toBe('test-flag');
    });
    (0, vitest_1.it)('appends query params to URL', async () => {
        mockFetch(200, { results: [] });
        const client = new client_1.PostHogClient(cfg);
        await client.request('/projects/42/events/', { query: { limit: 5, event: 'pageview' } });
        const url = vitest_1.vi.mocked(fetch).mock.calls[0]?.[0];
        (0, vitest_1.expect)(url).toContain('limit=5');
        (0, vitest_1.expect)(url).toContain('event=pageview');
    });
    (0, vitest_1.it)('skips undefined query params', async () => {
        mockFetch(200, { results: [] });
        const client = new client_1.PostHogClient(cfg);
        await client.request('/projects/42/events/', { query: { limit: 5, event: undefined } });
        const url = vitest_1.vi.mocked(fetch).mock.calls[0]?.[0];
        (0, vitest_1.expect)(url).not.toContain('event=');
    });
    (0, vitest_1.it)('throws ApiError on non-ok response', async () => {
        mockFetch(404, 'Not found');
        const client = new client_1.PostHogClient(cfg);
        await (0, vitest_1.expect)(client.request('/projects/42/missing/')).rejects.toThrow(client_1.ApiError);
        await (0, vitest_1.expect)(client.request('/projects/42/missing/')).rejects.toThrow('404');
    });
    (0, vitest_1.it)('returns undefined for empty response body', async () => {
        mockFetch(204, '');
        const client = new client_1.PostHogClient(cfg);
        const result = await client.request('/projects/42/persons/1/');
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)('exposes projectId', () => {
        const client = new client_1.PostHogClient(cfg);
        (0, vitest_1.expect)(client.projectId).toBe('42');
    });
});
//# sourceMappingURL=client.test.js.map