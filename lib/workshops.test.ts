import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPublicWorkshopBySlug,
  getWorkshopBySlug,
  getWorkshopCalendarEvent,
  getWorkshopWelcomeSnapshot,
  isOpen,
  type Workshop,
} from "./workshops";

describe("getWorkshopBySlug", () => {
  it("returns workshop for known members slug", () => {
    const w = getWorkshopBySlug("2026-04-23-sourcing-automation");
    expect(w).not.toBeNull();
    expect(w?.title).toContain("Sourcing Automation");
  });

  it("returns null for unknown slug", () => {
    expect(getWorkshopBySlug("no-such-workshop")).toBeNull();
  });
});

describe("getPublicWorkshopBySlug", () => {
  it("returns public workshop for known slug", () => {
    const w = getPublicWorkshopBySlug("2026-04-23-sourcing-automation");
    expect(w).toBeDefined();
    expect(w?.priceIds.basic).toMatch(/^price_/);
  });

  it("returns undefined for unknown slug", () => {
    expect(getPublicWorkshopBySlug("unknown-slug")).toBeUndefined();
  });
});

describe("getWorkshopCalendarEvent", () => {
  it("returns ICS fields aligned with PUBLIC_WORKSHOPS for a known slug", () => {
    const cal = getWorkshopCalendarEvent("2026-04-23-sourcing-automation");
    expect(cal).not.toBeNull();
    const pub = getPublicWorkshopBySlug("2026-04-23-sourcing-automation");
    expect(cal!.startDate).toBe(pub!.startDate);
    expect(cal!.endDate).toBe(pub!.endDate);
    expect(cal!.title).toBe(pub!.title);
  });

  it("returns null for unknown slug", () => {
    expect(getWorkshopCalendarEvent("unknown-slug")).toBeNull();
  });
});

describe("getWorkshopWelcomeSnapshot", () => {
  it("prefers public workshop title and schedule", () => {
    const s = getWorkshopWelcomeSnapshot("2026-04-23-sourcing-automation");
    expect(s.slug).toBe("2026-04-23-sourcing-automation");
    expect(s.title).toContain("Sourcing Automation");
    expect(s.displayDate).toBe("April 23, 2026");
    expect(s.displayTime).toBeTruthy();
  });

  it("falls back to generic copy for unknown slug", () => {
    const s = getWorkshopWelcomeSnapshot("legacy-unknown-slug");
    expect(s.slug).toBe("legacy-unknown-slug");
    expect(s.title).toBe("Live workshop");
    expect(s.displayDate).toBe("");
  });
});

describe("isOpen", () => {
  const fakeWorkshop: Workshop = {
    slug: "test",
    title: "Test",
    description: "",
    location: "",
    date: new Date("2030-06-01T12:00:00Z"),
    startDate: "",
    endDate: "",
    displayDate: "",
    displayTime: "",
    displayDateShort: "",
    priceIds: { basic: "price_x", pro: "price_y" },
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when now is before workshop date", () => {
    vi.setSystemTime(new Date("2030-05-01T12:00:00Z"));
    expect(isOpen(fakeWorkshop)).toBe(true);
  });

  it("returns false when now is after workshop date", () => {
    vi.setSystemTime(new Date("2030-07-01T12:00:00Z"));
    expect(isOpen(fakeWorkshop)).toBe(false);
  });
});
