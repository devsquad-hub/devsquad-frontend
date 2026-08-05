"use client";

import { Label, LinkButton } from "@primer/react";
import { CodeIcon, PeopleIcon, ProjectIcon } from "@primer/octicons-react";
import Link from "next/link";
import type { Hub, Project } from "@/lib/api-types";
import { projectStatusLabel } from "@/lib/labels";
import { progressPercent } from "@/lib/progress";

type Props = {
  hubs: Hub[];
  projects: Project[];
  failedHubIds: string[];
  unavailable: boolean;
  query: string;
};

export function CatalogView({
  hubs,
  projects,
  failedHubIds,
  unavailable,
  query,
}: Props) {
  const groupedProjects = hubs
    .map((hub) => ({
      hub,
      projects: projects.filter((project) => project.hubId === hub.id),
    }))
    .filter((group) => group.projects.length > 0);
  return (
    <main id="main-content" className="page-main">
      <section className="catalog-hero">
        <div className="page-width catalog-hero-inner">
          <div>
            <h1 className="catalog-title">
              Ideias ganham equipe. Equipes entregam projetos.
            </h1>
            <p className="catalog-copy">
              Uma comunidade para propor, selecionar e construir projetos com
              papéis claros e trabalho visível.
            </p>
            <div className="project-meta hero-actions">
              <LinkButton href="#projetos" variant="primary">
                Explorar projetos
              </LinkButton>
              <LinkButton href="/sign-up">Participar da comunidade</LinkButton>
            </div>
          </div>
          <div
            className="hero-terminal"
            aria-label="Fluxo de um projeto na comunidade"
          >
            <div className="terminal-bar">devsquad / fluxo</div>
            <div className="terminal-body">
              <div className="terminal-line">
                <CodeIcon />
                <span>Ideia enviada para revisão</span>
              </div>
              <div className="terminal-line">
                <span className="terminal-status" />
                <span>Projeto aprovado e publicado</span>
              </div>
              <div className="terminal-line">
                <PeopleIcon />
                <span>Equipe formada por seleção</span>
              </div>
              <div className="terminal-line">
                <ProjectIcon />
                <span>Trabalho acompanhado no quadro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-width section" id="projetos">
        <div className="section-header">
          <div>
            <h2 className="section-title">Projetos da comunidade</h2>
            <p className="section-description">
              Acompanhe o progresso e encontre onde contribuir.
            </p>
          </div>
          <span className="muted">
            {projects.length} projeto{projects.length === 1 ? "" : "s"}
          </span>
        </div>

        {unavailable ? (
          <div className="error-state list-panel" role="status">
            <ProjectIcon size={24} />
            <h2>Catálogo temporariamente indisponível</h2>
            <p>
              Não foi possível conversar com a API. Tente novamente em alguns
              instantes.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state list-panel">
            <ProjectIcon size={24} />
            <h2>
              {query
                ? "Nenhum projeto encontrado"
                : "O primeiro projeto começa com uma proposta"}
            </h2>
            <p>
              {query
                ? "Tente buscar por outro nome, tecnologia ou descrição."
                : "Entre na comunidade, registre sua ideia e convide pessoas para construir junto."}
            </p>
          </div>
        ) : (
          <div className="project-groups">
            {groupedProjects.map(({ hub, projects: hubProjects }) => (
              <section className="project-group" key={hub.id}>
                <div className="section-header project-group-heading">
                  <div>
                    <h3>{hub.name}</h3>
                    <p className="section-description">
                      {hub.description ||
                        "Comunidade de projetos colaborativos."}
                    </p>
                  </div>
                  <span className="muted">
                    {hubProjects.length} projeto
                    {hubProjects.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="project-list">
                  {hubProjects.map((project) => {
                    const progress = progressPercent(
                      project.completedTasks,
                      project.totalTasks,
                    );
                    return (
                      <article className="project-row" key={project.id}>
                        <div className="section-header">
                          <div>
                            <Link
                              className="row-title"
                              href={`/hubs/${hub.slug}/projects/${project.slug}`}
                            >
                              {project.name}
                            </Link>
                            <p className="section-description">
                              {project.summary}
                            </p>
                          </div>
                          <Label
                            variant={
                              project.status === "ACTIVE"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {projectStatusLabel(project.status)}
                          </Label>
                        </div>
                        <div className="project-meta">
                          <span className="row-meta">{project.projectKey}</span>
                          {project.tags.map((tag) => (
                            <span className="tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                          <div
                            className="progress-track"
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
                          <span className="row-meta">
                            {project.completedTasks}/{project.totalTasks}{" "}
                            tarefas
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {failedHubIds.length > 0 && !unavailable && (
          <div className="partial-warning" role="status">
            Alguns hubs não puderam ser carregados. Os projetos disponíveis
            continuam visíveis.
          </div>
        )}
      </section>
    </main>
  );
}
