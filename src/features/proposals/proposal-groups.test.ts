import { describe, expect, it } from "vitest";
import { groupProposals } from "./proposal-groups";
import type { Proposal } from "@/lib/api-types";

const proposal = (status: Proposal["status"], id: string): Proposal => ({
  id,
  hubId: "hub-1",
  authorId: "account-1",
  authorName: "Ana Costa",
  content: {
    title: id,
    summary: "Resumo da proposta",
    desiredSkills: [],
  },
  status,
  decisionReason: null,
  projectId: null,
  createdAt: "2026-08-01T12:00:00Z",
  updatedAt: "2026-08-01T12:00:00Z",
});

describe("groupProposals", () => {
  it("organiza propostas por etapa e omite etapas vazias", () => {
    const groups = groupProposals([
      proposal("APPROVED", "approved"),
      proposal("PENDING", "pending"),
      proposal("PENDING", "pending-2"),
    ]);

    expect(groups.map((group) => group.status)).toEqual([
      "PENDING",
      "APPROVED",
    ]);
    expect(groups[0]?.proposals).toHaveLength(2);
    expect(groups[1]?.proposals[0]?.id).toBe("approved");
  });
});
