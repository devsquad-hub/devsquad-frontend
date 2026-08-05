"use client";

import { useState } from "react";
import { Button, Flash } from "@primer/react";
import type { Account } from "@/lib/api-types";
import { parseProblem } from "@/lib/problem";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";

export function ProfileForm({ account }: { account: Account }) {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(undefined);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    try {
      const response = await requestMutation("/api/backend/v1/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: data.get("displayName"),
          bio: data.get("bio"),
          skills: String(data.get("skills") ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          githubUrl: nullable(data.get("githubUrl")),
          linkedinUrl: nullable(data.get("linkedinUrl")),
          portfolioUrl: nullable(data.get("portfolioUrl")),
          availabilityHours: Number(data.get("availabilityHours")) || null,
        }),
      });
      if (!response.ok) {
        setError(
          parseProblem(await response.json().catch(() => undefined)).detail,
        );
        return;
      }
      setMessage("Perfil atualizado.");
    } catch (error) {
      setError(mutationErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {message && <Flash variant="success">{message}</Flash>}
      {error && <Flash variant="danger">{error}</Flash>}
      <Field
        label="Nome"
        name="displayName"
        defaultValue={account.displayName}
        required
      />
      <div className="field">
        <label htmlFor="bio">Sobre você</label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={account.bio ?? ""}
          maxLength={4000}
        />
      </div>
      <Field
        label="Habilidades"
        name="skills"
        defaultValue={account.skills.join(", ")}
        description="Separe por vírgulas."
      />
      <Field
        label="GitHub"
        name="githubUrl"
        type="url"
        defaultValue={account.githubUrl ?? ""}
      />
      <Field
        label="LinkedIn"
        name="linkedinUrl"
        type="url"
        defaultValue={account.linkedinUrl ?? ""}
      />
      <Field
        label="Portfólio"
        name="portfolioUrl"
        type="url"
        defaultValue={account.portfolioUrl ?? ""}
      />
      <Field
        label="Horas disponíveis por semana"
        name="availabilityHours"
        type="number"
        defaultValue={account.availabilityHours ?? ""}
      />
      <div>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Salvando..." : "Salvar perfil"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  description,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  description?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...input} />
      {description && <span className="muted">{description}</span>}
    </div>
  );
}

function nullable(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text || null;
}
