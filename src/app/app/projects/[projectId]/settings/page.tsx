import { PageHeading } from "@/components/page-heading";
import { ProjectSettingsForm } from "@/components/project-settings-form";
import { backendFetch } from "@/lib/api";
import type { Project } from "@/lib/api-types";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await backendFetch<Project>(`/api/v1/projects/${projectId}`, {
    authenticated: true,
  });
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
