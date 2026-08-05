import { LoadError } from "./load-error";

export function BackendUnavailable() {
  return (
    <LoadError
      title="Dados temporariamente indisponíveis"
      description="Não foi possível conversar com a API. Tente novamente em instantes."
    />
  );
}
