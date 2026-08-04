export type ViewerCapabilities = {
  manageHub: boolean;
  reviewProposals: boolean;
  manageProject: boolean;
  manageRecruitment: boolean;
  manageBoard: boolean;
  apply: boolean;
};

export const emptyCapabilities: ViewerCapabilities = {
  manageHub: false,
  reviewProposals: false,
  manageProject: false,
  manageRecruitment: false,
  manageBoard: false,
  apply: false,
};

export function canAccessProjectSettings(
  capabilities: ViewerCapabilities,
): boolean {
  return capabilities.manageProject;
}
