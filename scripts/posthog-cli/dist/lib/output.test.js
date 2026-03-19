"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const output_1 = require("./output");
(0, vitest_1.describe)('formatOutput', () => {
    (0, vitest_1.it)('returns pretty JSON by default', () => {
        const result = (0, output_1.formatOutput)({ id: 1, name: 'test' });
        (0, vitest_1.expect)(result).toBe(JSON.stringify({ id: 1, name: 'test' }, null, 2));
    });
    (0, vitest_1.it)('returns pretty JSON for json format', () => {
        const result = (0, output_1.formatOutput)([1, 2], 'json');
        (0, vitest_1.expect)(result).toBe('[\n  1,\n  2\n]');
    });
    (0, vitest_1.it)('renders table from array', () => {
        const result = (0, output_1.formatOutput)([{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }], 'table');
        (0, vitest_1.expect)(result).toContain('id');
        (0, vitest_1.expect)(result).toContain('Alpha');
        (0, vitest_1.expect)(result).toContain('Beta');
    });
    (0, vitest_1.it)('renders table from results-wrapped object', () => {
        const result = (0, output_1.formatOutput)({ results: [{ key: 'my-flag', active: true }] }, 'table');
        (0, vitest_1.expect)(result).toContain('key');
        (0, vitest_1.expect)(result).toContain('my-flag');
    });
    (0, vitest_1.it)('returns (no results) for empty array in table mode', () => {
        (0, vitest_1.expect)((0, output_1.formatOutput)([], 'table')).toBe('(no results)');
    });
    (0, vitest_1.it)('serialises nested objects to JSON string in table cells', () => {
        const result = (0, output_1.formatOutput)([{ id: '1', filters: { groups: [] } }], 'table');
        (0, vitest_1.expect)(result).toContain('filters');
        (0, vitest_1.expect)(result).toContain('groups');
    });
});
//# sourceMappingURL=output.test.js.map