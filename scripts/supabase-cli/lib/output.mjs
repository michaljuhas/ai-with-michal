/**
 * Supabase CLI output formatting helpers
 */

export function formatOutput(data, { pretty = false } = {}) {
  if (!pretty) return JSON.stringify(data, null, 2);
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return '(no results)';
  const headers = Object.keys(rows[0]);
  const cellValue = (v) =>
    v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  const widths = headers.map((h) =>
    Math.max(h.length, ...rows.map((r) => cellValue(r[h]).length))
  );
  const sep = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  const headerRow = '| ' + headers.map((h, i) => h.padEnd(widths[i])).join(' | ') + ' |';
  const dataRows = rows.map(
    (r) => '| ' + headers.map((h, i) => cellValue(r[h]).padEnd(widths[i])).join(' | ') + ' |'
  );
  return [sep, headerRow, sep, ...dataRows, sep].join('\n');
}

export function printError(err) {
  process.stderr.write(`[SUPABASE ERROR] ${err.message}\n`);
}
