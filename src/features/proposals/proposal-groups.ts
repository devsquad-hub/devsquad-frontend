import type { Proposal } from "@/lib/api-types";

const proposalStages = [
  {
    status: "PENDING",
    title: "Em avaliação",
    description: "Aguardando uma decisão da administração do hub.",
  },
  {
    status: "DRAFT",
    title: "Rascunhos",
    description: "Ideias que ainda podem ser revisadas antes do envio.",
  },
  {
    status: "APPROVED",
    title: "Aprovadas",
    description: "Ideias que já foram aceitas e podem virar projetos.",
  },
  {
    status: "REJECTED",
    title: "Rejeitadas",
    description: "Ideias que não seguiram para a próxima etapa.",
  },
  {
    status: "WITHDRAWN",
    title: "Retiradas",
    description: "Ideias retiradas antes de uma decisão final.",
  },
] as const satisfies ReadonlyArray<{
  status: Proposal["status"];
  title: string;
  description: string;
}>;

export type ProposalGroup = (typeof proposalStages)[number] & {
  proposals: Proposal[];
};

export function groupProposals(proposals: Proposal[]): ProposalGroup[] {
  return proposalStages
    .map((stage) => ({
      ...stage,
      proposals: proposals.filter(
        (proposal) => proposal.status === stage.status,
      ),
    }))
    .filter((stage) => stage.proposals.length > 0);
}
