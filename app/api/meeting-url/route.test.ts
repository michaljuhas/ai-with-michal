import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("GET /api/meeting-url", () => {
  const prev = process.env.WORKSHOP_MEETING_URL;

  afterEach(() => {
    vi.unstubAllEnvs();
    if (prev === undefined) delete process.env.WORKSHOP_MEETING_URL;
    else process.env.WORKSHOP_MEETING_URL = prev;
  });

  it("returns null url when env unset", async () => {
    delete process.env.WORKSHOP_MEETING_URL;
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: null });
  });

  it("returns env URL when set", async () => {
    vi.stubEnv("WORKSHOP_MEETING_URL", "https://meet.example/ws");
    const res = GET();
    expect(await res.json()).toEqual({ url: "https://meet.example/ws" });
  });
});
