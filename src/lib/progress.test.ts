import { describe, expect, it } from "vitest";
import { progressPercent } from "./progress";

describe("progressPercent", () => {
  it("returns a bounded percentage", () => {
    expect(progressPercent(2, 12)).toBe(17);
    expect(progressPercent(20, 12)).toBe(100);
    expect(progressPercent(-1, 12)).toBe(0);
  });

  it("returns zero when there is no work to measure", () => {
    expect(progressPercent(0, 0)).toBe(0);
    expect(progressPercent(1, -1)).toBe(0);
  });
});
