type ClerkErrorLike = {
  errors?: Array<{
    code?: string;
  }>;
};

export type SignInNextStep =
  "complete" | "client-trust" | "second-factor" | "unsupported";

export type AuthPresentationState =
  "loading" | "signed-out" | "pending" | "signed-in";

export function signInNextStep(status: string): SignInNextStep {
  switch (status) {
    case "complete":
      return "complete";
    case "needs_client_trust":
      return "client-trust";
    case "needs_second_factor":
      return "second-factor";
    default:
      return "unsupported";
  }
}

export function authErrorMessage(error: unknown): string {
  const code = clerkErrorCode(error);

  switch (code) {
    case "form_identifier_not_found":
    case "form_password_incorrect":
      return "E-mail ou senha incorretos.";
    case "form_code_incorrect":
      return "O código informado não é válido. Tente novamente.";
    case "form_code_expired":
      return "Este código expirou. Solicite um novo código e tente novamente.";
    case "form_param_format_invalid":
      return "Confira os dados informados e tente novamente.";
    case "form_param_nil":
      return "Preencha os campos obrigatórios para continuar.";
    case "session_exists":
      return "Esta conta já possui uma sessão ativa neste navegador.";
    default:
      return "Não foi possível concluir a autenticação. Tente novamente.";
  }
}

export function authPresentationState({
  isAuthLoaded,
  isUserLoaded,
  isSignedIn,
  hasUser,
  isSessionLoaded = true,
  hasPendingSession = false,
}: {
  isAuthLoaded: boolean;
  isUserLoaded: boolean;
  isSignedIn: boolean | undefined;
  hasUser: boolean;
  isSessionLoaded?: boolean;
  hasPendingSession?: boolean;
}): AuthPresentationState {
  if (!isAuthLoaded || !isUserLoaded || !isSessionLoaded) return "loading";
  if (hasPendingSession) return "pending";
  if (isSignedIn) return "signed-in";
  return hasUser ? "pending" : "signed-out";
}

export function pendingSessionId(
  session: { id: string; status: string } | null | undefined,
) {
  return session?.status === "pending" ? session.id : undefined;
}

export function pendingSessionSignOutOptions(
  sessionId: string | undefined,
  redirectUrl: string,
): { sessionId?: string; redirectUrl: string } {
  return sessionId ? { sessionId, redirectUrl } : { redirectUrl };
}

export function signInScreenState(
  state: AuthPresentationState,
  step: "credentials" | "verification" | "client-trust" = "credentials",
): "form" | "restart-session" {
  if (step !== "credentials") return "form";
  return state === "pending" ? "restart-session" : "form";
}

function clerkErrorCode(error: unknown): string | undefined {
  if (!isClerkError(error)) return undefined;
  return error.errors?.[0]?.code;
}

function isClerkError(value: unknown): value is ClerkErrorLike {
  return typeof value === "object" && value !== null && "errors" in value;
}
