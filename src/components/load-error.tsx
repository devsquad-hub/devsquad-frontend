import { AlertIcon } from "@primer/octicons-react";
import { Button, LinkButton } from "@primer/react";

export function LoadError({
  title = "Dados temporariamente indisponíveis",
  description = "Não foi possível carregar esta área. Tente novamente em instantes.",
  onRetry,
  retryHref,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryHref?: string;
}) {
  return (
    <div className="error-state list-panel" role="alert">
      <AlertIcon size={24} />
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry && (
        <Button type="button" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
      {retryHref && <LinkButton href={retryHref}>Tentar novamente</LinkButton>}
    </div>
  );
}
