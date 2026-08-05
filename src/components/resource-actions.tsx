"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flash } from "@primer/react";
import { actionRequest } from "@/features/actions/action-request";
import { parseProblem } from "@/lib/problem";
import { mutationErrorMessage, requestMutation } from "@/lib/mutation";

type ButtonVariant = "primary" | "danger" | "default";

export function MutationButton({
  endpoint,
  children,
  variant = "default",
}: {
  endpoint: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function mutate() {
    setSaving(true);
    setError(undefined);
    try {
      const response = await requestMutation(endpoint, actionRequest());
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

  return (
    <div>
      <Button
        type="button"
        variant={variant}
        disabled={saving}
        onClick={mutate}
      >
        {saving ? "Aguarde..." : children}
      </Button>
      {error && <Flash variant="danger">{error}</Flash>}
    </div>
  );
}

export function DecisionForm({
  endpoint,
  payloadKey,
  label,
  placeholder,
}: {
  endpoint: string;
  payloadKey: "note" | "reason";
  label: string;
  placeholder: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const value = String(
      new FormData(event.currentTarget).get(payloadKey) ?? "",
    ).trim();
    try {
      const response = await requestMutation(
        endpoint,
        actionRequest({ [payloadKey]: value }),
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

  return (
    <form className="project-meta" onSubmit={submit}>
      <label className="sr-only" htmlFor={`${payloadKey}-${endpoint}`}>
        {placeholder}
      </label>
      <input
        id={`${payloadKey}-${endpoint}`}
        name={payloadKey}
        placeholder={placeholder}
        required={payloadKey === "reason"}
        maxLength={2_000}
      />
      <Button type="submit" variant="danger" disabled={saving}>
        {saving ? "Aguarde..." : label}
      </Button>
      {error && <Flash variant="danger">{error}</Flash>}
    </form>
  );
}
