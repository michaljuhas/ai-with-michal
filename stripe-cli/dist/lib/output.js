"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutput = formatOutput;
const cli_table3_1 = __importDefault(require("cli-table3"));
function formatOutput(data, format) {
    if (format === 'json') {
        return JSON.stringify(data, null, 2);
    }
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) {
        return new cli_table3_1.default().toString();
    }
    const firstRow = rows[0];
    const headers = Object.keys(firstRow);
    const table = new cli_table3_1.default({ head: headers });
    for (const row of rows) {
        const r = row;
        const values = headers.map((h) => {
            const val = r[h];
            if (val === null || val === undefined)
                return '';
            if (typeof val === 'object')
                return JSON.stringify(val);
            return String(val);
        });
        table.push(values);
    }
    return table.toString();
}
//# sourceMappingURL=output.js.map