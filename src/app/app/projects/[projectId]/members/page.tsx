import { Avatar, Label } from "@primer/react";
import { PeopleIcon } from "@primer/octicons-react";
import { LoadError } from "@/components/load-error";
import { PageHeading } from "@/components/page-heading";
import { InvitationForm } from "@/components/invitation-form";
import { backendFetch } from "@/lib/api";
import type { HubMember, Project } from "@/lib/api-types";
import { roleLabel } from "@/lib/labels";

export default async function ProjectMembersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let project: Project;
  try {
    project = await backendFetch<Project>(`/api/v1/projects/${projectId}`, {
      authenticated: true,
    });
  } catch {
    return <LoadError retryHref={`/app/projects/${projectId}/members`} />;
  }
  let hubMembers: HubMember[] = [];
  if (project.viewerCapabilities?.manageRecruitment) {
    try {
      hubMembers = await backendFetch<HubMember[]>(
        `/api/v1/hubs/${project.hubId}/members`,
        { authenticated: true },
      );
    } catch {
      return <LoadError retryHref={`/app/projects/${projectId}/members`} />;
    }
  }
  const projectMemberIds = new Set(
    project.members.map((member) => member.accountId),
  );
  const candidates = hubMembers.filter(
    (member) => !projectMemberIds.has(member.accountId),
  );
  return (
    <div>
      <PageHeading
        title="Membros"
        description="Pessoas e responsabilidades na equipe."
      />
      {project.viewerCapabilities?.manageRecruitment && (
        <InvitationForm projectId={projectId} candidates={candidates} />
      )}
      {project.members.length === 0 ? (
        <div className="empty-state list-panel">
          <PeopleIcon size={24} />
          <h2>Equipe em formação</h2>
          <p>Abra posições ou envie convites para formar a equipe.</p>
        </div>
      ) : (
        <div className="list-panel">
          {project.members.map((member) => (
            <article className="list-row" key={member.accountId}>
              <div className="project-meta">
                <Avatar src={member.avatarUrl ?? ""} alt="" size={32} />
                <div>
                  <strong>{member.displayName}</strong>
                  <div className="muted">
                    {member.functionalRole || "Sem função definida"}
                  </div>
                </div>
                <Label>{roleLabel(member.role)}</Label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
