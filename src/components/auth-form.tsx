"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

type AuthMode = "sign-in" | "sign-up";
type AuthStep = "credentials" | "verification";

export const AUTH_REDIRECT_STORAGE_KEY = "devsquad:auth-redirect";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signInState = useSignIn();
  const signUpState = useSignUp();
  const redirectUrl = useMemo(
    () => getSafeRedirect(searchParams.get("redirect_url")),
    [searchParams],
  );
  const [step, setStep] = useState<AuthStep>("credentials");
  const [identifier, setIdentifier] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const isSignUp = mode === "sign-up";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setPending(true);

    try {
      if (isSignUp && step === "verification") {
        await verifyEmail();
      } else if (isSignUp) {
        await createAccount();
      } else {
        await signIn();
      }
    } catch (caughtError) {
      setError(getAuthError(caughtError));
    } finally {
      setPending(false);
    }
  };

  const signIn = async () => {
    const { signIn: resource } = signInState;
    if (!resource) {
      throw new Error("A autenticação ainda está carregando.");
    }

    const result = await resource.password({
      identifier: identifier.trim(),
      password,
    });
    if (result.error) {
      throw result.error;
    }

    if (resource.status !== "complete") {
      throw new Error(
        resource.status === "needs_second_factor"
          ? "Esta conta exige uma segunda etapa de verificação, ainda não configurada neste formulário."
          : "Não foi possível concluir o login. Confira os dados e tente novamente.",
      );
    }

    const finalized = await resource.finalize();
    if (finalized.error) {
      throw finalized.error;
    }

    router.replace(redirectUrl);
    router.refresh();
  };

  const createAccount = async () => {
    const { signUp: resource } = signUpState;
    if (!resource) {
      throw new Error("A autenticação ainda está carregando.");
    }

    const result = await resource.password({
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      emailAddress: identifier.trim(),
      password,
    });
    if (result.error) {
      throw result.error;
    }

    if (resource.status === "complete") {
      const finalized = await resource.finalize();
      if (finalized.error) {
        throw finalized.error;
      }

      router.replace(redirectUrl);
      router.refresh();
      return;
    }

    const requiresEmailCode = resource.unverifiedFields.some(
      (field) => String(field) === "email_address",
    );
    if (resource.status === "missing_requirements" && requiresEmailCode) {
      const verification = await resource.verifications.sendEmailCode();
      if (verification.error) {
        throw verification.error;
      }

      setStep("verification");
      return;
    }

    throw new Error(
      "O cadastro precisa de mais informações antes de criar a sessão.",
    );
  };

  const verifyEmail = async () => {
    const { signUp: resource } = signUpState;
    if (!resource) {
      throw new Error("A autenticação ainda está carregando.");
    }

    const result = await resource.verifications.verifyEmailCode({
      code: verificationCode.trim(),
    });
    if (result.error) {
      throw result.error;
    }

    if (resource.status !== "complete") {
      throw new Error("O código ainda não concluiu o cadastro.");
    }

    const finalized = await resource.finalize();
    if (finalized.error) {
      throw finalized.error;
    }

    router.replace(redirectUrl);
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setError(undefined);
    setGooglePending(true);

    try {
      const resource = isSignUp ? signUpState.signUp : signInState.signIn;
      if (!resource) {
        throw new Error("A autenticação ainda está carregando.");
      }

      try {
        window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirectUrl);
      } catch {
        // Session storage can be unavailable in hardened browser contexts.
        // Clerk still receives the safe redirect in the OAuth request.
      }

      const result = await resource.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl,
        ...(isSignUp && firstName.trim()
          ? { firstName: firstName.trim() }
          : {}),
        ...(isSignUp && lastName.trim() ? { lastName: lastName.trim() } : {}),
      });
      if (result.error) {
        throw result.error;
      }
    } catch (caughtError) {
      setGooglePending(false);
      setError(getAuthError(caughtError));
    }
  };

  const heading =
    isSignUp && step === "verification"
      ? "Confirme seu e-mail"
      : isSignUp
        ? "Entre para construir junto"
        : "Volte para o trabalho";
  const description =
    isSignUp && step === "verification"
      ? `Enviamos um código para ${identifier}.`
      : isSignUp
        ? "Crie seu perfil e encontre projetos que precisam das suas habilidades."
        : "Acesse seu painel, acompanhe candidaturas e mantenha seus projetos em movimento.";

  return (
    <section className="auth-layout" aria-labelledby="auth-heading">
      <div className="auth-story">
        <Image
          className="auth-story-logo"
          src="/devsquad_logo.svg"
          alt=""
          aria-hidden="true"
          width={190}
          height={101}
          priority
        />
        <p className="eyebrow">Comunidade de construção</p>
        <h1>Projetos melhores começam com pessoas alinhadas.</h1>
        <p>
          Organize ideias, forme equipes e acompanhe cada entrega com uma
          comunidade que trabalha de forma aberta.
        </p>
        <div className="auth-story-note">
          <span className="auth-story-dot" aria-hidden="true" />
          <span>Um espaço para quem quer contribuir de verdade.</span>
        </div>
      </div>

      <div className="auth-card">
        <Link className="auth-back-link" href={redirectUrl}>
          ← Voltar para a comunidade
        </Link>
        <div className="auth-card-heading">
          <span className="auth-card-kicker">DevSquad</span>
          <h2 id="auth-heading">{heading}</h2>
          <p>{description}</p>
        </div>

        {step === "credentials" && (
          <>
            <button
              className="auth-google-button"
              type="button"
              onClick={() => void signInWithGoogle()}
              disabled={pending || googlePending}
            >
              <GoogleMark />
              {googlePending ? "Abrindo Google…" : "Continuar com Google"}
            </button>
            <div className="auth-divider" aria-hidden="true">
              <span>ou continue com e-mail</span>
            </div>
          </>
        )}

        <form
          className="form-stack auth-form"
          onSubmit={submit}
          noValidate
          aria-busy={pending || googlePending}
        >
          {isSignUp && step === "credentials" && (
            <div className="auth-name-fields">
              <div className="field">
                <label htmlFor="first-name">Nome</label>
                <input
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="last-name">Sobrenome</label>
                <input
                  id="last-name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
          )}

          {step === "verification" ? (
            <div className="field">
              <label htmlFor="verification-code">Código de confirmação</label>
              <input
                id="verification-code"
                name="verificationCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                required
              />
              <span className="field-hint">
                O código expira em alguns minutos. Você pode solicitar outro
                pelo fluxo de cadastro.
              </span>
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="auth-email">E-mail</label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="auth-password">Senha</label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                {isSignUp && (
                  <span className="field-hint">
                    Use pelo menos oito caracteres e evite informações óbvias.
                  </span>
                )}
              </div>
            </>
          )}

          {error && (
            <p className="form-error" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={pending || googlePending}
          >
            {pending
              ? "Aguarde…"
              : step === "verification"
                ? "Confirmar e entrar"
                : isSignUp
                  ? "Criar minha conta"
                  : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? "Já tem uma conta?" : "Ainda não faz parte?"}{" "}
          <Link
            href={buildAuthHref(
              isSignUp ? "/sign-in" : "/sign-up",
              redirectUrl,
            )}
          >
            {isSignUp ? "Entrar" : "Criar conta"}
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg
      className="auth-google-mark"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.49-4.03H3.26v2.52A9.74 9.74 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.51 13.69A5.86 5.86 0 0 1 6.2 12c0-.59.11-1.16.31-1.69V7.79H3.26A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.96 1.01 4.21l3.25-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.28c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.35 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.74 5.39l3.25 2.52c.78-2.31 2.94-4.03 5.49-4.03Z"
      />
    </svg>
  );
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

function buildAuthHref(path: "/sign-in" | "/sign-up", redirectUrl: string) {
  return `${path}?redirect_url=${encodeURIComponent(redirectUrl)}`;
}

function getAuthError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "longMessage" in error &&
    typeof error.longMessage === "string"
  ) {
    return error.longMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "errors" in error) {
    const errors = (
      error as { errors?: Array<{ longMessage?: string; message?: string }> }
    ).errors;
    const firstError = errors?.[0];
    if (firstError?.longMessage || firstError?.message) {
      return firstError.longMessage ?? firstError.message;
    }
  }

  return "Não foi possível concluir a autenticação. Tente novamente.";
}
