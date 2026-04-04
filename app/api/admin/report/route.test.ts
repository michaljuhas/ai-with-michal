import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/config";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

describe("GET /api/admin/report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when user is not admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_normal" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns 403 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const res = await GET();
    expect(res.status).toBe(403);
  });
});
