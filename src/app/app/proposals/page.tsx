import { Label, LinkButton } from "@primer/react";
import { CommentDiscussionIcon } from "@primer/octicons-react";
import { BackendUnavailable } from "@/components/backend-unavailable";
import { PageHeading } from "@/components/page-heading";
import { DecisionForm, MutationButton } from "@/components/resource-actions";
import { backendFetch, currentAccount } from "@/lib/api";
import type { HubMembership, Proposal } from "@/lib/api-types";
import { proposalStatusLabel } from "@/lib/labels";

export default async function ProposalsPage() {
  const result = await loadProposals();
  return (
    <div className="content-width">
      <PageHeading
        title="Propostas"
        description="Ideias em preparação e aguardando avaliação."
        action={
          <LinkButton href="/app/proposals/new" variant="primary">
            Nova proposta
          </LinkButton>
        }
      />
      {!result ? (
        <BackendUnavailable />
      ) : result.proposals.length === 0 ? (
        <div className="empty-state list-panel">
          <CommentDiscussionIcon size={24} />
          <h2>Nenhuma proposta</h2>
          <p>Registre uma ideia para iniciar um novo projeto.</p>
        </div>
      ) : (
        <div className="list-panel">
          {result.proposals.map((proposal) => (
            <article className="list-row" key={proposal.id}>
              <div className="section-header">
                <div>
                  <strong>{proposal.content.title}</strong>
                  <p className="section-description">
                    {proposal.content.summary}
                  </p>
                </div>
                <Label
                  variant={
                    proposal.status === "APPROVED" ? "success" : "secondary"
                  }
                >
                  {proposalStatusLabel(proposal.status)}
                </Label>
              </div>
              <div className="tag-list">
                {proposal.content.desiredSkills.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
              {proposal.status === "DRAFT" &&
                proposal.authorId === result.account.id && (
                  <MutationButton
                    endpoint={`/api/backend/v1/proposals/${proposal.id}/submit`}
                    variant="primary"
                  >
                    Enviar para avaliação
                  </MutationButton>
                )}
              {proposal.status === "PENDING" &&
                result.hubs.some(
                  (hub) =>
                    hub.hubId === proposal.hubId &&
                    (hub.role === "MASTER" || hub.role === "ADMIN"),
                ) && (
                  <div className="form-stack">
                    <MutationButton
                      endpoint={`/api/backend/v1/proposals/${proposal.id}/approve`}
                      variant="primary"
                    >
                      Aprovar e criar projeto
                    </MutationButton>
                    <DecisionForm
                      endpoint={`/api/backend/v1/proposals/${proposal.id}/reject`}
                      payloadKey="reason"
                      label="Rejeitar"
                      placeholder="Motivo da rejeição"
                    />
                  </div>
                )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

async function loadProposals() {
  try {
    const hubs = await backendFetch<HubMembership[]>("/api/v1/hubs", {
      authenticated: true,
    });
    const [groups, account] = await Promise.all([
      Promise.all(
        hubs.map((hub) =>
          backendFetch<Proposal[]>(`/api/v1/hubs/${hub.hubId}/proposals`, {
            authenticated: true,
          }),
        ),
      ),
      currentAccount(),
    ]);
    return { hubs, account, proposals: groups.flat() };
  } catch {
    return undefined;
  }
}
