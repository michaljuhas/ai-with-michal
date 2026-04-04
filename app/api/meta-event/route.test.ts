import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { POST } from "./route";

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/meta-event", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when event_name missing", async () => {
    const req = new NextRequest("http://localhost/api/meta-event", {
      method: "POST",
      body: JSON.stringify({ event_source_url: "https://x.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(sendMetaEvent).not.toHaveBeenCalled();
  });

  it("returns 400 when event_source_url missing", async () => {
    const req = new NextRequest("http://localhost/api/meta-event", {
      method: "POST",
      body: JSON.stringify({ event_name: "PageView" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("calls sendMetaEvent and returns ok", async () => {
    const req = new NextRequest("http://localhost/api/meta-event", {
      method: "POST",
      headers: {
        "x-forwarded-for": "203.0.113.1, 10.0.0.1",
        "user-agent": "PlaywrightTest/1",
      },
      body: JSON.stringify({
        event_name: "ViewContent",
        event_source_url: "https://aiwithmichal.com/tickets",
        event_id: "evt_1",
        fbc: "fb.1",
        fbp: "fb.2",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMetaEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: "ViewContent",
        event_source_url: "https://aiwithmichal.com/tickets",
        event_id: "evt_1",
        user_data: expect.objectContaining({
          client_ip_address: "203.0.113.1",
          client_user_agent: "PlaywrightTest/1",
          fbc: "fb.1",
          fbp: "fb.2",
        }),
      })
    );
  });
});
