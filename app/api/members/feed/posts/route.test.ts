import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { GET, POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendMemberFeedBroadcast: vi.fn(async () => ({ sent: 2 })),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

vi.mock("@/lib/discussion-posts", () => ({
  fetchClerkUserImageMap: vi.fn(),
}));

import { isAdminUser } from "@/lib/config";
import { fetchClerkUserImageMap } from "@/lib/discussion-posts";
import { sendMemberFeedBroadcast } from "@/lib/email";

describe("GET /api/members/feed/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: "u_test" } as never);
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns posts with replies and author images", async () => {
    const postRow = {
      id: "p1",
      clerk_user_id: "user_a",
      author_email: "a@x.com",
      author_name: "Ann",
      headline: "Hi",
      body: "Body",
      created_at: "t",
      image_url: null as string | null,
    };
    const replyRow = {
      id: "r1",
      post_id: "p1",
      clerk_user_id: "user_b",
      author_email: "b@x.com",
      author_name: null,
      body: "Reply",
      is_admin: false,
      created_at: "t2",
    };

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "member_feed_posts") {
          return {
            select: vi.fn(() => ({
              order: vi.fn(async () => ({
                data: [postRow],
                error: null,
              })),
            })),
          };
        }
        if (table === "member_feed_replies") {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(async () => ({
                  data: [replyRow],
                  error: null,
                })),
              })),
            })),
          };
        }
        return {};
      }),
    } as never);

    vi.mocked(fetchClerkUserImageMap).mockResolvedValue(
      new Map<string, string | null>([
        ["user_a", "https://avatar/a"],
        ["user_b", null],
      ])
    );

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
    expect(body.posts[0].author_image_url).toBe("https://avatar/a");
    expect(body.posts[0].replies).toHaveLength(1);
    expect(body.posts[0].replies[0].author_image_url).toBeNull();
  });
});

describe("POST /api/members/feed/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest(`http://localhost/api/members/feed/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "H", body: "B" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const req = new NextRequest(`http://localhost/api/members/feed/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "H", body: "B" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when headline or body missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);

    const req = new NextRequest(`http://localhost/api/members/feed/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "", body: "B" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 and post on success", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: "Ser",
    } as never);

    const inserted = {
      id: "new1",
      clerk_user_id: "u1",
      headline: "Title",
      body: "Text",
      image_url: null,
    };

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: inserted, error: null })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest(`http://localhost/api/members/feed/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "Title", body: "Text", image_url: "https://img/x.png" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.post).toEqual(inserted);
    expect(json.broadcast).toEqual({});
    expect(sendMemberFeedBroadcast).not.toHaveBeenCalled();
  });

  it("calls sendMemberFeedBroadcast when broadcast true", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
      imageUrl: "https://img.clerk.com/avatar.png",
    } as never);

    const inserted = {
      id: "new2",
      clerk_user_id: "u1",
      headline: "T",
      body: "B",
      image_url: null,
    };

    const regSelect = vi.fn(() => ({
      not: vi.fn(async () => ({
        data: [{ email: "buyer@x.com" }],
        error: null,
      })),
    }));

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "member_feed_posts") {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(async () => ({ data: inserted, error: null })),
              })),
            })),
          };
        }
        if (table === "registrations") {
          return { select: regSelect };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest(`http://localhost/api/members/feed/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "T", body: "B", broadcast: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.broadcast).toEqual({ sent: 2 });
    expect(sendMemberFeedBroadcast).toHaveBeenCalledOnce();
    expect(sendMemberFeedBroadcast).toHaveBeenCalledWith(
      expect.objectContaining({
        authorImageUrl: "https://img.clerk.com/avatar.png",
      })
    );
  });
});
