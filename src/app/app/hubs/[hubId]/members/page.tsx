import { PeopleIcon } from "@primer/octicons-react";
import { Avatar, Label } from "@primer/react";
import { PageHeading } from "@/components/page-heading";
import { HubRoleForm } from "@/components/hub-role-form";
import { ProjectAdminForm } from "@/components/project-admin-form";
import { backendFetch } from "@/lib/api";
import type { HubMember, HubMembership, Project } from "@/lib/api-types";

export default async function HubMembersPage({
  params,
}: {
  params: Promise<{ hubId: string }>;
}) {
  const { hubId } = await params;
  const [members, hubs, projects] = await Promise.all([
    backendFetch<HubMember[]>(`/api/v1/hubs/${hubId}/members`, {
      authenticated: true,
    }).catch(() => []),
    backendFetch<HubMembership[]>("/api/v1/hubs", { authenticated: true }),
    backendFetch<Project[]>(`/api/v1/public/hubs/${hubId}/projects`),
  ]);
  const membership = hubs.find((hub) => hub.hubId === hubId);
  const isMaster = membership?.role === "MASTER";
  const canAssignProjectAdmin = isMaster || membership?.role === "ADMIN";
  return (
    <div className="content-width">
      <PageHeading
        title="Membros do hub"
        description="Papéis e participantes ativos na comunidade."
      />
      {members.length === 0 ? (
        <div className="empty-state list-panel">
          <PeopleIcon size={24} />
          <h2>Nenhum membro encontrado</h2>
          <p>Confira se o hub existe e se você possui acesso.</p>
        </div>
      ) : (
        <div className="list-panel">
          {members.map((member) => (
            <article className="list-row" key={member.accountId}>
              <div className="project-meta">
                <Avatar src={member.avatarUrl ?? ""} alt="" size={32} />
                <div>
                  <strong>{member.displayName}</strong>
                  {member.email && <div className="muted">{member.email}</div>}
                </div>
                <Label>{member.role}</Label>
              </div>
              {isMaster && member.role !== "MASTER" && (
                <HubRoleForm
                  hubId={hubId}
                  accountId={member.accountId}
                  currentRole={member.role}
                />
              )}
              {canAssignProjectAdmin && (
                <ProjectAdminForm
                  accountId={member.accountId}
                  projects={projects}
                />
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
