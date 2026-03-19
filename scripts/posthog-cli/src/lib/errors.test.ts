import { describe, it, expect } from 'vitest';
import { formatError } from './errors';
import { ApiError } from './client';
import { ConfigError } from './config';

describe('formatError', () => {
  it('formats ConfigError', () => {
    const result = formatError(new ConfigError('missing key'));
    expect(result).toBe('[CONFIG ERROR] missing key');
  });

  it('formats ApiError with JSON body extracting detail', () => {
    const err = new ApiError(404, JSON.stringify({ detail: 'Not found.' }));
    expect(formatError(err)).toBe('[API ERROR] status=404 Not found.');
  });

  it('formats ApiError with JSON body extracting error field', () => {
    const err = new ApiError(400, JSON.stringify({ error: 'Bad request' }));
    expect(formatError(err)).toBe('[API ERROR] status=400 Bad request');
  });

  it('formats ApiError with non-JSON body', () => {
    const err = new ApiError(500, 'Internal Server Error');
    expect(formatError(err)).toBe('[API ERROR] status=500 Internal Server Error');
  });

  it('formats generic Error', () => {
    expect(formatError(new Error('boom'))).toBe('[ERROR] boom');
  });

  it('formats string error', () => {
    expect(formatError('oops')).toBe('[ERROR] oops');
  });

  it('formats unknown object', () => {
    expect(formatError({ code: 42 })).toBe('[ERROR] {"code":42}');
  });
});
