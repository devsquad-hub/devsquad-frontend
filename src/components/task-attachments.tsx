"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { PaperclipIcon } from "@primer/octicons-react";
import { parseProblem } from "@/lib/problem";

export type TaskAttachment = {
  id: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export function TaskAttachments({
  projectId,
  taskId,
  attachments,
}: {
  projectId: string;
  taskId: string;
  attachments: TaskAttachment[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem(
      "file",
    ) as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    setSaving(true);
    setError(undefined);
    try {
      const ticketResponse = await fetch(
        "/api/backend/v1/attachments/upload-ticket",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            projectId,
            taskId,
            commentId: null,
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }),
        },
      );
      if (!ticketResponse.ok)
        throw new Error(parseProblem(await ticketResponse.json()).detail);
      const ticket = (await ticketResponse.json()) as {
        attachmentId: string;
        uploadUrl: string;
        headers: Record<string, string[]>;
      };
      const uploadHeaders = new Headers();
      for (const [name, values] of Object.entries(ticket.headers))
        uploadHeaders.set(name, values.join(","));
      const objectResponse = await fetch(ticket.uploadUrl, {
        method: "PUT",
        headers: uploadHeaders,
        body: file,
      });
      if (!objectResponse.ok)
        throw new Error("O armazenamento recusou o arquivo.");
      const complete = await fetch(
        `/api/backend/v1/attachments/${ticket.attachmentId}/complete`,
        {
          method: "POST",
        },
      );
      if (!complete.ok)
        throw new Error(parseProblem(await complete.json()).detail);
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível enviar o arquivo.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function download(attachmentId: string) {
    const response = await fetch(
      `/api/backend/v1/attachments/${attachmentId}/download-ticket`,
    );
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    const ticket = (await response.json()) as { downloadUrl: string };
    window.location.assign(ticket.downloadUrl);
  }

  return (
    <section className="section">
      <h2 className="section-title">Anexos</h2>
      {error && <Flash variant="danger">{error}</Flash>}
      {attachments.length > 0 && (
        <div className="list-panel">
          {attachments.map((attachment) => (
            <div className="list-row section-header" key={attachment.id}>
              <span className="project-meta">
                <PaperclipIcon />
                {attachment.originalName}
              </span>
              <Button type="button" onClick={() => download(attachment.id)}>
                Baixar
              </Button>
            </div>
          ))}
        </div>
      )}
      <form className="project-meta" onSubmit={upload}>
        <label className="sr-only" htmlFor="task-file">
          Selecionar arquivo
        </label>
        <input id="task-file" name="file" type="file" required />
        <Button type="submit" disabled={saving}>
          {saving ? "Enviando..." : "Anexar arquivo"}
        </Button>
      </form>
    </section>
  );
}
