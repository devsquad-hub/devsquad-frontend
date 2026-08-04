import {
  BellIcon,
  CommentDiscussionIcon,
  HomeIcon,
  InboxIcon,
  PeopleIcon,
  PersonIcon,
} from "@primer/octicons-react";
import Link from "next/link";

const navigation = [
  { href: "/app", label: "Visão geral", icon: HomeIcon },
  { href: "/app/applications", label: "Candidaturas", icon: InboxIcon },
  { href: "/app/invitations", label: "Convites", icon: PeopleIcon },
  { href: "/app/proposals", label: "Propostas", icon: CommentDiscussionIcon },
  { href: "/app/notifications", label: "Notificações", icon: BellIcon },
  { href: "/app/profile", label: "Perfil", icon: PersonIcon },
];

export function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Navegação do painel">
      <nav>
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link className="nav-link" href={href} key={href}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
