import { BellIcon } from "@primer/octicons-react";
import { PageHeading } from "@/components/page-heading";
import { MutationButton } from "@/components/resource-actions";
import { backendFetch } from "@/lib/api";

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
};

export default async function NotificationsPage() {
  const notifications = await backendFetch<Notification[]>(
    "/api/v1/notifications",
    { authenticated: true },
  ).catch(() => []);
  return (
    <div className="content-width">
      <PageHeading
        title="Notificações"
        description="Atualizações dos seus projetos e processos seletivos."
      />
      {notifications.length === 0 ? (
        <div className="empty-state list-panel">
          <BellIcon size={24} />
          <h2>Tudo em dia</h2>
          <p>Novas decisões, comentários e convites aparecerão aqui.</p>
        </div>
      ) : (
        <div className="list-panel">
          {notifications.map((item) => (
            <article className="list-row" key={item.id}>
              <strong>{item.title}</strong>
              <p className="section-description">{item.body}</p>
              <time className="muted" dateTime={item.createdAt}>
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(item.createdAt),
                )}
              </time>
              {!item.readAt && (
                <MutationButton
                  endpoint={`/api/backend/v1/notifications/${item.id}/read`}
                >
                  Marcar como lida
                </MutationButton>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
