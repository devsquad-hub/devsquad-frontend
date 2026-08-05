import { describe, expect, it } from "vitest";
import type { Hub, PageResponse, Project } from "@/lib/api-types";
import { loadCatalog } from "./load-catalog";

const hub: Hub = { id: "hub-1", name: "DevSquad", slug: "devsquad" };
const project = {
  id: "project-1",
  hubId: hub.id,
  name: "Projeto",
  slug: "projeto",
  projectKey: "PRJ1",
  summary: "Resumo",
  description: null,
  status: "ACTIVE",
  repositoryUrl: null,
  communicationUrl: null,
  tags: [],
  totalTasks: 0,
  completedTasks: 0,
  members: [],
} satisfies Project;

const hubsResponse: PageResponse<Hub> = {
  items: [hub],
  page: 0,
  size: 1,
  totalItems: 1,
};

describe("loadCatalog", () => {
  it("keeps healthy hub projects when another hub fails", async () => {
    const secondHub = { ...hub, id: "hub-2", slug: "lab" };
    const result = await loadCatalog(async (path) => {
      if (path === "/api/v1/public/hubs") {
        return { ...hubsResponse, items: [hub, secondHub] };
      }
      if (path.includes("hub-1")) return [project];
      throw new Error("hub offline");
    });

    expect(result.projects).toEqual([project]);
    expect(result.failedHubIds).toEqual(["hub-2"]);
    expect(result.unavailable).toBe(false);
  });

  it("marks the catalog unavailable when the hub request fails", async () => {
    const result = await loadCatalog(async () => {
      throw new Error("api offline");
    });

    expect(result).toEqual({
      hubs: [],
      projects: [],
      failedHubIds: [],
      unavailable: true,
    });
  });
});
