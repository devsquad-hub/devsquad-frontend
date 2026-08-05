import { describe, expect, it } from "vitest";
import {
  authErrorMessage,
  authPresentationState,
  pendingSessionSignOutOptions,
  pendingSessionId,
  signInScreenState,
  signInNextStep,
} from "./auth-flow";

describe("signInNextStep", () => {
  it("solicita confirmação do dispositivo quando o Clerk exige client trust", () => {
    expect(signInNextStep("needs_client_trust")).toBe("client-trust");
  });

  it("preserva os fluxos de sessão concluída e segunda etapa", () => {
    expect(signInNextStep("complete")).toBe("complete");
    expect(signInNextStep("needs_second_factor")).toBe("second-factor");
  });
});

describe("authErrorMessage", () => {
  it("traduz erros conhecidos do Clerk sem expor a mensagem original", () => {
    expect(
      authErrorMessage({
        errors: [
          {
            code: "form_password_incorrect",
            longMessage: "Password is incorrect.",
          },
        ],
      }),
    ).toBe("E-mail ou senha incorretos.");
  });

  it("não exibe mensagens técnicas ou em inglês para erros desconhecidos", () => {
    expect(authErrorMessage(new Error("Unexpected backend failure"))).toBe(
      "Não foi possível concluir a autenticação. Tente novamente.",
    );
  });
});

describe("authPresentationState", () => {
  it("não apresenta uma sessão pendente como conta visitante", () => {
    expect(
      authPresentationState({
        isAuthLoaded: true,
        isUserLoaded: true,
        isSignedIn: false,
        hasUser: true,
      }),
    ).toBe("pending");
  });

  it("reconhece a sessão pendente mesmo quando Clerk marca o usuário como desconectado", () => {
    expect(
      authPresentationState({
        isAuthLoaded: true,
        isUserLoaded: true,
        isSignedIn: false,
        hasUser: false,
        hasPendingSession: true,
      }),
    ).toBe("pending");
  });
});

describe("pendingSessionId", () => {
  it("retorna o ID somente de uma sessão pendente", () => {
    expect(pendingSessionId({ id: "sess_pending", status: "pending" })).toBe(
      "sess_pending",
    );
    expect(pendingSessionId({ id: "sess_active", status: "active" })).toBe(
      undefined,
    );
  });
});

describe("pendingSessionSignOutOptions", () => {
  it("mantém o redirecionamento e usa o ID quando ele existe", () => {
    expect(
      pendingSessionSignOutOptions(
        "sess_pending",
        "/sign-in?redirect_url=%2Fapp",
      ),
    ).toEqual({
      sessionId: "sess_pending",
      redirectUrl: "/sign-in?redirect_url=%2Fapp",
    });
  });

  it("faz logout padrão quando o ID ainda não está disponível", () => {
    expect(
      pendingSessionSignOutOptions(undefined, "/sign-in?redirect_url=%2Fapp"),
    ).toEqual({ redirectUrl: "/sign-in?redirect_url=%2Fapp" });
  });
});

describe("signInScreenState", () => {
  it("pede para reiniciar uma sessão pendente em vez de tentar outro login", () => {
    expect(signInScreenState("pending")).toBe("restart-session");
  });

  it("mantém o formulário quando a própria autenticação aguarda confirmação", () => {
    expect(signInScreenState("pending", "client-trust")).toBe("form");
    expect(signInScreenState("pending", "verification")).toBe("form");
  });
});
