import { PageHeading } from "@/components/page-heading";
import { backendFetch } from "@/lib/api";
import type { Project } from "@/lib/api-types";

export default async function ProjectOverviewPage({
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
        title="Visão geral"
        description="Contexto, progresso e próximos passos do projeto."
      />
      <div className="list-panel">
        <div className="list-row">
          <h2 className="section-title">Descrição</h2>
          <p className="section-description" style={{ whiteSpace: "pre-wrap" }}>
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
