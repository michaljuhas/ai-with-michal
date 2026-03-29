import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pickPaginationFlags, DEFAULT_LIMIT, MAX_LIMIT } from '../pagination.mjs';

describe('pickPaginationFlags', () => {
  it('returns {} when called with empty object (no defaults leak)', () => {
    assert.deepEqual(pickPaginationFlags({}), {});
  });

  it('parses string limit to integer', () => {
    assert.deepEqual(pickPaginationFlags({ limit: '50' }), { limit: 50 });
  });

  it('clamps limit to MAX_LIMIT (100) when value exceeds max', () => {
    assert.deepEqual(pickPaginationFlags({ limit: '200' }), { limit: MAX_LIMIT });
  });

  it('clamps limit to minimum 1 when value is 0 or below', () => {
    // Chosen behavior: clamp to 1 (not default fallback) so caller's intent is honored
    assert.deepEqual(pickPaginationFlags({ limit: '0' }), { limit: 1 });
  });

  it('clamps negative limit to 1', () => {
    assert.deepEqual(pickPaginationFlags({ limit: '-5' }), { limit: 1 });
  });

  it('prefers after over before when both are provided', () => {
    // Documented choice: after wins — forward pagination takes precedence
    const result = pickPaginationFlags({ after: 'abc', before: 'xyz' });
    assert.deepEqual(result, { after: 'abc' });
  });

  it('parses since and until as integers', () => {
    assert.deepEqual(
      pickPaginationFlags({ since: '1712991600', until: '1713000000' }),
      { since: 1712991600, until: 1713000000 }
    );
  });

  it('returns limit and after together', () => {
    assert.deepEqual(
      pickPaginationFlags({ limit: '10', after: 'cursor123' }),
      { limit: 10, after: 'cursor123' }
    );
  });

  it('includes only before when after is absent', () => {
    assert.deepEqual(pickPaginationFlags({ before: 'xyz' }), { before: 'xyz' });
  });

  it('includes only since when until is absent', () => {
    assert.deepEqual(pickPaginationFlags({ since: '1712991600' }), { since: 1712991600 });
  });

  it('exports DEFAULT_LIMIT as 25', () => {
    assert.equal(DEFAULT_LIMIT, 25);
  });

  it('exports MAX_LIMIT as 100', () => {
    assert.equal(MAX_LIMIT, 100);
  });

  it('does not include undefined values in output', () => {
    const result = pickPaginationFlags({ limit: '10' });
    assert.ok(!Object.values(result).some(v => v === undefined));
  });
});
