import { notFound } from "next/navigation";
import { ProjectShell } from "@/components/project-shell";
import { backendFetch } from "@/lib/api";
import type { Project } from "@/lib/api-types";

export default async function InternalProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await backendFetch<Project>(`/api/v1/projects/${projectId}`, {
    authenticated: true,
  }).catch(() => null);
  if (!project) notFound();
  return <ProjectShell project={project}>{children}</ProjectShell>;
}
