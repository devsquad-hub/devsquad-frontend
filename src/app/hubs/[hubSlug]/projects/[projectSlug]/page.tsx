import { notFound } from "next/navigation";
import { PublicProjectView } from "@/components/public-project-view";
import { backendFetch } from "@/lib/api";
import type { Project, RecruitmentPosition } from "@/lib/api-types";

export const dynamic = "force-dynamic";

export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ hubSlug: string; projectSlug: string }>;
}) {
  const { hubSlug, projectSlug } = await params;
  const project = await backendFetch<Project>(
    `/api/v1/public/hubs/${hubSlug}/projects/${projectSlug}`,
  ).catch(() => null);
  if (!project) notFound();
  const positions = await backendFetch<RecruitmentPosition[]>(
    `/api/v1/public/projects/${project.id}/recruitment-positions`,
  ).catch(() => []);
  return <PublicProjectView project={project} positions={positions} />;
}
