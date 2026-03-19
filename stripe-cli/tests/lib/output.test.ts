describe('output', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('formats data as pretty JSON by default', () => {
    const { formatOutput } = require('../../src/lib/output');
    const data = { id: 'cus_123', email: 'a@b.com' };
    const result = formatOutput(data, 'json');
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it('formats array of objects as table', () => {
    const { formatOutput } = require('../../src/lib/output');
    const data = [
      { id: 'cus_1', email: 'a@b.com' },
      { id: 'cus_2', email: 'c@d.com' },
    ];
    const result = formatOutput(data, 'table');
    expect(typeof result).toBe('string');
    expect(result).toContain('id');
    expect(result).toContain('email');
    expect(result).toContain('cus_1');
  });

  it('wraps single object in array for table format', () => {
    const { formatOutput } = require('../../src/lib/output');
    const data = { id: 'cus_1', email: 'a@b.com' };
    const result = formatOutput(data, 'table');
    expect(typeof result).toBe('string');
    expect(result).toContain('cus_1');
  });

  it('handles empty array in table format', () => {
    const { formatOutput } = require('../../src/lib/output');
    const result = formatOutput([], 'table');
    expect(typeof result).toBe('string');
  });

  it('JSON-stringifies nested objects in table cells', () => {
    const { formatOutput } = require('../../src/lib/output');
    const data = [{ id: 'cus_1', metadata: { tier: 'pro' } }];
    const result = formatOutput(data, 'table');
    expect(result).toContain('pro');
  });
});
