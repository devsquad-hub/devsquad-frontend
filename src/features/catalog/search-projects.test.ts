import { describe, expect, it } from "vitest";
import { searchProjects } from "./search-projects";

const projects = [
  { name: "Gestão Ágil", summary: "Kanban para comunidades", tags: ["Java"] },
  { name: "Portal", summary: "Site institucional", tags: ["Next.js"] },
];

describe("searchProjects", () => {
  it("searches names, summaries and tags without accents or case sensitivity", () => {
    expect(searchProjects(projects, "gestao")).toEqual([projects[0]]);
    expect(searchProjects(projects, "NEXT.JS")).toEqual([projects[1]]);
  });

  it("returns every project for a blank query", () => {
    expect(searchProjects(projects, "  ")).toEqual(projects);
  });
});
