"use client";

import {
  BellIcon,
  CommentDiscussionIcon,
  HomeIcon,
  InboxIcon,
  PeopleIcon,
  PersonIcon,
} from "@primer/octicons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/app", label: "Visão geral", icon: HomeIcon },
  { href: "/app/applications", label: "Candidaturas", icon: InboxIcon },
  { href: "/app/invitations", label: "Convites", icon: PeopleIcon },
  { href: "/app/proposals", label: "Propostas", icon: CommentDiscussionIcon },
  { href: "/app/notifications", label: "Notificações", icon: BellIcon },
  { href: "/app/profile", label: "Perfil", icon: PersonIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="app-sidebar" aria-label="Navegação do painel">
      <nav>
        {navigation.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/app" && pathname.startsWith(`${href}/`));
          return (
            <Link
              className={`nav-link${active ? " is-active" : ""}`}
              href={href}
              aria-current={active ? "page" : undefined}
              key={href}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
