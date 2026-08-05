import { LinkButton } from "@primer/react";
import { CommentDiscussionIcon } from "@primer/octicons-react";
import { BackendUnavailable } from "@/components/backend-unavailable";
import { PageHeading } from "@/components/page-heading";
import { DecisionForm, MutationButton } from "@/components/resource-actions";
import { groupProposals } from "@/features/proposals/proposal-groups";
import { backendFetch, currentAccount } from "@/lib/api";
import type { HubMembership, Proposal } from "@/lib/api-types";

type LoadedProposals = NonNullable<Awaited<ReturnType<typeof loadProposals>>>;

export default async function ProposalsPage() {
  const result = await loadProposals();

  return (
    <div className="content-width proposals-page">
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
        <ProposalGroups result={result} />
      )}
    </div>
  );
}

function ProposalGroups({ result }: { result: LoadedProposals }) {
  const groups = groupProposals(result.proposals);
  const pendingCount = result.proposals.filter(
    (proposal) => proposal.status === "PENDING",
  ).length;
  const approvedCount = result.proposals.filter(
    (proposal) => proposal.status === "APPROVED",
  ).length;
  const draftCount = result.proposals.filter(
    (proposal) => proposal.status === "DRAFT",
  ).length;

  return (
    <>
      <section className="proposal-overview" aria-label="Resumo das propostas">
        <div>
          <span className="proposal-overview-value">
            {result.proposals.length}
          </span>
          <span className="proposal-overview-label">Total</span>
        </div>
        <div>
          <span className="proposal-overview-value">{pendingCount}</span>
          <span className="proposal-overview-label">Em avaliação</span>
        </div>
        <div>
          <span className="proposal-overview-value">{draftCount}</span>
          <span className="proposal-overview-label">Rascunhos</span>
        </div>
        <div>
          <span className="proposal-overview-value">{approvedCount}</span>
          <span className="proposal-overview-label">Aprovadas</span>
        </div>
      </section>

      <div className="proposal-groups">
        {groups.map((group) => (
          <section
            className={
              "proposal-group proposal-group--" + group.status.toLowerCase()
            }
            key={group.status}
            aria-labelledby={"proposal-group-" + group.status.toLowerCase()}
          >
            <header className="proposal-group-heading">
              <div>
                <div className="proposal-group-title-row">
                  <span className="proposal-group-marker" aria-hidden="true" />
                  <h2 id={"proposal-group-" + group.status.toLowerCase()}>
                    {group.title}
                  </h2>
                </div>
                <p>{group.description}</p>
              </div>
              <span className="proposal-group-count">
                {group.proposals.length}{" "}
                {group.proposals.length === 1 ? "proposta" : "propostas"}
              </span>
            </header>

            <div className="proposal-list">
              {group.proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  accountId={result.account.id}
                  canManage={result.hubs.some(
                    (hub) =>
                      hub.hubId === proposal.hubId &&
                      (hub.role === "MASTER" || hub.role === "ADMIN"),
                  )}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ProposalCard({
  proposal,
  accountId,
  canManage,
}: {
  proposal: Proposal;
  accountId: string;
  canManage: boolean;
}) {
  const isOwner = proposal.authorId === accountId;
  const isPendingReview = proposal.status === "PENDING" && canManage;
  const isDraft = proposal.status === "DRAFT" && isOwner;
  const decisionReason = proposal.decisionReason?.trim();
  const problem = proposal.content.problem?.trim();
  const decisionLabel =
    proposal.status === "REJECTED"
      ? "Motivo da rejeição"
      : proposal.status === "WITHDRAWN"
        ? "Motivo da retirada"
        : undefined;

  return (
    <article className="proposal-card">
      <div className="proposal-card-heading">
        <div>
          <h3>{proposal.content.title}</h3>
          <div className="proposal-card-meta">
            <span>Por {proposal.authorName}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={proposal.createdAt}>
              {formatProposalDate(proposal.createdAt)}
            </time>
          </div>
        </div>
        <span
          className={
            "proposal-status proposal-status--" + proposal.status.toLowerCase()
          }
        >
          {proposalStatusText(proposal.status)}
        </span>
      </div>

      <p className="proposal-card-summary">{proposal.content.summary}</p>

      {problem && (
        <div className="proposal-detail">
          <span>Problema</span>
          <p>{problem}</p>
        </div>
      )}

      {proposal.content.desiredSkills.length > 0 && (
        <ul className="proposal-tags" aria-label="Habilidades desejadas">
          {proposal.content.desiredSkills.map((skill) => (
            <li className="tag" key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      )}

      {decisionReason && decisionLabel && (
        <div className="proposal-reason">
          <span>{decisionLabel}</span>
          <p>{decisionReason}</p>
        </div>
      )}

      {(isDraft || isPendingReview) && (
        <div className="proposal-card-footer">
          {isDraft && (
            <MutationButton
              endpoint={"/api/backend/v1/proposals/" + proposal.id + "/submit"}
              variant="primary"
            >
              Enviar para avaliação
            </MutationButton>
          )}
          {isPendingReview && (
            <details className="proposal-review">
              <summary>Revisar proposta</summary>
              <div className="proposal-review-body">
                <p>Escolha uma decisão para esta ideia.</p>
                <div className="proposal-review-actions">
                  <MutationButton
                    endpoint={
                      "/api/backend/v1/proposals/" + proposal.id + "/approve"
                    }
                    variant="primary"
                  >
                    Aprovar e criar projeto
                  </MutationButton>
                  <DecisionForm
                    endpoint={
                      "/api/backend/v1/proposals/" + proposal.id + "/reject"
                    }
                    payloadKey="reason"
                    label="Rejeitar"
                    placeholder="Descreva o motivo da rejeição"
                  />
                </div>
              </div>
            </details>
          )}
        </div>
      )}
    </article>
  );
}

function proposalStatusText(status: Proposal["status"]) {
  return {
    DRAFT: "Rascunho",
    PENDING: "Em avaliação",
    APPROVED: "Aprovada",
    REJECTED: "Rejeitada",
    WITHDRAWN: "Retirada",
  }[status];
}

function formatProposalDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não disponível";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

async function loadProposals() {
  try {
    const hubs = await backendFetch<HubMembership[]>("/api/v1/hubs", {
      authenticated: true,
    });
    const [groups, account] = await Promise.all([
      Promise.all(
        hubs.map((hub) =>
          backendFetch<Proposal[]>(
            ("/api/v1/hubs/" + hub.hubId + "/proposals") as `/api/v1/${string}`,
            { authenticated: true },
          ),
        ),
      ),
      currentAccount(),
    ]);
    return { hubs, account, proposals: groups.flat() };
  } catch {
    return undefined;
  }
}
