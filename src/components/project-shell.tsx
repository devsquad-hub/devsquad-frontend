"use client";

import { Label } from "@primer/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Project } from "@/lib/api-types";
import { emptyCapabilities } from "@/lib/capabilities";
import { projectNavigation } from "@/features/projects/project-navigation";
import { projectStatusLabel } from "@/lib/labels";
import { progressPercent } from "@/lib/progress";

export function ProjectShell({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navigation = projectNavigation(
    project.id,
    project.viewerCapabilities ?? emptyCapabilities,
    pathname,
  );
  const progress = progressPercent(project.completedTasks, project.totalTasks);
  return (
    <div>
      <header className="project-header">
        <div className="page-width project-title-row">
          <div className="project-meta">
            <h1>{project.name}</h1>
            <Label
              variant={project.status === "ACTIVE" ? "success" : "secondary"}
            >
              {projectStatusLabel(project.status)}
            </Label>
            <span className="muted">{project.projectKey}</span>
          </div>
          <nav className="project-tabs" aria-label="Navegação do projeto">
            {navigation.map((item) => (
              <Link
                className={`project-tab${item.active ? " is-active" : ""}`}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="page-width project-body">
        <div>{children}</div>
        <aside className="project-aside">
          <section className="aside-section">
            <h2>Sobre</h2>
            <p className="section-description">{project.summary}</p>
          </section>
          <section className="aside-section">
            <h2>Progresso</h2>
            <p className="muted">
              {project.completedTasks} de {project.totalTasks} tarefas
              concluídas
            </p>
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
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </section>
          <section className="aside-section">
            <h2>Tecnologias</h2>
            <div className="tag-list">
              {project.tags.length ? (
                project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className="muted">Nenhuma tag definida</span>
              )}
            </div>
          </section>
          <section className="aside-section">
            <h2>Equipe</h2>
            <p className="muted">
              {project.members.length} participante
              {project.members.length === 1 ? "" : "s"}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
