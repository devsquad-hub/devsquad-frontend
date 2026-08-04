import { PageHeading } from "@/components/page-heading";
import { TaskDetail } from "@/components/task-detail";
import type { TaskAttachment } from "@/components/task-attachments";
import { backendFetch } from "@/lib/api";
import type { Board, Comment, Task } from "@/lib/api-types";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  const [task, board, comments, attachments] = await Promise.all([
    backendFetch<Task>(`/api/v1/tasks/${taskId}`, { authenticated: true }),
    backendFetch<Board>(`/api/v1/projects/${projectId}/board`, {
      authenticated: true,
    }),
    backendFetch<Comment[]>(`/api/v1/tasks/${taskId}/comments`, {
      authenticated: true,
    }),
    backendFetch<TaskAttachment[]>(`/api/v1/attachments/tasks/${taskId}`, {
      authenticated: true,
    }),
  ]);
  return (
    <div>
      <PageHeading
        title={`#${task.sequence} ${task.title}`}
        description="Detalhes, responsáveis e conversa da tarefa."
      />
      <TaskDetail
        projectId={projectId}
        task={task}
        columns={board.columns}
        comments={comments}
        attachments={attachments}
      />
    </div>
  );
}
