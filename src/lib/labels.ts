import type { Project } from "./api-types";

const projectStatuses: Record<Project["status"], string> = {
  PLANNING: "Planejamento",
  RECRUITING: "Recrutando",
  ACTIVE: "Em andamento",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};

const roles: Record<string, string> = {
  MASTER: "Master do hub",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

const applicationStatuses: Record<string, string> = {
  SUBMITTED: "Em análise",
  ACCEPTED: "Aprovada",
  REJECTED: "Não aprovada",
  WITHDRAWN: "Retirada",
};

const invitationStatuses: Record<string, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  DECLINED: "Recusado",
  REVOKED: "Revogado",
  EXPIRED: "Expirado",
};

const proposalStatuses: Record<string, string> = {
  DRAFT: "Rascunho",
  PENDING: "Em avaliação",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  WITHDRAWN: "Retirada",
};

const priorities: Record<string, string> = {
  NONE: "Sem prioridade",
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const events: Record<string, string> = {
  TASK_CREATED: "Tarefa criada",
  TASK_UPDATED: "Tarefa atualizada",
  TASK_MOVED: "Tarefa movida",
  TASK_COMMENTED: "Comentário adicionado",
  PROJECT_CREATED: "Projeto criado",
  PROJECT_UPDATED: "Projeto atualizado",
  PROJECT_STATUS_CHANGED: "Status do projeto alterado",
  PROPOSAL_APPROVED: "Proposta aprovada",
  PROPOSAL_REJECTED: "Proposta rejeitada",
  APPLICATION_SUBMITTED: "Candidatura enviada",
  APPLICATION_ACCEPTED: "Candidatura aprovada",
  APPLICATION_REJECTED: "Candidatura rejeitada",
  PROJECT_INVITATION: "Convite enviado",
};

export function projectStatusLabel(status: Project["status"]): string {
  return projectStatuses[status] ?? humanize(status);
}

export function roleLabel(role: string): string {
  return roles[role] ?? humanize(role);
}

export function applicationStatusLabel(status: string): string {
  return applicationStatuses[status] ?? humanize(status);
}

export function invitationStatusLabel(status: string): string {
  return invitationStatuses[status] ?? humanize(status);
}

export function proposalStatusLabel(status: string): string {
  return proposalStatuses[status] ?? humanize(status);
}

export function priorityLabel(priority: string): string {
  return priorities[priority] ?? humanize(priority);
}

export function eventLabel(eventType: string): string {
  return events[eventType] ?? humanize(eventType);
}

function humanize(value: string): string {
  const words = value.toLowerCase().replaceAll("_", " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Desconhecido";
}
