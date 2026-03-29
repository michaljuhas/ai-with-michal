/**
 * Cursor-based pagination helpers for the Threads API.
 * Pure ESM, no npm dependencies.
 *
 * Conflict resolution: when both `after` and `before` are supplied,
 * `after` wins — forward pagination takes precedence over backward.
 *
 * Limit handling: if `limit` is not provided at all, it is omitted from
 * the output so the API applies its own server-side default. If provided
 * but ≤ 0 it is clamped to 1; if above MAX_LIMIT it is clamped to MAX_LIMIT.
 */

export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

/**
 * Build a clean pagination params object from raw CLI/user flags.
 *
 * @param {object} flags
 * @param {string|number} [flags.limit]
 * @param {string}        [flags.after]
 * @param {string}        [flags.before]
 * @param {string|number} [flags.since]
 * @param {string|number} [flags.until]
 * @returns {object} Clean params — only keys with real values, types coerced.
 */
export function pickPaginationFlags(flags = {}) {
  const params = {};

  if (flags.limit !== undefined && flags.limit !== null && flags.limit !== '') {
    const parsed = parseInt(flags.limit, 10);
    const value = Number.isNaN(parsed) ? DEFAULT_LIMIT : parsed;
    params.limit = Math.min(MAX_LIMIT, Math.max(1, value));
  }

  // after wins over before when both are supplied
  if (flags.after) {
    params.after = flags.after;
  } else if (flags.before) {
    params.before = flags.before;
  }

  if (flags.since) {
    const parsed = parseInt(flags.since, 10);
    if (!Number.isNaN(parsed)) params.since = parsed;
  }

  if (flags.until) {
    const parsed = parseInt(flags.until, 10);
    if (!Number.isNaN(parsed)) params.until = parsed;
  }

  return params;
}
