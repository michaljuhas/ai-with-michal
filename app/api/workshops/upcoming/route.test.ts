import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, OPTIONS } from "./route";

describe("/api/workshops/upcoming", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://wrong-deployment.example");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("OPTIONS returns 204 with CORS headers", () => {
    const res = OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("GET returns workshops with expected shape and no priceIds", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const body = (await res.json()) as {
      workshops: Array<Record<string, unknown>>;
    };
    expect(Array.isArray(body.workshops)).toBe(true);
    expect(body.workshops.length).toBeGreaterThan(0);
    expect(JSON.stringify(body)).not.toContain("priceIds");

    const first = body.workshops[0];
    expect(first).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      hostName: "Michal Juhas",
      form: "Online",
      thumbnailUrl: "https://aiwithmichal.com/workshop-og.jpeg",
      date: expect.any(String),
      time: expect.any(String),
      url: expect.stringMatching(/^https:\/\/aiwithmichal\.com\/workshops\//),
    });
  });
});
