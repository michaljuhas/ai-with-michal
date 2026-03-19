import { describe, it, expect } from 'vitest';
import { formatOutput } from './output';

describe('formatOutput', () => {
  it('returns pretty JSON by default', () => {
    const result = formatOutput({ id: 1, name: 'test' });
    expect(result).toBe(JSON.stringify({ id: 1, name: 'test' }, null, 2));
  });

  it('returns pretty JSON for json format', () => {
    const result = formatOutput([1, 2], 'json');
    expect(result).toBe('[\n  1,\n  2\n]');
  });

  it('renders table from array', () => {
    const result = formatOutput([{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }], 'table');
    expect(result).toContain('id');
    expect(result).toContain('Alpha');
    expect(result).toContain('Beta');
  });

  it('renders table from results-wrapped object', () => {
    const result = formatOutput({ results: [{ key: 'my-flag', active: true }] }, 'table');
    expect(result).toContain('key');
    expect(result).toContain('my-flag');
  });

  it('returns (no results) for empty array in table mode', () => {
    expect(formatOutput([], 'table')).toBe('(no results)');
  });

  it('serialises nested objects to JSON string in table cells', () => {
    const result = formatOutput([{ id: '1', filters: { groups: [] } }], 'table');
    expect(result).toContain('filters');
    expect(result).toContain('groups');
  });
});
