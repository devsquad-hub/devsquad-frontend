import { describe, expect, it } from "vitest";
import { proposalPayload } from "./proposal-payload";

describe("proposalPayload", () => {
  it("normaliza texto e remove tags vazias ou repetidas", () => {
    const form = new FormData();
    form.set("title", "  Plataforma de mentoria  ");
    form.set("summary", " Conectar pessoas mentoras e iniciantes. ");
    form.set("problem", " Falta de acesso. ");
    form.set("solution", " Criar ciclos de mentoria. ");
    form.set("expectedImpact", " Mais pessoas contribuindo. ");
    form.set("tags", "java, comunidade, java,  ");

    expect(proposalPayload(form)).toEqual({
      title: "Plataforma de mentoria",
      summary: "Conectar pessoas mentoras e iniciantes.",
      problem: "Falta de acesso.",
      proposedSolution: "Criar ciclos de mentoria.",
      goals: "Mais pessoas contribuindo.",
      desiredSkills: ["java", "comunidade"],
    });
  });
});
