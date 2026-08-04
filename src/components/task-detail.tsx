"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Flash, Label } from "@primer/react";
import type { BoardColumn, Comment, Task } from "@/lib/api-types";
import { parseProblem } from "@/lib/problem";
import {
  TaskAttachments,
  type TaskAttachment,
} from "@/components/task-attachments";

export function TaskDetail({
  projectId,
  task,
  columns,
  comments,
  attachments,
}: {
  projectId: string;
  task: Task;
  columns: BoardColumn[];
  comments: Comment[];
  attachments: TaskAttachment[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setMessage(undefined);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/backend/v1/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        expectedVersion: task.version,
        task: {
          parentId: task.parentId ?? null,
          columnId: form.get("columnId"),
          milestoneId: task.milestoneId ?? null,
          title: String(form.get("title") ?? "").trim(),
          description: String(form.get("description") ?? "").trim(),
          priority: form.get("priority"),
          startDate: form.get("startDate") || null,
          dueDate: form.get("dueDate") || null,
          position: task.position,
          assigneeIds: task.assignees.map((assignee) => assignee.id),
        },
      }),
    });
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    setMessage("Tarefa atualizada.");
    router.refresh();
  }

  async function comment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/backend/v1/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: String(form.get("body") ?? "").trim() }),
    });
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <div>
      {message && (
        <Flash variant="success" style={{ marginTop: 16 }}>
          {message}
        </Flash>
      )}
      {error && (
        <Flash variant="danger" style={{ marginTop: 16 }}>
          {error}
        </Flash>
      )}
      <form className="form-stack" onSubmit={save}>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            defaultValue={task.title}
            required
            maxLength={240}
          />
        </div>
        <div className="field">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            defaultValue={task.description ?? ""}
            maxLength={20000}
          />
        </div>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="columnId">Coluna</label>
            <select id="columnId" name="columnId" defaultValue={task.columnId}>
              {columns.map((column) => (
                <option value={column.id} key={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Prioridade</label>
            <select id="priority" name="priority" defaultValue={task.priority}>
              {["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="dueDate">Prazo</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={task.dueDate ?? ""}
            />
          </div>
        </div>
        <div className="project-meta">
          <Button type="submit" variant="primary">
            Salvar tarefa
          </Button>
          <Label>versão {task.version}</Label>
        </div>
      </form>
      <TaskAttachments
        projectId={projectId}
        taskId={task.id}
        attachments={attachments}
      />
      <section className="section">
        <h2 className="section-title">Comentários</h2>
        {comments.length > 0 && (
          <div className="list-panel">
            {comments.map((item) => (
              <article className="list-row" key={item.id}>
                <div className="project-meta">
                  <Avatar src={item.authorAvatarUrl ?? ""} alt="" size={24} />
                  <strong>{item.authorName}</strong>
                  <time className="muted" dateTime={item.createdAt}>
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </time>
                </div>
                <p
                  className="section-description"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        )}
        <form className="form-stack" onSubmit={comment}>
          <div className="field">
            <label htmlFor="comment-body">Novo comentário</label>
            <textarea
              id="comment-body"
              name="body"
              required
              maxLength={10000}
            />
          </div>
          <div>
            <Button type="submit">Comentar</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
