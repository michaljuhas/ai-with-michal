/**
 * Tests for scripts/todoist/output.mjs
 * Run: node --test scripts/todoist/tests/output.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatOutput, printError } from '../output.mjs';

describe('formatOutput — default (no options)', () => {
  it('returns JSON string by default', () => {
    const data = [{ id: '1', content: 'Buy milk' }];
    const result = formatOutput(data);
    assert.equal(result, JSON.stringify(data, null, 2));
  });

  it('returns JSON string when pretty is explicitly false', () => {
    const data = { id: '1', content: 'Buy milk' };
    const result = formatOutput(data, { pretty: false });
    assert.equal(result, JSON.stringify(data, null, 2));
  });
});

describe('formatOutput — pretty: true', () => {
  it('renders ASCII table with +---+ border separators', () => {
    const data = [{ id: '1', content: 'Buy milk' }];
    const result = formatOutput(data, { pretty: true });
    assert.ok(result.includes('+'), 'should contain + separators');
    assert.ok(result.includes('---'), 'should contain --- in separator');
    const lines = result.split('\n');
    // first and last lines are separator rows
    assert.match(lines[0], /^\+[-+]+\+$/);
    assert.match(lines[lines.length - 1], /^\+[-+]+\+$/);
  });

  it('includes header row between two separator lines', () => {
    const data = [{ id: '1', content: 'Buy milk' }];
    const result = formatOutput(data, { pretty: true });
    const lines = result.split('\n');
    // structure: sep, header, sep, ...data rows, sep
    assert.match(lines[0], /^\+/);
    assert.match(lines[1], /^\|/);
    assert.ok(lines[1].includes('id'));
    assert.ok(lines[1].includes('content'));
    assert.match(lines[2], /^\+/);
  });

  it('renders data row values in table', () => {
    const data = [{ id: '42', content: 'Walk the dog' }];
    const result = formatOutput(data, { pretty: true });
    assert.ok(result.includes('42'));
    assert.ok(result.includes('Walk the dog'));
  });

  it('empty array returns (no results)', () => {
    const result = formatOutput([], { pretty: true });
    assert.equal(result, '(no results)');
  });

  it('nested objects in table cells are serialized as JSON strings', () => {
    const data = [{ id: '1', meta: { priority: 4, labels: ['work'] } }];
    const result = formatOutput(data, { pretty: true });
    assert.ok(result.includes(JSON.stringify({ priority: 4, labels: ['work'] })));
    assert.ok(!result.includes('[object Object]'), 'should not contain [object Object]');
  });

  it('single object (not array) is wrapped in array for table rendering', () => {
    const data = { id: '1', content: 'Single task' };
    const result = formatOutput(data, { pretty: true });
    const lines = result.split('\n');
    // separator + header + separator + 1 data row + separator = 5 lines
    assert.equal(lines.length, 5);
    assert.ok(result.includes('Single task'));
  });
});

describe('printError', () => {
  it('is exported and is a function', () => {
    assert.equal(typeof printError, 'function');
  });

  it('writes to stderr with format: [TODOIST ERROR] code=<err.errorCode> <err.message>', () => {
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      const err = { errorCode: 'NOT_FOUND', message: 'Task not found' };
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    assert.equal(chunks.length, 1);
    assert.equal(chunks[0], '[TODOIST ERROR] code=NOT_FOUND Task not found\n');
  });

  it('works when errorCode is null: [TODOIST ERROR] code=null <err.message>', () => {
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      const err = { errorCode: null, message: 'Unauthorized' };
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    assert.equal(chunks.length, 1);
    assert.equal(chunks[0], '[TODOIST ERROR] code=null Unauthorized\n');
  });
});
