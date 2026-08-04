import { IssueOpenedIcon } from "@primer/octicons-react";
import { BoardView } from "@/components/board-view";
import { PageHeading } from "@/components/page-heading";
import { NewTaskForm } from "@/components/new-task-form";
import { backendFetch } from "@/lib/api";
import type { Board, Project } from "@/lib/api-types";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [board, project] = await Promise.all([
    backendFetch<Board>(`/api/v1/projects/${projectId}/board`, {
      authenticated: true,
    }),
    backendFetch<Project>(`/api/v1/projects/${projectId}`, {
      authenticated: true,
    }),
  ]);
  return (
    <div>
      <PageHeading
        title="Quadro"
        description="Organize o trabalho e mantenha o andamento visível."
      />
      {board.columns.length > 0 && (
        <NewTaskForm
          projectId={projectId}
          columns={board.columns}
          members={project.members}
        />
      )}
      {board.columns.length === 0 ? (
        <div className="empty-state list-panel">
          <IssueOpenedIcon size={24} />
          <h2>Quadro sem colunas</h2>
          <p>Um administrador pode configurar o fluxo do projeto.</p>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <BoardView initialBoard={board} />
        </div>
      )}
    </div>
  );
}
