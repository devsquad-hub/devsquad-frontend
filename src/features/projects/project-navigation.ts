import type { ViewerCapabilities } from "@/lib/capabilities";

export type ProjectNavigationItem = {
  label: string;
  href: string;
};

export function projectNavigation(
  projectId: string,
  capabilities: ViewerCapabilities,
): ProjectNavigationItem[] {
  const root = `/app/projects/${projectId}`;
  const items = [
    { label: "Visão geral", href: root },
    { label: "Quadro", href: `${root}/board` },
    { label: "Recrutamento", href: `${root}/recruitment` },
    { label: "Membros", href: `${root}/members` },
    { label: "Atividade", href: `${root}/activity` },
  ];

  return capabilities.manageProject
    ? [...items, { label: "Configurações", href: `${root}/settings` }]
    : items;
}
