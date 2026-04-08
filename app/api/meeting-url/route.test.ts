import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/workshops", () => ({
  getWorkshopBySlug: vi.fn((slug: string) =>
    slug === "2026-test-ws" ? { slug, title: "Test" } : null
  ),
}));

vi.mock("@/lib/workshop-access", () => ({
  userHasPaidWorkshopOrder: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

import { isAdminUser } from "@/lib/config";
import { userHasPaidWorkshopOrder } from "@/lib/workshop-access";

describe("GET /api/meeting-url", () => {
  const prevUrl = process.env.WORKSHOP_MEETING_URL;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (prevUrl === undefined) delete process.env.WORKSHOP_MEETING_URL;
    else process.env.WORKSHOP_MEETING_URL = prevUrl;
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const req = new NextRequest(
      "http://localhost/api/meeting-url?workshopSlug=2026-test-ws"
    );
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when workshopSlug missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    const req = new NextRequest("http://localhost/api/meeting-url");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown workshop", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);
    const req = new NextRequest(
      "http://localhost/api/meeting-url?workshopSlug=invalid-slug"
    );
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns 403 when not paid and not admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);
    vi.mocked(userHasPaidWorkshopOrder).mockResolvedValue(false);
    vi.mocked(createServiceClient).mockReturnValue({} as never);

    const req = new NextRequest(
      "http://localhost/api/meeting-url?workshopSlug=2026-test-ws"
    );
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns env URL when paid", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);
    vi.mocked(userHasPaidWorkshopOrder).mockResolvedValue(true);
    vi.mocked(createServiceClient).mockReturnValue({} as never);
    process.env.WORKSHOP_MEETING_URL = "https://meet.example/ws";

    const req = new NextRequest(
      "http://localhost/api/meeting-url?workshopSlug=2026-test-ws"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://meet.example/ws" });
  });

  it("returns null url when env unset and admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);
    delete process.env.WORKSHOP_MEETING_URL;

    const req = new NextRequest(
      "http://localhost/api/meeting-url?workshopSlug=2026-test-ws"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: null });
  });
});
