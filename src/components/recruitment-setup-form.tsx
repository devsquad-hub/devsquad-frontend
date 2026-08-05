"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { parseProblem } from "@/lib/problem";
import { requestMutation } from "@/lib/mutation";

export function RecruitmentSetupForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      const response = await requestMutation(
        `/api/backend/v1/projects/${projectId}/recruitment`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            round: {
              name: String(form.get("roundName")).trim(),
              description: String(form.get("roundDescription") ?? "").trim(),
              opensAt: null,
              closesAt: form.get("closesAt")
                ? new Date(String(form.get("closesAt"))).toISOString()
                : null,
            },
            position: {
              title: String(form.get("title")).trim(),
              description: String(form.get("description") ?? "").trim(),
              skills: String(form.get("skills") ?? "")
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
              capacity: Number(form.get("capacity")),
              questions: [
                {
                  key: "motivation",
                  label: "Por que você quer participar?",
                  type: "LONG_TEXT",
                  required: true,
                  options: [],
                },
              ],
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error(
          parseProblem(await response.json().catch(() => undefined)).detail,
        );
      }
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível abrir o recrutamento.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="list-panel">
      <summary className="list-row row-title">Abrir recrutamento</summary>
      <form className="form-stack list-row" onSubmit={submit}>
        {error && <Flash variant="danger">{error}</Flash>}
        <div className="field">
          <label htmlFor="round-name">Nome da rodada</label>
          <input id="round-name" name="roundName" required maxLength={160} />
        </div>
        <div className="field">
          <label htmlFor="round-description">Descrição da rodada</label>
          <textarea
            id="round-description"
            name="roundDescription"
            maxLength={4_000}
          />
        </div>
        <div className="field">
          <label htmlFor="position-title">Posição</label>
          <input id="position-title" name="title" required maxLength={140} />
        </div>
        <div className="field">
          <label htmlFor="position-description">Descrição da posição</label>
          <textarea
            id="position-description"
            name="description"
            maxLength={4_000}
          />
        </div>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="position-skills">Habilidades</label>
            <input
              id="position-skills"
              name="skills"
              placeholder="Java, UX, PostgreSQL"
            />
          </div>
          <div className="field">
            <label htmlFor="position-capacity">Vagas</label>
            <input
              id="position-capacity"
              name="capacity"
              type="number"
              min={1}
              defaultValue={1}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="round-closes">Encerramento</label>
            <input id="round-closes" name="closesAt" type="datetime-local" />
          </div>
        </div>
        <div>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Abrindo..." : "Criar posição e abrir"}
          </Button>
        </div>
      </form>
    </details>
  );
}
