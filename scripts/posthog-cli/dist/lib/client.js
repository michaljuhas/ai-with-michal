"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHogClient = exports.ApiError = void 0;
exports.createClient = createClient;
class ApiError extends Error {
    constructor(status, body) {
        super(`PostHog API error ${status}: ${body}`);
        this.status = status;
        this.body = body;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
class PostHogClient {
    constructor(config) {
        this.config = config;
        this.baseUrl = `${config.host}/api`;
        this.headers = {
            Authorization: `Bearer ${config.personalApiKey}`,
            'Content-Type': 'application/json',
        };
    }
    get projectId() {
        return this.config.projectId;
    }
    async request(path, opts = {}) {
        const { method = 'GET', body, query } = opts;
        let url = `${this.baseUrl}${path}`;
        if (query) {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(query)) {
                if (v !== undefined)
                    params.set(k, String(v));
            }
            const qs = params.toString();
            if (qs)
                url += `?${qs}`;
        }
        const res = await fetch(url, {
            method,
            headers: this.headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        const text = await res.text();
        if (!res.ok)
            throw new ApiError(res.status, text);
        if (!text)
            return undefined;
        return JSON.parse(text);
    }
}
exports.PostHogClient = PostHogClient;
function createClient(config) {
    return new PostHogClient(config);
}
//# sourceMappingURL=client.js.map