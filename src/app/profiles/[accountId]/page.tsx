import { Avatar, LinkButton } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { notFound } from "next/navigation";
import { LoadError } from "@/components/load-error";
import { backendFetch } from "@/lib/api";
import { isBackendError } from "@/lib/backend-failure";
import type { Account } from "@/lib/api-types";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  let account: Account;
  try {
    account = await backendFetch<Account>(
      `/api/v1/public/profiles/${accountId}`,
    );
  } catch (error) {
    if (isBackendError(error) && error.problem.status === 404) notFound();
    return (
      <main id="main-content" className="page-main">
        <div className="page-width">
          <LoadError retryHref={`/profiles/${accountId}`} />
        </div>
      </main>
    );
  }
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
          <p className="catalog-copy profile-bio">
            {account.bio || "Este membro ainda não adicionou uma biografia."}
          </p>
          <section className="section">
            <h2 className="section-title">Habilidades</h2>
            <div className="tag-list profile-skills">
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
