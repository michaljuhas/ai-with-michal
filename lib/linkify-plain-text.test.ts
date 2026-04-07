import { describe, expect, it } from "vitest";
import { parsePlainTextUrls } from "./linkify-plain-text";

describe("parsePlainTextUrls", () => {
  it("returns a single text segment when there is no URL", () => {
    expect(parsePlainTextUrls("hello")).toEqual([{ kind: "text", value: "hello" }]);
  });

  it("wraps a bare https URL", () => {
    expect(parsePlainTextUrls("https://github.com/michaljuhas/recruiting-skills")).toEqual([
      { kind: "url", href: "https://github.com/michaljuhas/recruiting-skills" },
    ]);
  });

  it("splits text before and after a URL", () => {
    expect(
      parsePlainTextUrls(
        "Hi everyone, here's the Toolkit: https://github.com/michaljuhas/recruiting-skills Enjoy!"
      )
    ).toEqual([
      { kind: "text", value: "Hi everyone, here's the Toolkit: " },
      { kind: "url", href: "https://github.com/michaljuhas/recruiting-skills" },
      { kind: "text", value: " Enjoy!" },
    ]);
  });

  it("recognizes http URLs", () => {
    expect(parsePlainTextUrls("see http://example.com/path")).toEqual([
      { kind: "text", value: "see " },
      { kind: "url", href: "http://example.com/path" },
    ]);
  });
});
