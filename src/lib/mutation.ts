import { backendUnavailableProblem } from "./backend-failure";
import type { ProblemDetail } from "./problem";

export class MutationError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.detail);
  }
}

export async function requestMutation(
  endpoint: string,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetch(endpoint, init);
  } catch (error) {
    throw new MutationError(backendUnavailableProblem(error));
  }
}

export function mutationErrorMessage(error: unknown): string {
  if (error instanceof MutationError) return problemMessage(error.problem);
  if (isProblem(error)) return problemMessage(error);
  if (hasDetail(error)) return error.detail;
  return "Não foi possível concluir a operação. Tente novamente.";
}

const problemMessages: Record<string, string> = {
  authentication_required: "Entre para continuar.",
  account_not_synchronized:
    "Sua conta ainda está sendo preparada. Tente novamente em instantes.",
  account_not_found: "Não encontramos sua conta ativa.",
  project_not_found: "Não encontramos este projeto.",
  profile_not_found: "Não encontramos este perfil.",
  task_not_found: "Não encontramos esta tarefa.",
  label_not_found: "Não encontramos este rótulo no projeto.",
  position_not_found: "Não encontramos esta posição no projeto.",
  recruitment_round_not_found: "Não encontramos esta etapa de recrutamento.",
  proposal_not_found: "Não encontramos esta proposta.",
  attachment_not_found: "Não encontramos este anexo.",
  hub_not_found: "Não encontramos esta comunidade.",
  workflow_column_not_found: "Não encontramos esta coluna do fluxo.",
  application_not_pending: "Esta candidatura não está mais pendente.",
  proposal_not_pending: "Esta proposta não está mais pendente.",
  invitation_not_pending: "Este convite não está mais pendente.",
  application_already_decided: "Esta candidatura já recebeu uma decisão.",
  already_project_member: "Esta pessoa já participa do projeto.",
  position_full: "Esta posição já foi preenchida.",
  position_filled: "Esta posição já foi preenchida.",
  position_not_open: "Esta posição não está aberta para candidaturas.",
  stale_task_version:
    "A tarefa foi alterada por outra pessoa. Atualize e tente novamente.",
  hub_master_required:
    "Somente a pessoa responsável pela comunidade pode fazer isso.",
  project_admin_required: "Somente a administração do projeto pode fazer isso.",
  hub_manager_required:
    "Você não tem permissão para fazer isso nesta comunidade.",
  invalid_display_name: "Informe um nome para o perfil.",
  invalid_comment: "Escreva um comentário antes de enviar.",
  invalid_file_name: "Informe um nome para o arquivo.",
  invalid_label_color: "Informe uma cor válida no formato hexadecimal.",
  invalid_task_priority: "Escolha uma prioridade válida para a tarefa.",
  invalid_question_type: "Escolha um tipo de pergunta válido.",
  invalid_position_capacity: "Informe uma quantidade de vagas válida.",
  attachment_size_mismatch: "O tamanho do arquivo enviado não confere.",
  backend_unavailable:
    "Não foi possível conversar com a API. Tente novamente em instantes.",
};

function problemMessage(problem: ProblemDetail): string {
  return (
    problemMessages[problem.code] ??
    "Não foi possível concluir a operação. Tente novamente."
  );
}

function isProblem(value: unknown): value is ProblemDetail {
  return (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    typeof value.detail === "string" &&
    "code" in value &&
    typeof value.code === "string"
  );
}

function hasDetail(value: unknown): value is { detail: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    typeof value.detail === "string"
  );
}
