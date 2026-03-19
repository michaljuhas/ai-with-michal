import path from 'path';
import os from 'os';

// Mock fs before importing config
jest.mock('fs');
jest.mock('@iarna/toml');

import fs from 'fs';
import * as toml from '@iarna/toml';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.STRIPE_API_KEY;
    jest.resetAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  describe('getApiKey', () => {
    it('returns STRIPE_API_KEY env var when set', () => {
      process.env.STRIPE_API_KEY = 'sk_test_env123';
      const { getApiKey } = require('../../src/lib/config');
      expect(getApiKey()).toBe('sk_test_env123');
    });

    it('reads from config file when env var not set', () => {
      const freshFs = require('fs') as typeof import('fs');
      const freshToml = require('@iarna/toml') as typeof import('@iarna/toml');
      (freshFs.readFileSync as jest.Mock).mockReturnValue('[stripe]\napi_key = "sk_test_file123"');
      (freshToml.parse as unknown as jest.Mock).mockReturnValue({ stripe: { api_key: 'sk_test_file123' } });
      (freshFs.existsSync as jest.Mock).mockReturnValue(true);

      const { getApiKey } = require('../../src/lib/config');
      expect(getApiKey()).toBe('sk_test_file123');
    });

    it('throws ConfigError when neither source has a key', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const { getApiKey, ConfigError } = require('../../src/lib/config');
      expect(() => getApiKey()).toThrow(ConfigError);
    });
  });

  describe('isLiveMode', () => {
    it('returns true when flag is true', () => {
      const { isLiveMode } = require('../../src/lib/config');
      expect(isLiveMode(true)).toBe(true);
    });

    it('returns false when flag is false', () => {
      const { isLiveMode } = require('../../src/lib/config');
      expect(isLiveMode(false)).toBe(false);
    });
  });

  describe('validateApiKey', () => {
    it('does not throw for valid test key', () => {
      const { validateApiKey } = require('../../src/lib/config');
      expect(() => validateApiKey('sk_test_abc123')).not.toThrow();
    });

    it('does not throw for valid live key', () => {
      const { validateApiKey } = require('../../src/lib/config');
      expect(() => validateApiKey('sk_live_abc123')).not.toThrow();
    });

    it('throws for invalid key format', () => {
      const { validateApiKey } = require('../../src/lib/config');
      expect(() => validateApiKey('invalid_key')).toThrow();
    });
  });
});
