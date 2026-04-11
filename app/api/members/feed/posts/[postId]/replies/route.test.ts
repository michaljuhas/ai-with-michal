import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

describe("POST /api/members/feed/posts/[postId]/replies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest("http://localhost/api/members/feed/posts/p1/replies", {
      method: "POST",
      body: JSON.stringify({ body: "reply" }),
    });
    const res = await POST(req, { params: Promise.resolve({ postId: "p1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 400 when reply body empty", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const req = new NextRequest("http://localhost/api/members/feed/posts/p1/replies", {
      method: "POST",
      body: JSON.stringify({ body: "  " }),
    });
    const res = await POST(req, { params: Promise.resolve({ postId: "p1" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when post missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(async () => ({ data: null, error: { code: "PGRST116" } })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/members/feed/posts/missing/replies", {
      method: "POST",
      body: JSON.stringify({ body: "ok" }),
    });
    const res = await POST(req, { params: Promise.resolve({ postId: "missing" }) });
    expect(res.status).toBe(404);
  });

  it("returns 201 and sets is_admin from isAdminUser", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin-id" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "admin@x.com" },
      firstName: "Admin",
      lastName: "User",
    } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    const replyRow = {
      id: "r99",
      post_id: "p1",
      clerk_user_id: "admin-id",
      body: "Thanks",
      is_admin: true,
    };

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "member_feed_posts") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(async () => ({ data: { id: "p1" }, error: null })),
              })),
            })),
          };
        }
        if (table === "member_feed_replies") {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(async () => ({ data: replyRow, error: null })),
              })),
            })),
          };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest("http://localhost/api/members/feed/posts/p1/replies", {
      method: "POST",
      body: JSON.stringify({ body: "Thanks" }),
    });
    const res = await POST(req, { params: Promise.resolve({ postId: "p1" }) });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.reply.is_admin).toBe(true);
  });
});
