import { AlertIcon } from "@primer/octicons-react";

export function BackendUnavailable() {
  return (
    <div className="error-state list-panel" role="alert">
      <AlertIcon size={24} />
      <h2>Dados temporariamente indisponíveis</h2>
      <p>Não foi possível conversar com a API. Tente novamente em instantes.</p>
    </div>
  );
}
