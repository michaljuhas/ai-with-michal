import Table from 'cli-table3';

export function formatOutput(data: unknown, format: 'json' | 'table'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  const rows = Array.isArray(data) ? data : [data];

  if (rows.length === 0) {
    return new Table().toString();
  }

  const firstRow = rows[0] as Record<string, unknown>;
  const headers = Object.keys(firstRow);

  const table = new Table({ head: headers });

  for (const row of rows) {
    const r = row as Record<string, unknown>;
    const values = headers.map((h) => {
      const val = r[h];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });
    table.push(values);
  }

  return table.toString();
}
