import { describe, expect, it } from "vitest";
import { computeMembershipWindow } from "./membership-period";

describe("computeMembershipWindow", () => {
  it("first purchase: one year from payment", () => {
    const paymentTime = new Date("2026-06-15T12:00:00.000Z");
    const { period_starts_at, period_ends_at } = computeMembershipWindow({
      paymentTime,
      previous: null,
    });
    expect(period_starts_at.toISOString()).toBe("2026-06-15T12:00:00.000Z");
    expect(period_ends_at.toISOString()).toBe("2027-06-15T12:00:00.000Z");
  });

  it("renewal while active: extends previous end by one year, keeps original start", () => {
    const paymentTime = new Date("2026-11-01T10:00:00.000Z");
    const { period_starts_at, period_ends_at } = computeMembershipWindow({
      paymentTime,
      previous: {
        period_starts_at: "2025-06-01T00:00:00.000Z",
        period_ends_at: "2027-06-01T00:00:00.000Z",
      },
    });
    expect(period_starts_at.toISOString()).toBe("2025-06-01T00:00:00.000Z");
    expect(period_ends_at.toISOString()).toBe("2028-06-01T00:00:00.000Z");
  });

  it("renewal after lapse: fresh window from payment", () => {
    const paymentTime = new Date("2028-01-10T08:00:00.000Z");
    const { period_starts_at, period_ends_at } = computeMembershipWindow({
      paymentTime,
      previous: {
        period_starts_at: "2025-01-01T00:00:00.000Z",
        period_ends_at: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(period_starts_at.toISOString()).toBe("2028-01-10T08:00:00.000Z");
    expect(period_ends_at.toISOString()).toBe("2029-01-10T08:00:00.000Z");
  });
});
