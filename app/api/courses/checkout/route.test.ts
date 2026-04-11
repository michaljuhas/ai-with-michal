import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { findOrCreateCustomer, getStripe } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
  findOrCreateCustomer: vi.fn(),
}));

vi.mock("@/lib/posthog-server", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn(),
}));

// Mock courses so we control priceIds in each test
const mockGetCourseBySlug = vi.fn();
vi.mock("@/lib/courses", () => ({
  getCourseBySlug: (slug: string) => mockGetCourseBySlug(slug),
}));

const courseSlug = "first-principles-sourcing";

const baseCourse = {
  slug: courseSlug,
  title: "First Principles in Talent Sourcing",
  published: true,
  priceIds: { basic: "price_test_basic", pro: "price_test_pro" },
  ticketOptions: [
    { id: "basic", name: "Training", price: 490, includes: ["Curriculum"] },
    { id: "pro", name: "Training + Interview Prep", price: 690, includes: ["Everything"] },
  ],
};

function makeReq(body: object, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/courses/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/courses/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: return the base course with real-looking price IDs
    mockGetCourseBySlug.mockImplementation((slug: string) =>
      slug === courseSlug ? baseCourse : undefined
    );
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const { POST } = await import("./route");
    const res = await POST(makeReq({ tier: "basic", courseSlug }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid tier", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    const { POST } = await import("./route");
    const res = await POST(makeReq({ tier: "gold", courseSlug }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid tier" });
  });

  it("returns 400 when courseSlug is missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    const { POST } = await import("./route");
    const res = await POST(makeReq({ tier: "basic" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Missing courseSlug" });
  });

  it("returns 400 for unknown course slug", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    const { POST } = await import("./route");
    const res = await POST(makeReq({ tier: "basic", courseSlug: "nonexistent-course" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid course" });
  });

  it("returns 400 when price ID is not configured", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);
    mockGetCourseBySlug.mockReturnValue({
      ...baseCourse,
      priceIds: { basic: "", pro: "" },
    });

    const { POST } = await import("./route");
    const res = await POST(makeReq({ tier: "basic", courseSlug }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Price not configured" });
  });

  it("creates checkout session with correct metadata for pro tier", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_clerk_1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "buyer@x.com" }],
      firstName: "Buyer",
      lastName: "Name",
    } as never);

    vi.mocked(findOrCreateCustomer).mockResolvedValue("cus_123");

    const sessionsCreate = vi.fn(async () => ({
      id: "cs_course_test",
      url: "https://stripe.test/checkout/cs_course_test",
    }));

    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: sessionsCreate } },
    } as never);

    const { POST } = await import("./route");
    const res = await POST(
      makeReq(
        { tier: "pro", courseSlug, cancelUrl: `/training/${courseSlug}/tickets` },
        { origin: "https://aiwithmichal.com" }
      )
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/checkout/cs_course_test" });

    expect(sessionsCreate).toHaveBeenCalledOnce();
    const arg = sessionsCreate.mock.calls[0][0];
    expect(arg.mode).toBe("payment");
    expect(arg.metadata).toMatchObject({
      product: "course",
      clerk_user_id: "user_clerk_1",
      tier: "pro",
      course_slug: courseSlug,
    });
    expect(arg.metadata.price_id).toMatch(/^price_/);
    expect(arg.success_url).toContain("/thank-you/course");
    expect(arg.success_url).toContain(courseSlug);
    expect(arg.success_url).toContain("tier=pro");

    expect(captureEvent).toHaveBeenCalledWith(
      "user_clerk_1",
      "course_checkout_session_created",
      expect.objectContaining({
        tier: "pro",
        course_slug: courseSlug,
        stripe_session_id: "cs_course_test",
      })
    );
    expect(sendMetaEvent).toHaveBeenCalled();
  });
});
