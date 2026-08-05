import type { Hub, PageResponse, Project } from "@/lib/api-types";

export type CatalogLoadResult = {
  hubs: Hub[];
  projects: Project[];
  failedHubIds: string[];
  unavailable: boolean;
};

type CatalogFetcher = (path: string) => Promise<unknown>;

export async function loadCatalog(
  fetcher: CatalogFetcher,
): Promise<CatalogLoadResult> {
  let hubs: Hub[];
  try {
    const response = (await fetcher(
      "/api/v1/public/hubs",
    )) as PageResponse<Hub>;
    hubs = response.items;
  } catch {
    return { hubs: [], projects: [], failedHubIds: [], unavailable: true };
  }

  const groups = await Promise.all(
    hubs.map(async (hub) => {
      try {
        return {
          hubId: hub.id,
          projects: (await fetcher(
            `/api/v1/public/hubs/${hub.id}/projects`,
          )) as Project[],
        };
      } catch {
        return { hubId: hub.id, projects: null };
      }
    }),
  );
  const failedHubIds = groups
    .filter((group) => group.projects === null)
    .map((group) => group.hubId);
  const projects = groups.flatMap((group) => group.projects ?? []);

  return {
    hubs,
    projects,
    failedHubIds,
    unavailable: hubs.length > 0 && failedHubIds.length === hubs.length,
  };
}
