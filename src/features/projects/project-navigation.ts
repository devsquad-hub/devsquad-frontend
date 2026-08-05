import type { ViewerCapabilities } from "@/lib/capabilities";

export type ProjectNavigationItem = {
  label: string;
  href: string;
  active: boolean;
};

export function projectNavigation(
  projectId: string,
  capabilities: ViewerCapabilities,
  pathname = "",
): ProjectNavigationItem[] {
  const root = `/app/projects/${projectId}`;
  const items = [
    { label: "Visão geral", href: root },
    { label: "Quadro", href: `${root}/board` },
    { label: "Recrutamento", href: `${root}/recruitment` },
    { label: "Membros", href: `${root}/members` },
    { label: "Atividade", href: `${root}/activity` },
  ];

  const allItems = capabilities.manageProject
    ? [...items, { label: "Configurações", href: `${root}/settings` }]
    : items;
  return allItems.map((item) => ({
    ...item,
    active:
      pathname === item.href ||
      (item.href !== root && pathname.startsWith(`${item.href}/`)),
  }));
}
