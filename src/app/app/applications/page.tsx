import { InboxIcon } from "@primer/octicons-react";
import { Label } from "@primer/react";
import { BackendUnavailable } from "@/components/backend-unavailable";
import { PageHeading } from "@/components/page-heading";
import { backendFetch } from "@/lib/api";
import type { PageResponse } from "@/lib/api-types";
import { applicationStatusLabel } from "@/lib/labels";

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
  ).catch(() => undefined);
  return (
    <div className="content-width">
      <PageHeading
        title="Candidaturas"
        description="Acompanhe cada processo seletivo em que você participa."
      />
      {!response ? (
        <BackendUnavailable />
      ) : response.items.length === 0 ? (
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
                <Label>{applicationStatusLabel(item.status)}</Label>
              </div>
              <span className="muted">{item.projectName}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
