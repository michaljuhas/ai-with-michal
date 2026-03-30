export function formatOutput(data, { pretty = false } = {}) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

export function printOutput(data, { pretty = false } = {}) {
  process.stdout.write(formatOutput(data, { pretty }) + '\n');
}

export function printError(err) {
  const status = err.status ? ` [${err.status}]` : '';
  const code = err.code ? ` (${err.code})` : '';
  process.stderr.write(`Error${status}${code}: ${err.message}\n`);
  if (err.graveyard) {
    process.stderr.write('Note: This lead has been soft-deleted (graveyard).\n');
  }
}
