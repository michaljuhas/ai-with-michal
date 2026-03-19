describe('idempotency', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('generateKey returns a UUID v4 string', () => {
    const { generateKey } = require('../../src/lib/idempotency');
    const key = generateKey();
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(key).toMatch(uuidV4Regex);
  });

  it('generateKey returns different values on sequential calls', () => {
    const { generateKey } = require('../../src/lib/idempotency');
    const key1 = generateKey();
    const key2 = generateKey();
    expect(key1).not.toBe(key2);
  });

  it('generateKey returns a string of length 36', () => {
    const { generateKey } = require('../../src/lib/idempotency');
    expect(generateKey()).toHaveLength(36);
  });
});
