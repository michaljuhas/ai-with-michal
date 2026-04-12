import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasResourceGrant, createSignedDownloadUrl } from "@/lib/member-resources";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

vi.mock("@/lib/member-resources", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/member-resources")>();
  return {
    ...mod,
    userHasResourceGrant: vi.fn(),
    createSignedDownloadUrl: vi.fn(),
  };
});

const baseFileResource = {
  id: "res1",
  slug: "checklist",
  title: "Checklist",
  tagline: "Subtitle",
  description: null,
  visibility: "public" as const,
  content_kind: "file" as const,
  storage_path: "files/abc.pdf",
  loom_url: null,
  sort_order: 0,
  is_archived: false,
  created_at: "t",
  updated_at: "t",
};

function mockResourceRow(data: unknown | null) {
  vi.mocked(createServiceClient).mockReturnValue({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({ data, error: null })),
        })),
      })),
    })),
  } as never);
}

describe("GET /api/members/resources/[slug]/download", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: "user_clerk_1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);
    vi.mocked(createSignedDownloadUrl).mockResolvedValue("https://signed.example/download");
  });

  async function callGet(slug: string) {
    return GET(new NextRequest(`http://localhost/api/members/resources/${slug}/download`), {
      params: Promise.resolve({ slug }),
    });
  }

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    mockResourceRow(baseFileResource);
    const res = await callGet("checklist");
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown slug", async () => {
    mockResourceRow(null);
    const res = await callGet("nope");
    expect(res.status).toBe(404);
  });

  it("returns 404 for loom content_kind", async () => {
    mockResourceRow({
      ...baseFileResource,
      content_kind: "loom",
      loom_url: "https://www.loom.com/share/x",
      storage_path: null,
    });
    const res = await callGet("checklist");
    expect(res.status).toBe(404);
  });

  it("returns 404 when file row has no storage_path", async () => {
    mockResourceRow({ ...baseFileResource, storage_path: null });
    const res = await callGet("checklist");
    expect(res.status).toBe(404);
  });

  it("redirects with signed URL for public file", async () => {
    mockResourceRow(baseFileResource);
    const res = await callGet("checklist");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://signed.example/download");
    expect(createSignedDownloadUrl).toHaveBeenCalled();
  });

  it("returns 404 for unlisted file without grant", async () => {
    mockResourceRow({ ...baseFileResource, visibility: "unlisted" });
    vi.mocked(userHasResourceGrant).mockResolvedValue(false);
    const res = await callGet("checklist");
    expect(res.status).toBe(404);
  });

  it("redirects for unlisted file when user has grant", async () => {
    mockResourceRow({ ...baseFileResource, visibility: "unlisted" });
    vi.mocked(userHasResourceGrant).mockResolvedValue(true);
    const res = await callGet("checklist");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://signed.example/download");
  });

  it("allows admin to download archived file", async () => {
    vi.mocked(isAdminUser).mockReturnValue(true);
    mockResourceRow({ ...baseFileResource, is_archived: true, visibility: "unlisted" });
    vi.mocked(userHasResourceGrant).mockResolvedValue(false);
    const res = await callGet("checklist");
    expect(res.status).toBe(302);
  });
});
