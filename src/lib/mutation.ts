import { backendUnavailableProblem } from "./backend-failure";
import type { ProblemDetail } from "./problem";

export class MutationError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.detail);
  }
}

export async function requestMutation(
  endpoint: string,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetch(endpoint, init);
  } catch (error) {
    throw new MutationError(backendUnavailableProblem(error));
  }
}

export function mutationErrorMessage(error: unknown): string {
  if (error instanceof MutationError) return error.problem.detail;
  if (isProblem(error)) return error.detail;
  return "Não foi possível concluir a operação. Tente novamente.";
}

function isProblem(value: unknown): value is ProblemDetail {
  return (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    typeof value.detail === "string"
  );
}
