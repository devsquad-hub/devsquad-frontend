import { Label } from "@primer/react";
import { BriefcaseIcon } from "@primer/octicons-react";
import { BackendUnavailable } from "@/components/backend-unavailable";
import { PageHeading } from "@/components/page-heading";
import { RecruitmentSetupForm } from "@/components/recruitment-setup-form";
import { DecisionForm, MutationButton } from "@/components/resource-actions";
import { backendFetch } from "@/lib/api";
import type { Project, RecruitmentPosition } from "@/lib/api-types";
import { applicationStatusLabel } from "@/lib/labels";

type ProjectApplication = {
  id: string;
  applicantName: string;
  positionTitle: string;
  answersJson: string;
  status: string;
};

export default async function RecruitmentPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  let positions: RecruitmentPosition[];
  let project: Project;
  try {
    [positions, project] = await Promise.all([
      backendFetch<RecruitmentPosition[]>(
        `/api/v1/public/projects/${projectId}/recruitment-positions`,
      ),
      backendFetch<Project>(`/api/v1/projects/${projectId}`, {
        authenticated: true,
      }),
    ]);
  } catch {
    return (
      <div>
        <PageHeading
          title="Recrutamento"
          description="Posições abertas e candidaturas do projeto."
        />
        <BackendUnavailable />
      </div>
    );
  }
  const applications = project.viewerCapabilities?.manageRecruitment
    ? await backendFetch<ProjectApplication[]>(
        `/api/v1/projects/${projectId}/applications`,
        {
          authenticated: true,
        },
      )
    : [];
  return (
    <div>
      <PageHeading
        title="Recrutamento"
        description="Posições abertas e candidaturas do projeto."
      />
      {project.viewerCapabilities?.manageRecruitment && (
        <RecruitmentSetupForm projectId={projectId} />
      )}
      {positions.length === 0 ? (
        <div className="empty-state list-panel">
          <BriefcaseIcon size={24} />
          <h2>Nenhuma posição aberta</h2>
          <p>A equipe publicará novas oportunidades por aqui.</p>
        </div>
      ) : (
        <div className="list-panel">
          {positions.map((position) => (
            <article className="list-row" key={position.id}>
              <div className="section-header">
                <div>
                  <strong>{position.title}</strong>
                  <p className="muted">{position.roundName}</p>
                </div>
                <Label variant="success">
                  {position.capacity - position.filled} vaga
                  {position.capacity - position.filled === 1 ? "" : "s"}
                </Label>
              </div>
              <p className="section-description">{position.description}</p>
              <div className="tag-list">
                {position.skills.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
      {project.viewerCapabilities?.manageRecruitment && (
        <section className="section">
          <h2 className="section-title">Candidaturas recebidas</h2>
          {applications.length === 0 ? (
            <p className="muted">Nenhuma candidatura recebida.</p>
          ) : (
            <div className="list-panel">
              {applications.map((application) => (
                <article className="list-row" key={application.id}>
                  <div className="section-header">
                    <strong>{application.applicantName}</strong>
                    <Label>{applicationStatusLabel(application.status)}</Label>
                  </div>
                  <p className="muted">{application.positionTitle}</p>
                  <pre className="application-answers">
                    {application.answersJson}
                  </pre>
                  {application.status === "SUBMITTED" && (
                    <div className="form-stack">
                      <MutationButton
                        endpoint={`/api/backend/v1/applications/${application.id}/accept`}
                        variant="primary"
                      >
                        Aprovar candidatura
                      </MutationButton>
                      <DecisionForm
                        endpoint={`/api/backend/v1/applications/${application.id}/reject`}
                        payloadKey="note"
                        label="Rejeitar"
                        placeholder="Observação opcional"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
