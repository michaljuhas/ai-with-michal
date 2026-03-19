"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const errors_1 = require("./errors");
const client_1 = require("./client");
const config_1 = require("./config");
(0, vitest_1.describe)('formatError', () => {
    (0, vitest_1.it)('formats ConfigError', () => {
        const result = (0, errors_1.formatError)(new config_1.ConfigError('missing key'));
        (0, vitest_1.expect)(result).toBe('[CONFIG ERROR] missing key');
    });
    (0, vitest_1.it)('formats ApiError with JSON body extracting detail', () => {
        const err = new client_1.ApiError(404, JSON.stringify({ detail: 'Not found.' }));
        (0, vitest_1.expect)((0, errors_1.formatError)(err)).toBe('[API ERROR] status=404 Not found.');
    });
    (0, vitest_1.it)('formats ApiError with JSON body extracting error field', () => {
        const err = new client_1.ApiError(400, JSON.stringify({ error: 'Bad request' }));
        (0, vitest_1.expect)((0, errors_1.formatError)(err)).toBe('[API ERROR] status=400 Bad request');
    });
    (0, vitest_1.it)('formats ApiError with non-JSON body', () => {
        const err = new client_1.ApiError(500, 'Internal Server Error');
        (0, vitest_1.expect)((0, errors_1.formatError)(err)).toBe('[API ERROR] status=500 Internal Server Error');
    });
    (0, vitest_1.it)('formats generic Error', () => {
        (0, vitest_1.expect)((0, errors_1.formatError)(new Error('boom'))).toBe('[ERROR] boom');
    });
    (0, vitest_1.it)('formats string error', () => {
        (0, vitest_1.expect)((0, errors_1.formatError)('oops')).toBe('[ERROR] oops');
    });
    (0, vitest_1.it)('formats unknown object', () => {
        (0, vitest_1.expect)((0, errors_1.formatError)({ code: 42 })).toBe('[ERROR] {"code":42}');
    });
});
//# sourceMappingURL=errors.test.js.map