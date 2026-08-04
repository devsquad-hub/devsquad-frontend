export type ProposalPayload = {
  title: string;
  summary: string;
  problem: string;
  proposedSolution: string;
  goals: string;
  desiredSkills: string[];
};

export function proposalPayload(form: FormData): ProposalPayload {
  return {
    title: text(form, "title"),
    summary: text(form, "summary"),
    problem: text(form, "problem"),
    proposedSolution: text(form, "solution"),
    goals: text(form, "expectedImpact"),
    desiredSkills: [
      ...new Set(
        text(form, "tags")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ],
  };
}

function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}
