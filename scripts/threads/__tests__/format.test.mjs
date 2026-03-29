import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatOutput, printOutput, printError } from '../format.mjs';

describe('formatOutput', () => {
  it('returns compact single-line JSON when pretty is false', () => {
    const obj = { id: '123', text: 'hello' };
    const result = formatOutput(obj, { pretty: false });
    assert.equal(result, JSON.stringify(obj));
    assert.equal(result.includes('\n'), false);
  });

  it('returns compact JSON by default (no options)', () => {
    const obj = { id: '456', username: 'testuser' };
    assert.equal(formatOutput(obj), JSON.stringify(obj));
  });

  it('returns multi-line indented JSON when pretty is true', () => {
    const obj = { id: '123', text: 'hello' };
    const result = formatOutput(obj, { pretty: true });
    assert.equal(result, JSON.stringify(obj, null, 2));
    assert.equal(result.includes('\n'), true);
    assert.equal(result.includes('  '), true);
  });

  it('handles array of objects in compact mode', () => {
    const arr = [{ id: '1' }, { id: '2' }];
    assert.equal(formatOutput(arr, { pretty: false }), JSON.stringify(arr));
  });

  it('handles array of objects in pretty mode', () => {
    const arr = [{ id: '1', text: 'a' }, { id: '2', text: 'b' }];
    const result = formatOutput(arr, { pretty: true });
    assert.equal(result, JSON.stringify(arr, null, 2));
    assert.equal(result.includes('\n'), true);
  });
});

describe('printError', () => {
  it('formats a ThreadsApiError-like object with code and message', () => {
    const err = { message: 'Rate limit exceeded', code: 32 };
    // Capture stderr
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(output.includes('32'), `expected code in output, got: ${output}`);
    assert.ok(output.includes('Rate limit exceeded'), `expected message in output, got: ${output}`);
  });

  it('formats a plain Error with only a message', () => {
    const err = new Error('Something went wrong');
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(output.includes('Something went wrong'), `expected message in output, got: ${output}`);
  });

  it('appends a quota hint when error code is 32', () => {
    const err = { message: 'Rate limit exceeded', code: 32 };
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(output.includes('publishing-limit'), `expected quota hint in output, got: ${output}`);
  });

  it('appends a quota hint when message contains "rate limit" (case-insensitive)', () => {
    const err = new Error('Application-level rate limit reached');
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(output.includes('publishing-limit'), `expected quota hint in output, got: ${output}`);
  });

  it('appends a quota hint when message contains "quota" (case-insensitive)', () => {
    const err = new Error('Publishing Quota exceeded for this user');
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(output.includes('publishing-limit'), `expected quota hint in output, got: ${output}`);
  });

  it('does not append a quota hint for unrelated errors', () => {
    const err = new Error('Unknown post ID');
    const chunks = [];
    const original = process.stderr.write.bind(process.stderr);
    process.stderr.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printError(err);
    } finally {
      process.stderr.write = original;
    }
    const output = chunks.join('');
    assert.ok(!output.includes('publishing-limit'), `expected no quota hint, got: ${output}`);
  });
});

describe('printOutput', () => {
  it('writes formatOutput result plus newline to stdout', () => {
    const obj = { id: '789' };
    const chunks = [];
    const original = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk) => { chunks.push(chunk); return true; };
    try {
      printOutput(obj, { pretty: false });
    } finally {
      process.stdout.write = original;
    }
    const output = chunks.join('');
    assert.equal(output, JSON.stringify(obj) + '\n');
  });
});
