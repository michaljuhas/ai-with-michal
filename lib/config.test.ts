import { describe, expect, it } from "vitest";
import { isAdminUser } from "./config";

describe("isAdminUser", () => {
  it("returns false for null", () => {
    expect(isAdminUser(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isAdminUser(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAdminUser("")).toBe(false);
  });

  it("returns false for random user id", () => {
    expect(isAdminUser("user_randomNotInList")).toBe(false);
  });
});
