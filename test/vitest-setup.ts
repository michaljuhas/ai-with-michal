import { afterEach, beforeEach, vi } from "vitest";

/** Route handlers log expected failures; silence so `npm test` / CI stays readable. */
let consoleSpies: ReturnType<typeof vi.spyOn>[];

beforeEach(() => {
  consoleSpies = [
    vi.spyOn(console, "error").mockImplementation(() => {}),
    vi.spyOn(console, "warn").mockImplementation(() => {}),
  ];
});

afterEach(() => {
  for (const spy of consoleSpies) {
    spy.mockRestore();
  }
});
