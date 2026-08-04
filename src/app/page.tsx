import type { Hub, PageResponse, Project } from "@/lib/api-types";
import { backendFetch } from "@/lib/api";
import { CatalogView } from "@/components/catalog-view";
import { searchProjects } from "@/features/catalog/search-projects";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q?.trim() ?? "";
  let hubs: Hub[] = [];
  const projects: Project[] = [];
  let unavailable = false;

  try {
    const response = await backendFetch<PageResponse<Hub>>(
      "/api/v1/public/hubs",
    );
    hubs = response.items;
    const projectGroups = await Promise.all(
      hubs.map((hub) =>
        backendFetch<Project[]>(`/api/v1/public/hubs/${hub.id}/projects`),
      ),
    );
    projects.push(...projectGroups.flat());
  } catch {
    unavailable = true;
  }

  return (
    <CatalogView
      hubs={hubs}
      projects={searchProjects(projects, query)}
      unavailable={unavailable}
      query={query}
    />
  );
}
