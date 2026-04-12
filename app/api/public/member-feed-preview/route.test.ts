import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceClient } from "@/lib/supabase";
import { ADMIN_USER_IDS } from "@/lib/config";
import { GET } from "./route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

describe("GET /api/public/member-feed-preview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns public DTOs with excerpts and omits body and clerk ids", async () => {
    const longBody = "a".repeat(250);
    const inSpy = vi.fn(() => ({
      order: vi.fn(() => ({
        limit: vi.fn(async () => ({
          data: [
            {
              id: "post-1",
              headline: "Hello",
              body: longBody,
              image_url: "https://example.com/x.png",
              author_name: "Michal Juhas",
              created_at: "2026-01-01T12:00:00Z",
            },
          ],
          error: null,
        })),
      })),
    }));

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          in: inSpy,
        })),
      })),
    } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
    const p = body.posts[0];
    expect(p.id).toBe("post-1");
    expect(p.headline).toBe("Hello");
    expect(p.excerpt.endsWith("…")).toBe(true);
    expect(p.excerpt.length).toBeLessThanOrEqual(201);
    expect(p.body).toBeUndefined();
    expect(p.clerk_user_id).toBeUndefined();
    expect(p.image_url).toBe("https://example.com/x.png");
    expect(p.author_name).toBe("Michal Juhas");

    expect(inSpy).toHaveBeenCalledWith("clerk_user_id", [...ADMIN_USER_IDS]);
  });

  it("returns 500 when Supabase errors", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          in: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(async () => ({ data: null, error: { message: "db" } })),
            })),
          })),
        })),
      })),
    } as never);

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
