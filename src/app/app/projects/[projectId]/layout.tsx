import { notFound } from "next/navigation";
import { LoadError } from "@/components/load-error";
import { ProjectShell } from "@/components/project-shell";
import { backendFetch } from "@/lib/api";
import { isBackendError } from "@/lib/backend-failure";
import type { Project } from "@/lib/api-types";

export default async function InternalProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project: Project;
  try {
    project = await backendFetch<Project>(`/api/v1/projects/${projectId}`, {
      authenticated: true,
    });
  } catch (error) {
    if (isBackendError(error) && error.problem.status === 404) notFound();
    return (
      <ProjectShellFallback>
        <LoadError retryHref={`/app/projects/${projectId}`} />
      </ProjectShellFallback>
    );
  }
  return <ProjectShell project={project}>{children}</ProjectShell>;
}

function ProjectShellFallback({ children }: { children: React.ReactNode }) {
  return <main className="page-main content-width">{children}</main>;
}
