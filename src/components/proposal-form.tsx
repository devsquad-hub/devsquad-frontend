"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { proposalPayload } from "@/features/proposals/proposal-payload";
import { parseProblem } from "@/lib/problem";

export function ProposalForm({ hubId }: { hubId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const response = await fetch(`/api/backend/v1/hubs/${hubId}/proposals`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(proposalPayload(new FormData(event.currentTarget))),
    });
    setSaving(false);
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    const proposal = (await response.json()) as { id: string };
    router.push(`/app/proposals?created=${proposal.id}`);
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <Flash variant="danger">{error}</Flash>}
      <Field label="Título" name="title" maxLength={180} required />
      <Area label="Resumo" name="summary" maxLength={4000} required />
      <Area label="Problema" name="problem" maxLength={8000} />
      <Area label="Solução proposta" name="solution" maxLength={8000} />
      <Area
        label="Objetivos e impacto esperado"
        name="expectedImpact"
        maxLength={8000}
      />
      <Field
        label="Habilidades desejadas"
        name="tags"
        description="Separe por vírgulas, por exemplo: Java, UX, PostgreSQL."
      />
      <div className="project-meta">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Salvando..." : "Salvar rascunho"}
        </Button>
        <Button type="button" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  description,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  description?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
      {description && <span className="muted">{description}</span>}
    </div>
  );
}

function Area({
  label,
  name,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} {...props} />
    </div>
  );
}
