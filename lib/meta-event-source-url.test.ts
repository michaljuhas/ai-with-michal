import { describe, expect, it } from "vitest";
import {
  metaLeadEventSourceUrl,
  metaPurchaseEventSourceUrl,
  parseWorkshopSlugFromInterestedProduct,
} from "./meta-event-source-url";

describe("parseWorkshopSlugFromInterestedProduct", () => {
  it("returns slug for workshop: prefix", () => {
    expect(parseWorkshopSlugFromInterestedProduct("workshop:2026-04-16-ai-in-recruiting")).toBe(
      "2026-04-16-ai-in-recruiting"
    );
  });

  it("returns null for mentoring or empty", () => {
    expect(parseWorkshopSlugFromInterestedProduct("mentoring:x")).toBeNull();
    expect(parseWorkshopSlugFromInterestedProduct(null)).toBeNull();
    expect(parseWorkshopSlugFromInterestedProduct("")).toBeNull();
  });
});

describe("metaPurchaseEventSourceUrl", () => {
  it("uses workshop tickets path when slug is set", () => {
    expect(
      metaPurchaseEventSourceUrl("https://aiwithmichal.com", "2026-04-16-ai-in-recruiting")
    ).toBe("https://aiwithmichal.com/workshops/2026-04-16-ai-in-recruiting/tickets");
  });

  it("falls back to /tickets when slug missing", () => {
    expect(metaPurchaseEventSourceUrl("https://aiwithmichal.com", null)).toBe(
      "https://aiwithmichal.com/tickets"
    );
  });
});

describe("metaLeadEventSourceUrl", () => {
  it("maps workshop:slug to tickets URL", () => {
    expect(
      metaLeadEventSourceUrl("https://aiwithmichal.com", "workshop:2026-04-23-sourcing-automation")
    ).toBe("https://aiwithmichal.com/workshops/2026-04-23-sourcing-automation/tickets");
  });

  it("maps mentoring product to join page", () => {
    expect(metaLeadEventSourceUrl("https://aiwithmichal.com", "mentoring:group")).toBe(
      "https://aiwithmichal.com/ai-mentoring/join"
    );
  });

  it("falls back to /tickets when no product", () => {
    expect(metaLeadEventSourceUrl("https://aiwithmichal.com", null)).toBe(
      "https://aiwithmichal.com/tickets"
    );
  });
});
