import { describe, expect, it } from "vitest";
import { backendUnavailableProblem } from "./backend-failure";

describe("backendUnavailableProblem", () => {
  it("turns a transport failure into a recoverable problem detail", () => {
    expect(backendUnavailableProblem(new TypeError("fetch failed"))).toEqual({
      type: "https://devsquad.app/problems/backend_unavailable",
      title: "API temporariamente indisponível",
      status: 503,
      detail: "Não foi possível conversar com a API. Tente novamente.",
      code: "backend_unavailable",
    });
  });
});
