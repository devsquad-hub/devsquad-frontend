import { PageHeading } from "@/components/page-heading";
import { LoadError } from "@/components/load-error";
import { backendFetch } from "@/lib/api";
import type { Project } from "@/lib/api-types";

export default async function ProjectOverviewPage({
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
    return <LoadError retryHref={`/app/projects/${projectId}`} />;
  }
  return (
    <div>
      <PageHeading
        title="Visão geral"
        description="Contexto, progresso e próximos passos do projeto."
      />
      <div className="list-panel">
        <div className="list-row">
          <h2 className="section-title">Descrição</h2>
          <p className="section-description project-description">
            {project.description ||
              "Adicione uma descrição detalhada nas configurações."}
          </p>
        </div>
        {project.repositoryUrl && (
          <div className="list-row">
            <strong>Repositório</strong>
            <a className="row-title" href={project.repositoryUrl}>
              {project.repositoryUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
