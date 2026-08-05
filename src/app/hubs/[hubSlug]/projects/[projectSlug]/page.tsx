import { notFound } from "next/navigation";
import { PublicProjectView } from "@/components/public-project-view";
import { LoadError } from "@/components/load-error";
import { backendFetch } from "@/lib/api";
import { isBackendError } from "@/lib/backend-failure";
import type {
  Hub,
  PageResponse,
  Project,
  RecruitmentPosition,
} from "@/lib/api-types";

export const dynamic = "force-dynamic";

export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ hubSlug: string; projectSlug: string }>;
}) {
  const { hubSlug, projectSlug } = await params;
  let project: Project;
  try {
    project = await backendFetch<Project>(
      `/api/v1/public/hubs/${hubSlug}/projects/${projectSlug}`,
    );
  } catch (error) {
    if (isBackendError(error) && error.problem.status === 404) notFound();
    return (
      <LoadError
        title="Projeto temporariamente indisponível"
        description="Não foi possível carregar este projeto. Tente novamente."
        retryHref={`/hubs/${hubSlug}/projects/${projectSlug}`}
      />
    );
  }

  const [hubs, positionsResult] = await Promise.all([
    backendFetch<PageResponse<Hub>>("/api/v1/public/hubs").catch(() => null),
    backendFetch<RecruitmentPosition[]>(
      `/api/v1/public/projects/${project.id}/recruitment-positions`,
    ).then(
      (positions) => ({ positions, unavailable: false }),
      () => ({ positions: [], unavailable: true }),
    ),
  ]);
  const hub = hubs?.items.find((item) => item.slug === hubSlug) ?? {
    name: hubSlug,
    slug: hubSlug,
  };
  return (
    <PublicProjectView
      hub={hub}
      project={project}
      positions={positionsResult.positions}
      positionsUnavailable={positionsResult.unavailable}
    />
  );
}
