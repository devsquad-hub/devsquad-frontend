import { PageHeading } from "@/components/page-heading";
import { LoadError } from "@/components/load-error";
import { ProjectSettingsForm } from "@/components/project-settings-form";
import { backendFetch } from "@/lib/api";
import type { Project } from "@/lib/api-types";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project: Project;
  try {
    project = await backendFetch<Project>(`/api/v1/projects/${projectId}`, {
      authenticated: true,
    });
  } catch {
    return <LoadError retryHref={`/app/projects/${projectId}/settings`} />;
  }
  return (
    <div>
      <PageHeading
        title="Configurações"
        description="Metadados públicos e integrações do projeto."
      />
      <ProjectSettingsForm project={project} />
    </div>
  );
}
