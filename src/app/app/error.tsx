"use client";

export default function AuthenticatedError({ reset }: { reset: () => void }) {
  return (
    <div className="error-state list-panel" role="alert">
      <h1>Não foi possível abrir esta área</h1>
      <p>
        Sua conta pode estar sincronizando ou a API pode estar indisponível.
        Tente novamente em alguns instantes.
      </p>
      <button type="button" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
