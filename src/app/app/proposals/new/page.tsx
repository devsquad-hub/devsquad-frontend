import { CommentDiscussionIcon } from "@primer/octicons-react";
import { PageHeading } from "@/components/page-heading";
import { ProposalForm } from "@/components/proposal-form";
import { backendFetch } from "@/lib/api";
import type { HubMembership } from "@/lib/api-types";

export default async function NewProposalPage() {
  const hubs = await backendFetch<HubMembership[]>("/api/v1/hubs", {
    authenticated: true,
  }).catch(() => []);
  const hub = hubs[0];
  return (
    <div className="content-width">
      <PageHeading
        title="Nova proposta"
        description="Estruture a ideia para que a comunidade consiga avaliá-la."
      />
      {hub ? (
        <ProposalForm hubId={hub.hubId} />
      ) : (
        <div className="empty-state list-panel">
          <CommentDiscussionIcon size={24} />
          <h2>Você ainda não participa de um hub</h2>
          <p>
            A associação ao hub inicial acontece automaticamente após a
            sincronização do Clerk.
          </p>
        </div>
      )}
    </div>
  );
}
