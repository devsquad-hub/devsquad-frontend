import { describe, expect, it } from "vitest";
import { parseProblem } from "./problem";

describe("parseProblem", () => {
  it("preserva o código e a mensagem de um Problem Detail válido", () => {
    const result = parseProblem({
      type: "https://devsquad.app/problems/forbidden",
      title: "Acesso negado",
      status: 403,
      detail: "Você não pode alterar este projeto.",
      code: "project_access_denied",
    });

    expect(result).toEqual({
      type: "https://devsquad.app/problems/forbidden",
      title: "Acesso negado",
      status: 403,
      detail: "Você não pode alterar este projeto.",
      code: "project_access_denied",
    });
  });

  it("produz um erro seguro para respostas desconhecidas", () => {
    expect(parseProblem("gateway failure")).toEqual({
      title: "Não foi possível concluir a operação",
      status: 500,
      detail: "Tente novamente em alguns instantes.",
      code: "unexpected_error",
    });
  });
});
