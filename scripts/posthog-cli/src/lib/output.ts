import Table from 'cli-table3';

export type OutputFormat = 'json' | 'table';

function flattenForTable(data: unknown): Array<Record<string, string>> {
  const rows = Array.isArray(data) ? data : ((data as Record<string, unknown>)?.['results'] ?? [data]);
  return (rows as unknown[]).map((row) => {
    const r = row as Record<string, unknown>;
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      if (v === null || v === undefined) flat[k] = '';
      else if (typeof v === 'object') flat[k] = JSON.stringify(v);
      else flat[k] = String(v);
    }
    return flat;
  });
}

export function formatOutput(data: unknown, format: OutputFormat = 'json'): string {
  if (format === 'table') {
    const rows = flattenForTable(data);
    if (rows.length === 0) return '(no results)';
    const headers = Object.keys(rows[0]!);
    const table = new Table({ head: headers });
    for (const row of rows) table.push(headers.map((h) => row[h] ?? ''));
    return table.toString();
  }
  return JSON.stringify(data, null, 2);
}
