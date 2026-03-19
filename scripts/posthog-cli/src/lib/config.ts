import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface PostHogConfig {
  personalApiKey: string;
  projectId: string;
  host: string;
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
  try {
    const content = fs.readFileSync(getConfigPath(), 'utf-8');
    return JSON.parse(content) as Record<string, string>;
  } catch {
    return {};
  }
}

export function loadConfig(): PostHogConfig {
  const file = readConfigFile();
  const personalApiKey = process.env['POSTHOG_PERSONAL_API_KEY'] || file['personalApiKey'] || '';
  const projectId = process.env['POSTHOG_PROJECT_ID'] || file['projectId'] || '';
  const host = (process.env['POSTHOG_HOST'] || file['host'] || 'https://us.posthog.com').replace(/\/$/, '');

  if (!personalApiKey) {
    throw new ConfigError(
      'POSTHOG_PERSONAL_API_KEY is required. Set it via env var or run: posthog config set personalApiKey <key>'
    );
  }
  if (!projectId) {
    throw new ConfigError(
      'POSTHOG_PROJECT_ID is required. Set it via env var or run: posthog config set projectId <id>'
    );
  }
  return { personalApiKey, projectId, host };
}

export function setConfigValue(key: string, value: string): void {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  let existing: Record<string, string> = {};
  try {
    existing = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, string>;
  } catch { /* start fresh */ }
  existing[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(existing, null, 2), 'utf-8');
}
