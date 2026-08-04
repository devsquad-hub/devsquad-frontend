export type ProblemDetail = {
  type?: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  errors?: Record<string, string[]>;
};

const fallback: ProblemDetail = {
  title: "Não foi possível concluir a operação",
  status: 500,
  detail: "Tente novamente em alguns instantes.",
  code: "unexpected_error",
};

export function parseProblem(value: unknown): ProblemDetail {
  if (!isRecord(value)) return fallback;

  const { type, title, status, detail, code, errors } = value;
  if (
    typeof title !== "string" ||
    typeof status !== "number" ||
    typeof detail !== "string" ||
    typeof code !== "string"
  ) {
    return fallback;
  }

  return {
    ...(typeof type === "string" ? { type } : {}),
    title,
    status,
    detail,
    code,
    ...(isErrors(errors) ? { errors } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isErrors(value: unknown): value is Record<string, string[]> {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (messages) =>
        Array.isArray(messages) &&
        messages.every((message) => typeof message === "string"),
    )
  );
}
