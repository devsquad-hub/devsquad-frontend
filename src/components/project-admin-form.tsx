"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { actionRequest } from "@/features/actions/action-request";
import { parseProblem } from "@/lib/problem";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";

export function ProjectAdminForm({
  accountId,
  projects,
}: {
  accountId: string;
  projects: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const projectId = String(
      new FormData(event.currentTarget).get("projectId"),
    );
    try {
      const response = await requestMutation(
        `/api/backend/v1/projects/${projectId}/admins/${accountId}`,
        actionRequest(undefined, "PUT"),
      );
      if (!response.ok) {
        setError(
          parseProblem(await response.json().catch(() => undefined)).detail,
        );
        return;
      }
      router.refresh();
    } catch (error) {
      setError(mutationErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (projects.length === 0) return null;
  return (
    <form className="project-meta" onSubmit={submit}>
      <label className="sr-only" htmlFor={`project-${accountId}`}>
        Projeto administrado
      </label>
      <select id={`project-${accountId}`} name="projectId">
        {projects.map((project) => (
          <option value={project.id} key={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={saving}>
        {saving ? "Aguarde..." : "Tornar líder"}
      </Button>
      {error && <Flash variant="danger">{error}</Flash>}
    </form>
  );
}
