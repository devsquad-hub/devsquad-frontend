"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { newTaskPayload } from "@/features/tasks/task-payload";
import type { BoardColumn, Member } from "@/lib/api-types";
import { parseProblem } from "@/lib/problem";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";
import { priorityLabel } from "@/lib/labels";

export function NewTaskForm({
  projectId,
  columns,
  members,
}: {
  projectId: string;
  columns: BoardColumn[];
  members: Member[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    try {
      const response = await requestMutation(
        `/api/backend/v1/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            newTaskPayload(new FormData(event.currentTarget)),
          ),
        },
      );
      if (!response.ok) {
        setError(
          parseProblem(await response.json().catch(() => undefined)).detail,
        );
        return;
      }
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      setError(mutationErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="list-panel">
      <summary className="list-row row-title">Criar tarefa</summary>
      <form className="form-stack list-row" onSubmit={submit}>
        {error && <Flash variant="danger">{error}</Flash>}
        <div className="field">
          <label htmlFor="new-task-title">Título</label>
          <input id="new-task-title" name="title" required maxLength={240} />
        </div>
        <div className="field">
          <label htmlFor="new-task-description">Descrição</label>
          <textarea
            id="new-task-description"
            name="description"
            maxLength={20_000}
          />
        </div>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="new-task-column">Coluna</label>
            <select id="new-task-column" name="columnId">
              {columns.map((column) => (
                <option value={column.id} key={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="new-task-priority">Prioridade</label>
            <select id="new-task-priority" name="priority" defaultValue="NONE">
              {["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                <option value={priority} key={priority}>
                  {priorityLabel(priority)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="new-task-due">Prazo</label>
            <input id="new-task-due" name="dueDate" type="date" />
          </div>
        </div>
        <fieldset className="field">
          <legend>Responsáveis</legend>
          {members.map((member) => (
            <label className="project-meta" key={member.accountId}>
              <input
                type="checkbox"
                name="assigneeIds"
                value={member.accountId}
              />
              {member.displayName}
            </label>
          ))}
        </fieldset>
        <div>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Criando..." : "Criar tarefa"}
          </Button>
        </div>
      </form>
    </details>
  );
}
