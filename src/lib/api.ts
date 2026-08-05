import "server-only";

import { auth } from "@clerk/nextjs/server";
import { backendUnavailableProblem } from "./backend-failure";
import { parseProblem, type ProblemDetail } from "./problem";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export class BackendError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.detail);
  }
}

export async function backendFetch<T>(
  path: `/api/v1/${string}`,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (options.authenticated) {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      throw new BackendError({
        title: "Autenticação necessária",
        status: 401,
        detail: "Entre para continuar.",
        code: "authentication_required",
      });
    }
    headers.set("authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${backendUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    throw new BackendError(backendUnavailableProblem(error));
  }

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new BackendError(parseProblem(body));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
