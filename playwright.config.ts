import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke tests. Start the app first, then run `npm run test:e2e`.
 *
 * - Default: http://127.0.0.1:3000 (e.g. `npm run dev`)
 * - Or: `PLAYWRIGHT_BASE_URL=https://your-preview.example npx playwright test`
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
});
