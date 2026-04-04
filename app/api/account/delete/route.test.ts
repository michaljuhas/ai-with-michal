import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { DELETE } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  clerkClient: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

function updateEqChain() {
  return {
    update: vi.fn(() => ({
      eq: vi.fn(async () => ({ error: null })),
    })),
  };
}

describe("DELETE /api/account/delete", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await DELETE();
    expect(res.status).toBe(401);
  });

  it("returns 200 and anonymises rows then deletes Clerk user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_to_delete" } as never);

    const from = vi.fn(() => updateEqChain());
    vi.mocked(createServiceClient).mockReturnValue({ from } as never);

    const deleteUser = vi.fn(async () => {});
    vi.mocked(clerkClient).mockResolvedValue({
      users: { deleteUser },
    } as never);

    const res = await DELETE();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(from).toHaveBeenCalledWith("registrations");
    expect(from).toHaveBeenCalledWith("workgroup_posts");
    expect(from).toHaveBeenCalledWith("workgroup_replies");
    expect(deleteUser).toHaveBeenCalledWith("user_to_delete");
  });

  it("returns 500 when Clerk delete throws", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_x" } as never);
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => updateEqChain()),
    } as never);

    vi.mocked(clerkClient).mockResolvedValue({
      users: {
        deleteUser: vi.fn(async () => {
          throw new Error("clerk down");
        }),
      },
    } as never);

    const res = await DELETE();
    expect(res.status).toBe(500);
  });
});
