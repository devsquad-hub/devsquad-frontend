"use client";

import { Label, LinkButton } from "@primer/react";
import { InboxIcon, PeopleIcon, ProjectIcon } from "@primer/octicons-react";
import Link from "next/link";
import type { Account, Project } from "@/lib/api-types";
import { projectStatusLabel } from "@/lib/labels";
import { PageHeading } from "./page-heading";

export function DashboardView({
  account,
  projects,
  openApplications,
  pendingInvitations,
}: {
  account: Account;
  projects: Project[];
  openApplications: number;
  pendingInvitations: number;
}) {
  return (
    <div className="content-width">
      <PageHeading
        title={`Olá, ${account.displayName}`}
        description="Acompanhe seus projetos, candidaturas e próximos passos."
        action={
          <LinkButton href="/app/proposals/new" variant="primary">
            Nova proposta
          </LinkButton>
        }
      />
      <div className="dashboard-grid" aria-label="Resumo da conta">
        <div className="summary-box">
          <ProjectIcon />
          <span className="summary-value">{projects.length}</span>
          <span className="muted">Projetos</span>
        </div>
        <div className="summary-box">
          <InboxIcon />
          <span className="summary-value">{openApplications}</span>
          <span className="muted">Candidaturas abertas</span>
        </div>
        <div className="summary-box">
          <PeopleIcon />
          <span className="summary-value">{pendingInvitations}</span>
          <span className="muted">Convites pendentes</span>
        </div>
      </div>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Seus projetos</h2>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state list-panel">
            <ProjectIcon size={24} />
            <h2>Nenhum projeto por aqui</h2>
            <p>Proponha uma ideia ou candidate-se a uma posição aberta.</p>
          </div>
        ) : (
          <div className="list-panel">
            {projects.map((project) => (
              <article className="list-row" key={project.id}>
                <div className="section-header">
                  <div>
                    <Link
                      className="row-title"
                      href={`/app/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                    <p className="section-description">{project.summary}</p>
                  </div>
                  <Label
                    variant={
                      project.status === "ACTIVE" ? "success" : "secondary"
                    }
                  >
                    {projectStatusLabel(project.status)}
                  </Label>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
