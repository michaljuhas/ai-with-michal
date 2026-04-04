import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { sendWorkgroupBroadcast } from "@/lib/email";
import { GET, POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  clerkClient: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendWorkgroupBroadcast: vi.fn(async () => ({ sent: 2 })),
}));

const workshopSlug = "2026-04-23-sourcing-automation";

describe("GET /api/workgroup/[workshopSlug]/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 for unknown workshop", async () => {
    vi.mocked(createServiceClient).mockReturnValue({} as never);

    const req = new NextRequest(`http://localhost/api/workgroup/bad-slug/posts`);
    const res = await GET(req, { params: Promise.resolve({ workshopSlug: "no-such-workshop" }) });
    expect(res.status).toBe(404);
  });

  it("returns posts with replies and author images", async () => {
    const postRow = {
      id: "p1",
      workshop_slug: workshopSlug,
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
        if (table === "workgroup_posts") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(async () => ({
                  data: [postRow],
                  error: null,
                })),
              })),
            })),
          };
        }
        if (table === "workgroup_replies") {
          return {
            select: vi.fn(() => ({
              order: vi.fn(async () => ({
                data: [replyRow],
                error: null,
              })),
            })),
          };
        }
        return {};
      }),
    } as never);

    vi.mocked(clerkClient).mockResolvedValue({
      users: {
        getUserList: vi.fn(async () => ({
          data: [
            { id: "user_a", imageUrl: "https://avatar/a" },
            { id: "user_b", imageUrl: null },
          ],
        })),
      },
    } as never);

    const req = new NextRequest(`http://localhost/api/workgroup/${workshopSlug}/posts`);
    const res = await GET(req, { params: Promise.resolve({ workshopSlug }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
    expect(body.posts[0].author_image_url).toBe("https://avatar/a");
    expect(body.posts[0].replies).toHaveLength(1);
    expect(body.posts[0].replies[0].author_image_url).toBeNull();
  });
});

describe("POST /api/workgroup/[workshopSlug]/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest(`http://localhost/api/workgroup/${workshopSlug}/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "H", body: "B" }),
    });
    const res = await POST(req, { params: Promise.resolve({ workshopSlug }) });
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown workshop", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);

    const req = new NextRequest(`http://localhost/api/workgroup/bad/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "H", body: "B" }),
    });
    const res = await POST(req, { params: Promise.resolve({ workshopSlug: "bad" }) });
    expect(res.status).toBe(404);
  });

  it("returns 400 when headline or body missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);

    const req = new NextRequest(`http://localhost/api/workgroup/${workshopSlug}/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "", body: "B" }),
    });
    const res = await POST(req, { params: Promise.resolve({ workshopSlug }) });
    expect(res.status).toBe(400);
  });

  it("returns 201 and post on success", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: "Ser",
    } as never);

    const inserted = {
      id: "new1",
      workshop_slug: workshopSlug,
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

    const req = new NextRequest(`http://localhost/api/workgroup/${workshopSlug}/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "Title", body: "Text", image_url: "https://img/x.png" }),
    });
    const res = await POST(req, { params: Promise.resolve({ workshopSlug }) });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.post).toEqual(inserted);
    expect(json.broadcast).toEqual({});
    expect(sendWorkgroupBroadcast).not.toHaveBeenCalled();
  });

  it("calls sendWorkgroupBroadcast when broadcast true", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "u@x.com" },
      firstName: "U",
      lastName: null,
    } as never);

    const inserted = {
      id: "new2",
      workshop_slug: workshopSlug,
      clerk_user_id: "u1",
      headline: "T",
      body: "B",
      image_url: null,
    };

    const ordersSelect = vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(async () => ({
          data: [{ clerk_user_id: "buyer1" }],
          error: null,
        })),
      })),
    }));

    const regSelect = vi.fn(() => ({
      in: vi.fn(async () => ({
        data: [{ clerk_user_id: "buyer1", email: "buyer@x.com" }],
        error: null,
      })),
    }));

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "workgroup_posts") {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(async () => ({ data: inserted, error: null })),
              })),
            })),
          };
        }
        if (table === "orders") {
          return { select: ordersSelect };
        }
        if (table === "registrations") {
          return { select: regSelect };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest(`http://localhost/api/workgroup/${workshopSlug}/posts`, {
      method: "POST",
      body: JSON.stringify({ headline: "T", body: "B", broadcast: true }),
    });
    const res = await POST(req, { params: Promise.resolve({ workshopSlug }) });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.broadcast).toEqual({ sent: 2 });
    expect(sendWorkgroupBroadcast).toHaveBeenCalledOnce();
  });
});
