import { backendFetch } from "@/lib/api";
import { CatalogView } from "@/components/catalog-view";
import { loadCatalog } from "@/features/catalog/load-catalog";
import { searchProjects } from "@/features/catalog/search-projects";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q?.trim() ?? "";
  const catalog = await loadCatalog((path) =>
    backendFetch(path as `/api/v1/${string}`),
  );

  return (
    <CatalogView
      hubs={catalog.hubs}
      projects={searchProjects(catalog.projects, query)}
      failedHubIds={catalog.failedHubIds}
      unavailable={catalog.unavailable}
      query={query}
    />
  );
}
