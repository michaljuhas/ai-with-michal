"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = formatError;
const client_1 = require("./client");
const config_1 = require("./config");
function formatError(err) {
    if (err instanceof config_1.ConfigError)
        return `[CONFIG ERROR] ${err.message}`;
    if (err instanceof client_1.ApiError) {
        let detail = err.body;
        try {
            const parsed = JSON.parse(err.body);
            detail = parsed['detail'] ?? parsed['error'] ?? err.body;
        }
        catch { /* not JSON */ }
        return `[API ERROR] status=${err.status} ${detail}`;
    }
    if (err instanceof Error)
        return `[ERROR] ${err.message}`;
    if (typeof err === 'string')
        return `[ERROR] ${err}`;
    return `[ERROR] ${JSON.stringify(err)}`;
}
//# sourceMappingURL=errors.js.map