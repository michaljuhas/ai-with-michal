import { ApiError } from './client';
import { ConfigError } from './config';

export function formatError(err: unknown): string {
  if (err instanceof ConfigError) return `[CONFIG ERROR] ${err.message}`;

  if (err instanceof ApiError) {
    let detail = err.body;
    try {
      const parsed = JSON.parse(err.body) as Record<string, unknown>;
      detail = parsed['detail'] as string ?? parsed['error'] as string ?? err.body;
    } catch { /* not JSON */ }
    return `[API ERROR] status=${err.status} ${detail}`;
  }

  if (err instanceof Error) return `[ERROR] ${err.message}`;
  if (typeof err === 'string') return `[ERROR] ${err}`;
  return `[ERROR] ${JSON.stringify(err)}`;
}
