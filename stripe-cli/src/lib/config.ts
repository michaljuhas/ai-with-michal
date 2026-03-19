import fs from 'fs';
import os from 'os';
import path from 'path';
import * as toml from '@iarna/toml';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const CONFIG_PATH = path.join(os.homedir(), '.stripe-cli-wrapper', 'config.toml');

export function getApiKey(): string {
  if (process.env.STRIPE_API_KEY) {
    return process.env.STRIPE_API_KEY;
  }

  if (fs.existsSync(CONFIG_PATH)) {
    const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const parsed = toml.parse(content) as { stripe?: { api_key?: string } };
    if (parsed.stripe?.api_key) {
      return parsed.stripe.api_key;
    }
  }

  throw new ConfigError(
    'No Stripe API key found. Set STRIPE_API_KEY env var or add to ~/.stripe-cli-wrapper/config.toml'
  );
}

export function isLiveMode(flag: boolean): boolean {
  return flag;
}

export function validateApiKey(key: string): void {
  if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    throw new ConfigError(
      `Invalid API key format. Key must start with sk_test_ or sk_live_. Got: ${key.substring(0, 10)}...`
    );
  }
}
