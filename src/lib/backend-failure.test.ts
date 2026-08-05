import { describe, expect, it } from "vitest";
import {
  backendUnavailableProblem,
  isAccountNotReadyProblem,
  isBackendError,
} from "./backend-failure";
import type { ProblemDetail } from "./problem";

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

  it("recognizes the unsynchronized account response regardless of error class", () => {
    const problem: ProblemDetail = {
      title: "Conta não sincronizada",
      status: 409,
      detail: "Account has not been synchronized yet",
      code: "account_not_synchronized",
    };

    expect(isAccountNotReadyProblem(problem)).toBe(true);
    expect(isBackendError({ problem })).toBe(true);
  });

  it("does not turn unrelated auth or missing-resource errors into onboarding", () => {
    expect(
      isAccountNotReadyProblem({
        title: "Autenticação necessária",
        status: 401,
        detail: "Entre para continuar.",
        code: "authentication_required",
      }),
    ).toBe(false);
    expect(
      isAccountNotReadyProblem({
        title: "Não encontrado",
        status: 404,
        detail: "O recurso não existe.",
        code: "resource_not_found",
      }),
    ).toBe(false);
  });
});
