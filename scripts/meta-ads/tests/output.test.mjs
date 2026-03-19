import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatOutput, printError } from '../output.mjs';

describe('formatOutput', () => {
  it('returns valid JSON string for a plain object', () => {
    const result = formatOutput({ id: '1', name: 'Test' });
    const parsed = JSON.parse(result);
    assert.deepEqual(parsed, { id: '1', name: 'Test' });
  });

  it('returns JSON array string for an array of objects', () => {
    const result = formatOutput([{ id: '1' }, { id: '2' }]);
    const parsed = JSON.parse(result);
    assert.equal(parsed.length, 2);
  });

  it('returns JSON string when pretty: false', () => {
    const result = formatOutput({ id: '1' }, { pretty: false });
    const parsed = JSON.parse(result);
    assert.deepEqual(parsed, { id: '1' });
  });

  it('returns "(no results)" for empty array with pretty: true', () => {
    const result = formatOutput([], { pretty: true });
    assert.equal(result, '(no results)');
  });

  it('contains id and Alpha for single-item array with pretty: true', () => {
    const result = formatOutput([{ id: '1', name: 'Alpha' }], { pretty: true });
    assert.ok(typeof result === 'string', 'result should be a string');
    assert.ok(result.includes('id'), 'result should contain "id"');
    assert.ok(result.includes('Alpha'), 'result should contain "Alpha"');
  });

  it('contains both Alpha and Beta for two-item array with pretty: true', () => {
    const result = formatOutput(
      [{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }],
      { pretty: true }
    );
    assert.ok(result.includes('Alpha'), 'result should contain "Alpha"');
    assert.ok(result.includes('Beta'), 'result should contain "Beta"');
  });

  it('renders nested objects as JSON strings in pretty mode', () => {
    const result = formatOutput([{ id: '1', nested: { x: 1 } }], { pretty: true });
    assert.ok(typeof result === 'string', 'result should be a string');
    // The nested object must be serialized as JSON, not as "[object Object]"
    assert.ok(!result.includes('[object Object]'), 'nested object must not appear as [object Object]');
    assert.ok(result.includes('{"x":1}'), 'nested object should be rendered as JSON string {"x":1}');
  });
});

describe('printError', () => {
  it('is exported and is a function', () => {
    assert.equal(typeof printError, 'function');
  });
});
