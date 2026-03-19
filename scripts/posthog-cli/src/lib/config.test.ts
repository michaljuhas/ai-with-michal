import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';

vi.mock('fs');
vi.mock('os', () => ({ homedir: vi.fn(() => '/mock/home') }));

describe('config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.mocked(fs.readFileSync).mockImplementation(() => { throw Object.assign(new Error(), { code: 'ENOENT' }); });
    vi.mocked(fs.existsSync).mockReturnValue(false);
  });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('loads config from env vars', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
    vi.stubEnv('POSTHOG_PROJECT_ID', '42');
    vi.stubEnv('POSTHOG_HOST', 'https://us.posthog.com');
    const { loadConfig } = await import('./config');
    const cfg = loadConfig();
    expect(cfg.personalApiKey).toBe('phx_test');
    expect(cfg.projectId).toBe('42');
    expect(cfg.host).toBe('https://us.posthog.com');
  });

  it('strips trailing slash from host', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
    vi.stubEnv('POSTHOG_PROJECT_ID', '42');
    vi.stubEnv('POSTHOG_HOST', 'https://us.posthog.com/');
    const { loadConfig } = await import('./config');
    expect(loadConfig().host).toBe('https://us.posthog.com');
  });

  it('throws when personalApiKey is missing', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', '');
    vi.stubEnv('POSTHOG_PROJECT_ID', '42');
    const { loadConfig, ConfigError } = await import('./config');
    expect(() => loadConfig()).toThrow(ConfigError);
    expect(() => loadConfig()).toThrow('POSTHOG_PERSONAL_API_KEY');
  });

  it('throws when projectId is missing', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
    vi.stubEnv('POSTHOG_PROJECT_ID', '');
    const { loadConfig, ConfigError } = await import('./config');
    expect(() => loadConfig()).toThrow(ConfigError);
    expect(() => loadConfig()).toThrow('POSTHOG_PROJECT_ID');
  });

  it('falls back to config file values', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', '');
    vi.stubEnv('POSTHOG_PROJECT_ID', '');
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ personalApiKey: 'phx_file', projectId: '99' })
    );
    const { loadConfig } = await import('./config');
    const cfg = loadConfig();
    expect(cfg.personalApiKey).toBe('phx_file');
    expect(cfg.projectId).toBe('99');
  });

  it('uses default host when not set', async () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
    vi.stubEnv('POSTHOG_PROJECT_ID', '42');
    vi.stubEnv('POSTHOG_HOST', '');
    const { loadConfig } = await import('./config');
    expect(loadConfig().host).toBe('https://us.posthog.com');
  });

  it('setConfigValue writes new key to file', async () => {
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    const writeSpy = vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    const { setConfigValue } = await import('./config');
    setConfigValue('personalApiKey', 'phx_new');
    const written = writeSpy.mock.calls[0]?.[1] as string;
    expect(JSON.parse(written).personalApiKey).toBe('phx_new');
  });

  it('setConfigValue merges with existing file', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ projectId: '10' }));
    const writeSpy = vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    const { setConfigValue } = await import('./config');
    setConfigValue('personalApiKey', 'phx_merged');
    const written = writeSpy.mock.calls[0]?.[1] as string;
    const parsed = JSON.parse(written);
    expect(parsed.personalApiKey).toBe('phx_merged');
    expect(parsed.projectId).toBe('10');
  });

  it('getConfigPath is under home dir', async () => {
    const { getConfigPath } = await import('./config');
    expect(getConfigPath()).toContain('.posthog-cli');
    expect(getConfigPath()).toContain('config.json');
  });
});
