import type { ProblemDetail } from "./problem";

export function backendUnavailableProblem(_cause?: unknown): ProblemDetail {
  // Do not expose transport details (including certificate metadata) to users.
  void _cause;
  return {
    type: "https://devsquad.app/problems/backend_unavailable",
    title: "API temporariamente indisponível",
    status: 503,
    detail: "Não foi possível conversar com a API. Tente novamente.",
    code: "backend_unavailable",
  };
}

export function isAccountNotReadyProblem(problem: ProblemDetail): boolean {
  return (
    problem.status === 401 ||
    problem.status === 404 ||
    problem.code === "account_not_synchronized"
  );
}
