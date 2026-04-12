import { beforeEach, describe, expect, it, vi } from "vitest";
import { userHasPaidWorkshopOrder, userHasProWorkshopOrder } from "./workshop-access";
import { userHasActiveAnnualMembership } from "./membership-access";

vi.mock("./membership-access", () => ({
  userHasActiveAnnualMembership: vi.fn(),
  ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG: "first-principles-sourcing",
  getAnnualMembershipForUser: vi.fn(),
  getAnnualMembershipRow: vi.fn(),
  listClerkUserIdsWithActiveAnnualMembership: vi.fn(),
}));

function ordersTableMock(hasRow: boolean) {
  const chain: {
    eq: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
  } = {} as never;
  chain.eq = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(async () => ({ data: hasRow ? { id: "o1" } : null, error: null }));

  return {
    from: vi.fn((table: string) => {
      if (table !== "orders") {
        return {};
      }
      return {
        select: vi.fn(() => chain),
      };
    }),
  };
}

describe("workshop-access + membership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(false);
  });

  it("userHasPaidWorkshopOrder is true when membership active without order", async () => {
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(true);
    const supabase = ordersTableMock(false) as never;
    await expect(userHasPaidWorkshopOrder(supabase, "u1", "any-workshop")).resolves.toBe(true);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("userHasProWorkshopOrder is true when membership active", async () => {
    vi.mocked(userHasActiveAnnualMembership).mockResolvedValue(true);
    const supabase = ordersTableMock(false) as never;
    await expect(userHasProWorkshopOrder(supabase, "u1", "slug")).resolves.toBe(true);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("userHasProWorkshopOrder is false for Basic-only without membership", async () => {
    const supabase = ordersTableMock(false) as never;
    await expect(userHasProWorkshopOrder(supabase, "u1", "slug")).resolves.toBe(false);
  });

  it("userHasProWorkshopOrder is true for Pro order without membership", async () => {
    const supabase = ordersTableMock(true) as never;
    await expect(userHasProWorkshopOrder(supabase, "u1", "slug")).resolves.toBe(true);
  });

  it("userHasPaidWorkshopOrder uses orders when membership inactive", async () => {
    const supabase = ordersTableMock(true) as never;
    await expect(userHasPaidWorkshopOrder(supabase, "u1", "slug")).resolves.toBe(true);
    expect(supabase.from).toHaveBeenCalledWith("orders");
  });
});
