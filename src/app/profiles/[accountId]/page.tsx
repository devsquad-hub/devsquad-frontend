import { Avatar, LinkButton } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { notFound } from "next/navigation";
import { backendFetch } from "@/lib/api";
import type { Account } from "@/lib/api-types";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const account = await backendFetch<Account>(
    `/api/v1/public/profiles/${accountId}`,
  ).catch(() => null);
  if (!account) notFound();
  return (
    <main id="main-content" className="page-main">
      <div className="page-width project-body">
        <div>
          <div className="project-meta">
            <Avatar src={account.avatarUrl ?? ""} alt="" size={64} />
            <div>
              <h1 className="section-title">{account.displayName}</h1>
              <p className="muted">Perfil público</p>
            </div>
          </div>
          <p
            className="catalog-copy"
            style={{ fontSize: 16, whiteSpace: "pre-wrap" }}
          >
            {account.bio || "Este membro ainda não adicionou uma biografia."}
          </p>
          <section className="section">
            <h2 className="section-title">Habilidades</h2>
            <div className="tag-list" style={{ marginTop: 16 }}>
              {account.skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
        <aside className="project-aside">
          <section className="aside-section">
            <h2>Disponibilidade</h2>
            <p className="muted">
              {account.availabilityHours
                ? `${account.availabilityHours} horas por semana`
                : "Não informada"}
            </p>
          </section>
          {account.githubUrl && (
            <LinkButton href={account.githubUrl} leadingVisual={MarkGithubIcon}>
              GitHub
            </LinkButton>
          )}
          {account.portfolioUrl && (
            <LinkButton href={account.portfolioUrl}>Portfólio</LinkButton>
          )}
        </aside>
      </div>
    </main>
  );
}
