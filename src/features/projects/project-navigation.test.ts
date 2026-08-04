import { describe, expect, it } from "vitest";
import { emptyCapabilities } from "@/lib/capabilities";
import { projectNavigation } from "./project-navigation";

describe("projectNavigation", () => {
  it("mantém as áreas de trabalho e remove configurações para membros", () => {
    const navigation = projectNavigation("project-1", emptyCapabilities);

    expect(navigation.map((item) => item.label)).toEqual([
      "Visão geral",
      "Quadro",
      "Recrutamento",
      "Membros",
      "Atividade",
    ]);
  });

  it("inclui configurações para administradores do projeto", () => {
    const navigation = projectNavigation("project-1", {
      ...emptyCapabilities,
      manageProject: true,
    });

    expect(navigation.at(-1)).toEqual({
      label: "Configurações",
      href: "/app/projects/project-1/settings",
    });
  });
});
