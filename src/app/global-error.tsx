"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="page-main">
          <div className="error-state list-panel" role="alert">
            <h1>DevSquad está temporariamente indisponível</h1>
            <p>Recarregue a página para tentar restabelecer a sessão.</p>
            <button type="button" onClick={reset}>
              Recarregar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
