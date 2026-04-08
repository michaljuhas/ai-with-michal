import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("homepage returns 200", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBe(true);
  });

  test("tickets page returns 200", async ({ page }) => {
    const res = await page.goto("/tickets");
    expect(res?.ok()).toBe(true);
  });

  test("GET /api/count is forbidden without admin session", async ({ request }) => {
    const res = await request.get("/api/count");
    expect(res.status()).toBe(403);
  });
});
