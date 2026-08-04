"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import { Avatar, Button, Label, LinkButton } from "@primer/react";
import {
  BriefcaseIcon,
  MarkGithubIcon,
  PeopleIcon,
} from "@primer/octicons-react";
import { ApplicationForm } from "@/components/application-form";
import type { Project, RecruitmentPosition } from "@/lib/api-types";

export function PublicProjectView({
  project,
  positions,
}: {
  project: Project;
  positions: RecruitmentPosition[];
}) {
  const progress = project.totalTasks
    ? Math.round((project.completedTasks / project.totalTasks) * 100)
    : 0;
  return (
    <main id="main-content" className="page-main">
      <header className="project-header">
        <div
          className="page-width project-title-row"
          style={{ paddingBottom: 24 }}
        >
          <div className="project-meta">
            <h1>{project.name}</h1>
            <Label>{project.status}</Label>
            <span className="muted">{project.projectKey}</span>
          </div>
          <p className="catalog-copy" style={{ fontSize: 16 }}>
            {project.summary}
          </p>
        </div>
      </header>
      <div className="page-width project-body">
        <div>
          <h2 className="section-title">Sobre o projeto</h2>
          <p
            className="catalog-copy"
            style={{ fontSize: 16, whiteSpace: "pre-wrap" }}
          >
            {project.description ||
              "A equipe ainda não publicou uma descrição detalhada."}
          </p>
          <section className="section">
            <h2 className="section-title">Equipe</h2>
            {project.members.length === 0 ? (
              <div className="empty-state list-panel">
                <PeopleIcon size={24} />
                <h2>Equipe em formação</h2>
                <p>Consulte as posições abertas para participar.</p>
              </div>
            ) : (
              <div className="list-panel">
                {project.members.map((member) => (
                  <div className="list-row" key={member.accountId}>
                    <div className="project-meta">
                      <Avatar src={member.avatarUrl ?? ""} alt="" size={32} />
                      <strong>{member.displayName}</strong>
                      <span className="muted">
                        {member.functionalRole || member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="section" id="posicoes">
            <h2 className="section-title">Posições abertas</h2>
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
                        {position.capacity - position.filled} vagas
                      </Label>
                    </div>
                    <p className="section-description">
                      {position.description}
                    </p>
                    <div className="tag-list">
                      {position.skills.map((skill) => (
                        <span className="tag" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Show when="signed-in">
                      <ApplicationForm
                        positionId={position.id}
                        questions={position.questions}
                      />
                    </Show>
                    <Show when="signed-out">
                      <SignInButton mode="modal">
                        <Button variant="primary">
                          Entrar para se candidatar
                        </Button>
                      </SignInButton>
                    </Show>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="project-aside">
          <section className="aside-section">
            <h2>Progresso</h2>
            <div className="progress-track" style={{ width: "100%" }}>
              <div
                className="progress-value"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="muted">{progress}% concluído</p>
          </section>
          <section className="aside-section">
            <h2>Tecnologias</h2>
            <div className="tag-list">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>
          {project.repositoryUrl && (
            <LinkButton
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              leadingVisual={MarkGithubIcon}
            >
              Ver repositório
            </LinkButton>
          )}
          <LinkButton href="#posicoes" variant="primary">
            Ver posições
          </LinkButton>
        </aside>
      </div>
    </main>
  );
}
