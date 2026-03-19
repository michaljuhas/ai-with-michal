import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface PostHogConfig {
  personalApiKey: string;
  projectApiKey: string;
  projectId: string;
  host: string;          // management host, no trailing slash
  ingestionHost: string; // derived: us.posthog.com → us.i.posthog.com
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function getConfigPath(): string {
  return path.join(os.homedir(), '.posthog-cli', 'config.json');
}

function readConfigFile(): Record<string, string> {
  const configPath = getConfigPath();
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as Record<string, string>;
  } catch {
    return {};
  }
}

function deriveIngestionHost(host: string): string {
  // https://us.posthog.com → https://us.i.posthog.com
  // https://eu.posthog.com → https://eu.i.posthog.com
  // For self-hosted: insert .i before the TLD — best effort
  try {
    const url = new URL(host);
    const parts = url.hostname.split('.');
    if (parts.length >= 2) {
      // Insert 'i' as second segment: us.posthog.com → us.i.posthog.com
      parts.splice(1, 0, 'i');
      url.hostname = parts.join('.');
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return host;
  }
}

export function loadConfig(): PostHogConfig {
  const fileConfig = readConfigFile();

  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY ?? fileConfig['personalApiKey'] ?? '';
  const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY ?? fileConfig['projectApiKey'] ?? '';
  const projectId = process.env.POSTHOG_PROJECT_ID ?? fileConfig['projectId'] ?? '';
  const host = (process.env.POSTHOG_HOST ?? fileConfig['host'] ?? 'https://us.posthog.com').replace(/\/$/, '');

  if (!personalApiKey) {
    throw new ConfigError('POSTHOG_PERSONAL_API_KEY is required. Set it as an environment variable or run: posthog config set personalApiKey <key>');
  }
  if (!projectId) {
    throw new ConfigError('POSTHOG_PROJECT_ID is required. Set it as an environment variable or run: posthog config set projectId <id>');
  }

  return {
    personalApiKey,
    projectApiKey,
    projectId,
    host,
    ingestionHost: deriveIngestionHost(host),
  };
}

export function setConfigValue(key: string, value: string): void {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let existing: Record<string, string> = {};
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    existing = JSON.parse(content) as Record<string, string>;
  } catch {
    // file doesn't exist or is invalid — start fresh
  }

  existing[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(existing, null, 2), 'utf-8');
}
