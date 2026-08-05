"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

type AuthMode = "sign-in" | "sign-up";
type AuthStep = "credentials" | "verification";

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

        <form className="form-stack auth-form" onSubmit={submit} noValidate>
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
            disabled={pending}
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
