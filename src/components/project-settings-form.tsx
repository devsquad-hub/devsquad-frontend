"use client";

import { useState } from "react";
import { Button, Flash } from "@primer/react";
import type { Project } from "@/lib/api-types";
import { parseProblem } from "@/lib/problem";

export function ProjectSettingsForm({ project }: { project: Project }) {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(undefined);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/backend/v1/projects/${project.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? "").trim(),
        summary: String(form.get("summary") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        repositoryUrl: optional(form, "repositoryUrl"),
        communicationUrl: optional(form, "communicationUrl"),
        tags: String(form.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    });
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    setMessage("Projeto atualizado.");
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {message && <Flash variant="success">{message}</Flash>}
      {error && <Flash variant="danger">{error}</Flash>}
      <Field label="Nome" name="name" defaultValue={project.name} required />
      <Field
        label="Resumo"
        name="summary"
        defaultValue={project.summary}
        required
      />
      <div className="field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          defaultValue={project.description ?? ""}
        />
      </div>
      <Field
        label="Repositório"
        name="repositoryUrl"
        type="url"
        defaultValue={project.repositoryUrl ?? ""}
      />
      <Field
        label="Canal de comunicação"
        name="communicationUrl"
        type="url"
        defaultValue={project.communicationUrl ?? ""}
      />
      <Field
        label="Tecnologias"
        name="tags"
        defaultValue={project.tags.join(", ")}
      />
      <div>
        <Button type="submit" variant="primary">
          Salvar projeto
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
    </div>
  );
}

function optional(form: FormData, name: string): string | null {
  return String(form.get(name) ?? "").trim() || null;
}
