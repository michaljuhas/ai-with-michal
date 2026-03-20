/**
 * Todoist output formatting helpers
 * Pure ESM, no npm dependencies.
 */

export function formatOutput(data, { pretty = false } = {}) {
  if (!pretty) return JSON.stringify(data, null, 2);

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return '(no results)';

  // Get all column headers from first row
  const headers = Object.keys(rows[0]);

  // Flatten nested values: if value is object, JSON.stringify it
  const cellValue = (v) =>
    v === null || v === undefined
      ? ''
      : typeof v === 'object'
        ? JSON.stringify(v)
        : String(v);

  // Compute column widths: max of header length and all cell lengths
  const widths = headers.map((h) =>
    Math.max(h.length, ...rows.map((r) => cellValue(r[h]).length)),
  );

  // separator line: +---+---+
  const sep = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  const headerRow = '| ' + headers.map((h, i) => h.padEnd(widths[i])).join(' | ') + ' |';
  const dataRows = rows.map(
    (r) => '| ' + headers.map((h, i) => cellValue(r[h]).padEnd(widths[i])).join(' | ') + ' |',
  );

  return [sep, headerRow, sep, ...dataRows, sep].join('\n');
}

export function printError(err) {
  process.stderr.write(`[TODOIST ERROR] code=${err.errorCode} ${err.message}\n`);
}
