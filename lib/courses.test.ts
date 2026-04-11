import { beforeAll, describe, expect, it } from "vitest";
import {
  COURSES,
  getCourseBySlug,
  getPublishedCourses,
  type CourseDef,
} from "./courses";

describe("getCourseBySlug", () => {
  it("returns course for known slug", () => {
    const c = getCourseBySlug("first-principles-sourcing");
    expect(c).toBeDefined();
    expect(c?.title).toBe("First Principles in Talent Sourcing");
  });

  it("returns undefined for unknown slug", () => {
    expect(getCourseBySlug("no-such-course")).toBeUndefined();
  });
});

describe("getPublishedCourses", () => {
  it("returns only published courses", () => {
    const courses = getPublishedCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses.every((c) => c.published)).toBe(true);
  });

  it("excludes unpublished courses", () => {
    // Verify the filter works: all published=false entries are excluded
    const unpublished = COURSES.filter((c) => !c.published);
    const result = getPublishedCourses();
    for (const c of unpublished) {
      expect(result.find((r) => r.slug === c.slug)).toBeUndefined();
    }
  });
});

describe("first-principles-sourcing data integrity", () => {
  let course: CourseDef;

  beforeAll(() => {
    course = getCourseBySlug("first-principles-sourcing")!;
  });

  it("has required fields", () => {
    expect(course.slug).toBe("first-principles-sourcing");
    expect(course.title).toBeTruthy();
    expect(course.tagline).toBeTruthy();
    expect(course.description).toBeTruthy();
    expect(course.format).toBe("hybrid");
    expect(course.published).toBe(true);
  });

  it("has basic and pro prices set correctly", () => {
    expect(course.prices.basic).toBe(490);
    expect(course.prices.pro).toBe(690);
    expect(course.prices.pro).toBeGreaterThan(course.prices.basic);
  });

  it("has exactly two ticket options: basic and pro", () => {
    expect(course.ticketOptions).toHaveLength(2);
    const ids = course.ticketOptions.map((o) => o.id);
    expect(ids).toContain("basic");
    expect(ids).toContain("pro");
  });

  it("ticket option prices match prices field", () => {
    const basic = course.ticketOptions.find((o) => o.id === "basic")!;
    const pro = course.ticketOptions.find((o) => o.id === "pro")!;
    expect(basic.price).toBe(course.prices.basic);
    expect(pro.price).toBe(course.prices.pro);
  });

  it("each ticket option has at least one include item", () => {
    for (const option of course.ticketOptions) {
      expect(option.includes.length).toBeGreaterThan(0);
    }
  });

  it("has 3 sections with 3 lessons each", () => {
    expect(course.sections).toHaveLength(3);
    for (const section of course.sections!) {
      expect(section.lessons).toHaveLength(3);
    }
  });

  it("all lesson slugs are unique across the course", () => {
    const slugs = course.sections!.flatMap((s) => s.lessons.map((l) => l.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has sessionsIncluded and sessionDurationMinutes set", () => {
    expect(course.sessionsIncluded).toBeGreaterThan(0);
    expect(course.sessionDurationMinutes).toBeGreaterThan(0);
  });

  it("has a schedulingUrl set", () => {
    expect(course.schedulingUrl).toBeTruthy();
    expect(course.schedulingUrl).toMatch(/^https?:\/\//);
  });

  it("has hasWorkgroup enabled", () => {
    expect(course.hasWorkgroup).toBe(true);
  });

  it("priceIds keys match ticket option ids", () => {
    expect(Object.keys(course.priceIds)).toContain("basic");
    expect(Object.keys(course.priceIds)).toContain("pro");
  });
});
