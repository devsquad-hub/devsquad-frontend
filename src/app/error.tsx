"use client";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page-main">
      <div className="error-state list-panel" role="alert">
        <h1>Não foi possível carregar esta página</h1>
        <p>
          A API ou sua sessão demorou para responder. Tente novamente em alguns
          instantes.
        </p>
        <button type="button" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
