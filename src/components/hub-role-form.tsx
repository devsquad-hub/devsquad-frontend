"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { actionRequest } from "@/features/actions/action-request";
import { parseProblem } from "@/lib/problem";

export function HubRoleForm({
  hubId,
  accountId,
  currentRole,
}: {
  hubId: string;
  accountId: string;
  currentRole: "ADMIN" | "MEMBER";
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const role = String(new FormData(event.currentTarget).get("role"));
    const response = await fetch(
      `/api/backend/v1/hubs/${hubId}/members/${accountId}`,
      actionRequest({ role }, "PUT"),
    );
    setSaving(false);
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    router.refresh();
  }

  return (
    <form className="project-meta" onSubmit={submit}>
      <label className="sr-only" htmlFor={`role-${accountId}`}>
        Papel no hub
      </label>
      <select id={`role-${accountId}`} name="role" defaultValue={currentRole}>
        <option value="MEMBER">Membro</option>
        <option value="ADMIN">Administrador</option>
      </select>
      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Atualizar"}
      </Button>
      {error && <Flash variant="danger">{error}</Flash>}
    </form>
  );
}
