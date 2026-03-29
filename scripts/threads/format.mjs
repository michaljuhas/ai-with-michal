/**
 * Output formatting helpers for the Threads CLI.
 * Functions return strings for easy testing; print* helpers write to stdio.
 */

export function formatOutput(data, { pretty = false } = {}) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

export function printOutput(data, { pretty = false } = {}) {
  process.stdout.write(formatOutput(data, { pretty }) + '\n');
}

export function printError(err) {
  const code = err.code !== undefined ? `[${err.code}] ` : '';
  process.stderr.write(`Error ${code}${err.message}\n`);

  const isRateLimit =
    err.code === 32 ||
    /rate.?limit|quota/i.test(err.message ?? '');

  if (isRateLimit) {
    process.stderr.write(
      'Hint: Check your publishing quota with: node --env-file=.env scripts/threads/index.mjs profile publishing-limit --pretty\n',
    );
  }
}
