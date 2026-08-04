import { HistoryIcon } from "@primer/octicons-react";
import { PageHeading } from "@/components/page-heading";
import { backendFetch } from "@/lib/api";

type Activity = {
  id: string;
  eventType: string;
  entityType: string;
  actorName?: string | null;
  occurredAt: string;
};

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const activity = await backendFetch<Activity[]>(
    `/api/v1/projects/${projectId}/activity`,
    { authenticated: true },
  ).catch(() => []);
  return (
    <div>
      <PageHeading
        title="Atividade"
        description="Histórico das mudanças importantes no projeto."
      />
      {activity.length === 0 ? (
        <div className="empty-state list-panel">
          <HistoryIcon size={24} />
          <h2>Sem atividade registrada</h2>
          <p>Criação e movimentação de trabalho aparecerão aqui.</p>
        </div>
      ) : (
        <div className="list-panel">
          {activity.map((item) => (
            <article className="list-row" key={item.id}>
              <strong>{eventLabel(item.eventType)}</strong>
              <span className="muted">
                {item.actorName || "Sistema"} ·{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(item.occurredAt))}
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function eventLabel(event: string): string {
  return event.toLowerCase().replaceAll("_", " ");
}
