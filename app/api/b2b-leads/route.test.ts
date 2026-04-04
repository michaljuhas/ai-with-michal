import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { notifyAdminNewB2BLead } from "@/lib/email";
import { addLeadToCampaign, inboundCampaignId } from "@/lib/lemlist";
import { POST } from "./route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  notifyAdminNewB2BLead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/lemlist", () => ({
  addLeadToCampaign: vi.fn().mockResolvedValue(undefined),
  inboundCampaignId: vi.fn(() => null),
}));

describe("POST /api/b2b-leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when name missing", async () => {
    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        email: "a@b.com",
        interest_type: "workshop",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email invalid", async () => {
    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        name: "ACME",
        email: "not-an-email",
        interest_type: "workshop",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when interest_type invalid", async () => {
    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        name: "ACME",
        email: "a@b.com",
        interest_type: "other",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when insert fails", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: vi.fn(async () => ({ error: { message: "db" } })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        name: "  Corp  ",
        email: "Lead@EXAMPLE.com",
        interest_type: "integration",
        company: " Co ",
        role: " TA ",
        services: ["a", "b"],
        message: " hi ",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(notifyAdminNewB2BLead).not.toHaveBeenCalled();
  });

  it("returns ok true and notifies admin after insert", async () => {
    const insert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ insert })),
    } as never);

    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@company.com",
        interest_type: "workshop",
        tracking: { utm_source: "linkedin", ref: "newsletter" },
        referrer: "https://google.com",
        landing_page: "/ai-workshops-for-teams",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Doe",
        email: "jane@company.com",
        interest_type: "workshop",
        utm_source: "linkedin",
        ref: "newsletter",
      })
    );

    expect(notifyAdminNewB2BLead).toHaveBeenCalledOnce();
    expect(inboundCampaignId).toHaveBeenCalledWith("workshop");
    expect(addLeadToCampaign).not.toHaveBeenCalled();
  });

  it("enqueues Lemlist when campaign id configured", async () => {
    vi.mocked(inboundCampaignId).mockReturnValue("camp_123");

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: vi.fn(async () => ({ error: null })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/b2b-leads", {
      method: "POST",
      body: JSON.stringify({
        name: "First Last",
        email: "fl@x.com",
        interest_type: "workshop",
        company: "Inc",
        role: "Head",
        services: ["Sourcing"],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(addLeadToCampaign).toHaveBeenCalledWith(
      "camp_123",
      expect.objectContaining({
        email: "fl@x.com",
        firstName: "First",
        lastName: "Last",
        companyName: "Inc",
        jobTitle: "Head",
      })
    );
  });
});
