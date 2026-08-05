import { describe, expect, it } from "vitest";
import {
  authErrorMessage,
  authPresentationState,
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
});

describe("signInScreenState", () => {
  it("pede para reiniciar uma sessão pendente em vez de tentar outro login", () => {
    expect(signInScreenState("pending")).toBe("restart-session");
  });
});
