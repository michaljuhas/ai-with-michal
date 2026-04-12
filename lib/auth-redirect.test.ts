import { describe, expect, it } from "vitest";
import {
  absoluteUrlForRedirect,
  deriveSignupIntentFromRedirectPath,
  parseSafeRedirectUrl,
} from "./auth-redirect";

describe("parseSafeRedirectUrl", () => {
  it("accepts internal path with query", () => {
    expect(parseSafeRedirectUrl("/members/resources/x?a=1")).toBe("/members/resources/x?a=1");
  });

  it("rejects protocol-relative and empty", () => {
    expect(parseSafeRedirectUrl("//evil.com")).toBeNull();
    expect(parseSafeRedirectUrl("")).toBeNull();
    expect(parseSafeRedirectUrl(null)).toBeNull();
  });
});

describe("deriveSignupIntentFromRedirectPath", () => {
  it("returns member_resource prefix for resource paths", () => {
    expect(deriveSignupIntentFromRedirectPath("/members/resources/test0104")).toBe(
      "member_resource:/members/resources/test0104"
    );
  });

  it("returns null for non-resource paths", () => {
    expect(deriveSignupIntentFromRedirectPath("/tickets")).toBeNull();
  });
});

describe("absoluteUrlForRedirect", () => {
  it("joins base and path", () => {
    expect(absoluteUrlForRedirect("https://example.com", "/foo")).toBe("https://example.com/foo");
  });
});
