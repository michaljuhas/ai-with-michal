import { describe, expect, it } from "vitest";
import { parseWorkshopSeriesParam, WORKSHOP_SERIES } from "./workshop-series";

describe("parseWorkshopSeriesParam", () => {
  it("defaults missing or invalid to recruiting", () => {
    expect(parseWorkshopSeriesParam(undefined)).toBe("recruiting");
    expect(parseWorkshopSeriesParam("")).toBe("recruiting");
    expect(parseWorkshopSeriesParam("nope")).toBe("recruiting");
  });

  it("accepts known series ids", () => {
    expect(parseWorkshopSeriesParam("recruiting")).toBe("recruiting");
    expect(parseWorkshopSeriesParam("gtm")).toBe("gtm");
    expect(parseWorkshopSeriesParam("agency")).toBe("agency");
  });
});

describe("WORKSHOP_SERIES", () => {
  it("lists all three series ids", () => {
    const ids = WORKSHOP_SERIES.map((s) => s.id).sort();
    expect(ids).toEqual(["agency", "gtm", "recruiting"]);
  });
});
