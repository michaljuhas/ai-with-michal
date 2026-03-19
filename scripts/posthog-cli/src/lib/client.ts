import { PostHogConfig } from './config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string
  ) {
    super(`PostHog API error ${status}: ${body}`);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class PostHogClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(private readonly config: PostHogConfig) {
    this.baseUrl = `${config.host}/api`;
    this.headers = {
      Authorization: `Bearer ${config.personalApiKey}`,
      'Content-Type': 'application/json',
    };
  }

  get projectId(): string {
    return this.config.projectId;
  }

  async request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, query } = opts;
    let url = `${this.baseUrl}${path}`;

    if (query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) params.set(k, String(v));
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const res = await fetch(url, {
      method,
      headers: this.headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    if (!res.ok) throw new ApiError(res.status, text);

    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }
}

export function createClient(config: PostHogConfig): PostHogClient {
  return new PostHogClient(config);
}
