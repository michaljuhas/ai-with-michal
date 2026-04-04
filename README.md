# AI with Michal

Next.js (App Router) site for workshops, tickets, and members — deployed to **Google Cloud Run**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses `next/font` for optimized web fonts.

Operational scripts, env vars, and deploy helpers are documented in [`AGENTS.md`](AGENTS.md).

## Testing

### How it works

- **Vitest** (Node, no browser): unit and integration-style tests for API routes and `lib/` helpers. Test files are `*.test.ts` next to the code under `app/` and `lib/` (see [`vitest.config.ts`](vitest.config.ts)).
- **Playwright**: a small **E2E smoke** suite in [`e2e/`](e2e/) that drives a real Chromium session against a running app (home, key pages, safe public API checks). Config: [`playwright.config.ts`](playwright.config.ts).

### Running tests on your machine

```bash
# Lint (same as CI)
npm run lint

# Unit / API tests
npm test

# Watch mode while developing
npm run test:watch
```

**E2E (Playwright)**

1. Start the app in one terminal: `npm run dev`
2. First time only, install the browser: `npx playwright install chromium`
3. In another terminal: `npm run test:e2e`  
   Tests default to `http://127.0.0.1:3000`. To hit another environment:  
   `PLAYWRIGHT_BASE_URL=https://your-host.example npm run test:e2e`

### CI and deployment

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every **pull request** and **push to `main`**: `npm ci` → `npm run lint` → `npm test` → `npm run build`, using placeholder public env vars so the build does not need real secrets.
- **Deploy** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) runs on **push to `main`**: builds a Docker image, pushes to Artifact Registry, and deploys the service to **Cloud Run**. That job focuses on build and release; it does not re-run the test suite — rely on **CI passing on the same commit** before merging.
- **Playwright is not run in CI** right now (the suite expects a live server or a chosen `PLAYWRIGHT_BASE_URL`; keeping it local avoids flakiness with how this app is started in automation).

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
