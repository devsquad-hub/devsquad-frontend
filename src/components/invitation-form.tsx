"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { parseProblem } from "@/lib/problem";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";

export function InvitationForm({
  projectId,
  candidates,
}: {
  projectId: string;
  candidates: Array<{ accountId: string; displayName: string }>;
}) {
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
        `/api/backend/v1/projects/${projectId}/invitations`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            accountId: form.get("accountId"),
            positionId: null,
            functionalRole:
              String(form.get("functionalRole") ?? "").trim() || null,
          }),
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

  if (candidates.length === 0)
    return (
      <p className="muted">Todos os membros do hub já participam do projeto.</p>
    );
  return (
    <form className="form-stack list-panel list-row" onSubmit={submit}>
      <h2 className="section-title">Convidar membro do hub</h2>
      {error && <Flash variant="danger">{error}</Flash>}
      <div className="field">
        <label htmlFor="invite-account">Pessoa</label>
        <select id="invite-account" name="accountId">
          {candidates.map((candidate) => (
            <option value={candidate.accountId} key={candidate.accountId}>
              {candidate.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="invite-role">Função</label>
        <input id="invite-role" name="functionalRole" maxLength={120} />
      </div>
      <div>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Enviando..." : "Enviar convite"}
        </Button>
      </div>
    </form>
  );
}
