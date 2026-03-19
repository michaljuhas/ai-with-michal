"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutput = formatOutput;
const cli_table3_1 = __importDefault(require("cli-table3"));
function flattenForTable(data) {
    const rows = Array.isArray(data) ? data : (data?.['results'] ?? [data]);
    return rows.map((row) => {
        const r = row;
        const flat = {};
        for (const [k, v] of Object.entries(r)) {
            if (v === null || v === undefined)
                flat[k] = '';
            else if (typeof v === 'object')
                flat[k] = JSON.stringify(v);
            else
                flat[k] = String(v);
        }
        return flat;
    });
}
function formatOutput(data, format = 'json') {
    if (format === 'table') {
        const rows = flattenForTable(data);
        if (rows.length === 0)
            return '(no results)';
        const headers = Object.keys(rows[0]);
        const table = new cli_table3_1.default({ head: headers });
        for (const row of rows)
            table.push(headers.map((h) => row[h] ?? ''));
        return table.toString();
    }
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=output.js.map