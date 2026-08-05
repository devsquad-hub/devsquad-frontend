import { describe, expect, it } from "vitest";
import { loadState } from "./load-state";

describe("loadState", () => {
  it("keeps a successful empty collection distinct from an error", async () => {
    await expect(
      loadState(
        async () => [],
        (items) => items.length === 0,
      ),
    ).resolves.toEqual({
      kind: "empty",
      data: [],
    });
  });

  it("returns ready for a successful non-empty collection", async () => {
    await expect(
      loadState(
        async () => ["project"],
        (items) => items.length === 0,
      ),
    ).resolves.toEqual({ kind: "ready", data: ["project"] });
  });

  it("preserves a rejected loader as an error state", async () => {
    const error = new Error("offline");
    await expect(
      loadState(
        async () => Promise.reject(error),
        () => false,
      ),
    ).resolves.toEqual({
      kind: "error",
      error,
    });
  });
});
