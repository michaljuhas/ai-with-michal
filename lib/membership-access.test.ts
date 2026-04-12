import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAnnualMembershipForUser,
  userHasActiveAnnualMembership,
  listClerkUserIdsWithActiveAnnualMembership,
} from "./membership-access";

function mockClient(row: unknown | null, listRows?: { clerk_user_id: string }[]) {
  const maybeSingle = vi.fn(async () => ({ data: row, error: null }));
  const listData = listRows ?? [];
  const listChain = {
    lte: vi.fn(() => ({
      gte: vi.fn(async () => ({ data: listData, error: null })),
    })),
  };

  const rowChain = {
    eq: vi.fn(() => ({ maybeSingle })),
  };

  return {
    from: vi.fn(() => ({
      select: (cols: string) => {
        if (cols === "clerk_user_id") {
          return listChain;
        }
        return rowChain;
      },
    })),
  };
}

describe("membership-access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("userHasActiveAnnualMembership is true when now within window", async () => {
    const now = new Date("2026-03-01T12:00:00.000Z");
    const row = {
      clerk_user_id: "u1",
      stripe_session_id: "cs_1",
      period_starts_at: "2026-01-01T00:00:00.000Z",
      period_ends_at: "2027-01-01T00:00:00.000Z",
      amount_eur: 890,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    await expect(userHasActiveAnnualMembership(mockClient(row) as never, "u1", now)).resolves.toBe(
      true
    );
  });

  it("userHasActiveAnnualMembership is false when ended", async () => {
    const now = new Date("2028-01-01T12:00:00.000Z");
    const row = {
      clerk_user_id: "u1",
      stripe_session_id: "cs_1",
      period_starts_at: "2025-01-01T00:00:00.000Z",
      period_ends_at: "2026-01-01T00:00:00.000Z",
      amount_eur: 890,
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
    };
    await expect(userHasActiveAnnualMembership(mockClient(row) as never, "u1", now)).resolves.toBe(
      false
    );
  });

  it("userHasActiveAnnualMembership is false when no row", async () => {
    await expect(userHasActiveAnnualMembership(mockClient(null) as never, "u1")).resolves.toBe(false);
  });

  it("getAnnualMembershipForUser returns row", async () => {
    const row = {
      clerk_user_id: "u1",
      stripe_session_id: "cs_1",
      period_starts_at: "2026-01-01T00:00:00.000Z",
      period_ends_at: "2027-01-01T00:00:00.000Z",
      amount_eur: 890,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    await expect(getAnnualMembershipForUser(mockClient(row) as never, "u1")).resolves.toEqual(row);
  });

  it("listClerkUserIdsWithActiveAnnualMembership returns ids", async () => {
    await expect(
      listClerkUserIdsWithActiveAnnualMembership(
        mockClient(null, [{ clerk_user_id: "a" }, { clerk_user_id: "b" }]) as never
      )
    ).resolves.toEqual(["a", "b"]);
  });
});
