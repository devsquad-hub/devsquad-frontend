"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import { Avatar, Button, Label, LinkButton } from "@primer/react";
import {
  BriefcaseIcon,
  MarkGithubIcon,
  PeopleIcon,
} from "@primer/octicons-react";
import Link from "next/link";
import { ApplicationForm } from "@/components/application-form";
import { LoadError } from "@/components/load-error";
import type { Hub, Project, RecruitmentPosition } from "@/lib/api-types";
import { projectStatusLabel, roleLabel } from "@/lib/labels";
import { groupProjectMembers } from "@/features/projects/project-hierarchy";
import { progressPercent } from "@/lib/progress";

export function PublicProjectView({
  hub,
  project,
  positions,
  positionsUnavailable = false,
}: {
  hub: Pick<Hub, "name" | "slug">;
  project: Project;
  positions: RecruitmentPosition[];
  positionsUnavailable?: boolean;
}) {
  const progress = progressPercent(project.completedTasks, project.totalTasks);
  const memberGroups = groupProjectMembers(project.members);

  return (
    <main id="main-content" className="page-main">
      <header className="project-header">
        <div className="page-width project-title-row">
          <nav className="breadcrumb" aria-label="Caminho do projeto">
            <Link href="/#projetos">{hub.name}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.name}</span>
          </nav>
          <div className="project-identity">
            <div className="project-meta">
              <h1>{project.name}</h1>
              <Label
                variant={project.status === "ACTIVE" ? "success" : "secondary"}
              >
                {projectStatusLabel(project.status)}
              </Label>
              <span className="muted">{project.projectKey}</span>
            </div>
            <p className="catalog-copy project-summary">{project.summary}</p>
          </div>
          <nav className="project-section-nav" aria-label="Seções do projeto">
            <a href="#overview">Visão geral</a>
            <a href="#team">Equipe</a>
            <a href="#recruitment">Recrutamento</a>
          </nav>
        </div>
      </header>

      <div className="page-width project-body">
        <div className="project-main-content">
          <section className="project-section" id="overview">
            <div className="section-heading-block">
              <p className="eyebrow">Visão geral</p>
              <h2 className="section-title">Sobre o projeto</h2>
            </div>
            <p className="catalog-copy project-description">
              {project.description ||
                "A equipe ainda não publicou uma descrição detalhada."}
            </p>
          </section>

          <section className="project-section" id="team">
            <div className="section-heading-block">
              <p className="eyebrow">Pessoas</p>
              <div className="section-heading-line">
                <h2 className="section-title">Equipe</h2>
                <span className="muted">
                  {project.members.length} participante
                  {project.members.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {project.members.length === 0 ? (
              <div className="empty-state list-panel">
                <PeopleIcon size={24} />
                <h2>Equipe em formação</h2>
                <p>Consulte as posições abertas para participar.</p>
              </div>
            ) : (
              <div className="member-groups">
                {memberGroups.map((group) => (
                  <section className="member-group" key={group.role}>
                    <div className="member-group-heading">
                      <h3>{roleLabel(group.role)}</h3>
                      <span className="muted">
                        {group.members.length} pessoa
                        {group.members.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="list-panel">
                      {group.members.map((member) => (
                        <div
                          className="list-row member-row"
                          key={member.accountId}
                        >
                          {member.avatarUrl ? (
                            <Avatar
                              src={member.avatarUrl}
                              alt={member.displayName}
                              size={36}
                            />
                          ) : (
                            <span
                              className="avatar-fallback"
                              aria-label={member.displayName}
                            >
                              {initials(member.displayName)}
                            </span>
                          )}
                          <div>
                            <strong>{member.displayName}</strong>
                            <span className="muted member-role">
                              {member.functionalRole || roleLabel(member.role)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>

          <section className="project-section" id="recruitment">
            <div className="section-heading-block">
              <p className="eyebrow">Contribua</p>
              <div className="section-heading-line">
                <h2 className="section-title">Posições abertas</h2>
                <span className="muted">
                  {positions.length} posição
                  {positions.length === 1 ? "" : "ões"}
                </span>
              </div>
            </div>
            {positionsUnavailable ? (
              <LoadError
                title="Recrutamento temporariamente indisponível"
                description="Não foi possível carregar as posições deste projeto."
              />
            ) : positions.length === 0 ? (
              <div className="empty-state list-panel">
                <BriefcaseIcon size={24} />
                <h2>Nenhuma posição aberta</h2>
                <p>A equipe publicará novas oportunidades por aqui.</p>
              </div>
            ) : (
              <div className="position-list">
                {positions.map((position) => (
                  <article className="position-card" key={position.id}>
                    <div className="position-card-heading">
                      <div>
                        <h3>{position.title}</h3>
                        <p className="muted">{position.roundName}</p>
                      </div>
                      <Label variant="success">
                        {position.capacity - position.filled} vaga
                        {position.capacity - position.filled === 1 ? "" : "s"}
                      </Label>
                    </div>
                    <p className="section-description">
                      {position.description ||
                        "Contribua para este projeto da comunidade."}
                    </p>
                    <div className="tag-list">
                      {position.skills.map((skill) => (
                        <span className="tag" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <details className="application-disclosure">
                      <summary>Quero me candidatar</summary>
                      <div className="application-panel">
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
                      </div>
                    </details>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="project-aside">
          <section className="aside-section">
            <h2>Progresso</h2>
            <div
              className="progress-track progress-track-wide"
              role="progressbar"
              aria-label={`Progresso: ${progress}% concluído`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
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
              {project.tags.length > 0 ? (
                project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className="muted">Nenhuma tecnologia definida</span>
              )}
            </div>
          </section>
          <section className="aside-section">
            <h2>Neste projeto</h2>
            <nav className="aside-nav" aria-label="Índice do projeto">
              <a href="#overview">Sobre o projeto</a>
              <a href="#team">Equipe</a>
              <a href="#recruitment">Posições abertas</a>
            </nav>
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
          <LinkButton href="#recruitment" variant="primary">
            Ver posições
          </LinkButton>
        </aside>
      </div>
    </main>
  );
}

function initials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
