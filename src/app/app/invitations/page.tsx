import { MailIcon } from "@primer/octicons-react";
import { Label } from "@primer/react";
import { PageHeading } from "@/components/page-heading";
import { MutationButton } from "@/components/resource-actions";
import { backendFetch } from "@/lib/api";
import type { PageResponse } from "@/lib/api-types";

type Invitation = {
  id: string;
  projectName: string;
  functionalRole?: string | null;
  status: string;
  expiresAt: string;
};

export default async function InvitationsPage() {
  const response = await backendFetch<PageResponse<Invitation>>(
    "/api/v1/me/invitations",
    { authenticated: true },
  ).catch(() => ({ items: [], page: 0, size: 0, totalItems: 0 }));
  return (
    <div className="content-width">
      <PageHeading
        title="Convites"
        description="Convites para integrar equipes de projeto."
      />
      {response.items.length === 0 ? (
        <div className="empty-state list-panel">
          <MailIcon size={24} />
          <h2>Nenhum convite pendente</h2>
          <p>
            Quando um administrador convidar você, os detalhes aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="list-panel">
          {response.items.map((item) => (
            <article className="list-row" key={item.id}>
              <div className="section-header">
                <strong>{item.projectName}</strong>
                <Label>{item.status}</Label>
              </div>
              <span className="muted">{item.functionalRole}</span>
              {item.status === "PENDING" && (
                <div className="project-meta">
                  <MutationButton
                    endpoint={`/api/backend/v1/invitations/${item.id}/accept`}
                    variant="primary"
                  >
                    Aceitar
                  </MutationButton>
                  <MutationButton
                    endpoint={`/api/backend/v1/invitations/${item.id}/decline`}
                  >
                    Recusar
                  </MutationButton>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
