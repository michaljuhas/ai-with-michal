import { beforeEach, describe, expect, it, vi } from "vitest";
import { userHasPaidCourseOrder } from "./course-access";
import { userHasActiveAnnualMembership, ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG } from "./membership-access";

vi.mock("./membership-access", () => ({
  userHasActiveAnnualMembership: vi.fn(),
  ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG: "first-principles-sourcing",
  getAnnualMembershipForUser: vi.fn(),
  getAnnualMembershipRow: vi.fn(),
  listClerkUserIdsWithActiveAnnualMembership: vi.fn(),
}));

function ordersCourseMock(hasRow: boolean) {
  const chain: { eq: ReturnType<typeof vi.fn>; maybeSingle: ReturnType<typeof vi.fn> } =
    {} as never;
  chain.eq = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(async () => ({ data: hasRow ? { id: "o1" } : null, error: null }));

  return {
    from: vi.fn((table: string) => {
      if (table !== "orders") return {};
      return { select: vi.fn(() => chain) };
    }),
  };
}

describe("course-access + membership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(false);
  });

  it("includes First Principles when annual membership active", async () => {
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(true);
    const supabase = ordersCourseMock(false) as never;
    await expect(
      userHasPaidCourseOrder(supabase, "u1", ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG)
    ).resolves.toBe(true);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("other course slug still requires order", async () => {
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(true);
    const supabase = ordersCourseMock(false) as never;
    await expect(userHasPaidCourseOrder(supabase, "u1", "other-course")).resolves.toBe(false);
  });

  it("paid course order without membership", async () => {
    const supabase = ordersCourseMock(true) as never;
    await expect(
      userHasPaidCourseOrder(supabase, "u1", ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG)
    ).resolves.toBe(true);
  });
});
