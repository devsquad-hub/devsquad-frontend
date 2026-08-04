import { InboxIcon } from "@primer/octicons-react";
import { Label } from "@primer/react";
import { PageHeading } from "@/components/page-heading";
import { backendFetch } from "@/lib/api";
import type { PageResponse } from "@/lib/api-types";

type Application = {
  id: string;
  positionTitle: string;
  projectName?: string;
  status: string;
  submittedAt: string;
};

export default async function ApplicationsPage() {
  const response = await backendFetch<PageResponse<Application>>(
    "/api/v1/me/applications",
    { authenticated: true },
  ).catch(() => ({ items: [], page: 0, size: 0, totalItems: 0 }));
  return (
    <div className="content-width">
      <PageHeading
        title="Candidaturas"
        description="Acompanhe cada processo seletivo em que você participa."
      />
      {response.items.length === 0 ? (
        <div className="empty-state list-panel">
          <InboxIcon size={24} />
          <h2>Nenhuma candidatura</h2>
          <p>
            As vagas abertas estão disponíveis nas páginas públicas dos
            projetos.
          </p>
        </div>
      ) : (
        <div className="list-panel">
          {response.items.map((item) => (
            <article className="list-row" key={item.id}>
              <div className="section-header">
                <strong>{item.positionTitle}</strong>
                <Label>{item.status}</Label>
              </div>
              <span className="muted">{item.projectName}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
