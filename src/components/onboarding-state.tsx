"use client";

import { useEffect } from "react";
import { SyncIcon } from "@primer/octicons-react";

export function OnboardingState() {
  useEffect(() => {
    const timer = window.setTimeout(() => window.location.reload(), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="empty-state list-panel" role="status">
      <SyncIcon size={24} />
      <h1>Finalizando seu cadastro</h1>
      <p>
        Estamos sincronizando sua conta com a comunidade. Esta página será
        atualizada automaticamente.
      </p>
    </div>
  );
}
