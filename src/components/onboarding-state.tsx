"use client";

import { useEffect, useState } from "react";
import { SyncIcon } from "@primer/octicons-react";

export function OnboardingState({
  maxAttempts = 6,
  retryDelayMs = 2500,
  onRetry,
}: {
  maxAttempts?: number;
  retryDelayMs?: number;
  onRetry?: () => void;
}) {
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= maxAttempts) return;
    const timer = window.setTimeout(() => {
      setAttempts((current) => current + 1);
      if (onRetry) onRetry();
      else window.location.reload();
    }, retryDelayMs);
    return () => window.clearTimeout(timer);
  }, [attempts, maxAttempts, onRetry, retryDelayMs]);

  return (
    <div className="empty-state list-panel" role="status">
      <SyncIcon size={24} />
      <h1>Finalizando seu cadastro</h1>
      {attempts < maxAttempts ? (
        <p>
          Estamos sincronizando sua conta com a comunidade. Tentativa{" "}
          {attempts + 1} de {maxAttempts}.
        </p>
      ) : (
        <>
          <p>
            A sincronização demorou mais que o esperado. Você pode tentar
            novamente agora.
          </p>
          <button type="button" onClick={() => setAttempts(0)}>
            Tentar novamente
          </button>
        </>
      )}
    </div>
  );
}
