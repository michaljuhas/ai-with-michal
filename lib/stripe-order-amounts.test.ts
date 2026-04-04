import { describe, expect, it } from "vitest";
import { orderAmountsFromCheckoutSession } from "./stripe-order-amounts";

describe("orderAmountsFromCheckoutSession", () => {
  it("returns gross and net when VAT is present (€129 incl. tax; net cents floored to whole EUR)", () => {
    const session = {
      amount_total: 12900,
      total_details: { amount_tax: 2412 },
    };
    expect(orderAmountsFromCheckoutSession(session)).toEqual({
      amount_eur: 129,
      amount_net_eur: 104,
    });
  });

  it("net equals gross when no tax", () => {
    const session = { amount_total: 7900, total_details: {} };
    expect(orderAmountsFromCheckoutSession(session)).toEqual({
      amount_eur: 79,
      amount_net_eur: 79,
    });
  });

  it("treats missing total_details as no tax", () => {
    const session = { amount_total: 5000 };
    expect(orderAmountsFromCheckoutSession(session)).toEqual({
      amount_eur: 50,
      amount_net_eur: 50,
    });
  });
});
