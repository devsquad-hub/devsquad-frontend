"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { AUTH_REDIRECT_STORAGE_KEY } from "@/components/auth-form";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const signInState = useSignIn();
  const signUpState = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);
  const [error, setError] = useState<string>();
  const [needsDetails, setNeedsDetails] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (hasRun.current || !signInState.signIn || !signUpState.signUp) {
      return;
    }

    const signIn = signInState.signIn;
    const signUp = signUpState.signUp;
    const hasOAuthState = Boolean(
      signIn.id ||
      signUp.id ||
      signIn.status === "complete" ||
      signUp.status === "complete" ||
      signIn.isTransferable ||
      signUp.isTransferable ||
      signIn.existingSession ||
      signUp.existingSession,
    );

    if (!hasOAuthState) {
      const timeout = window.setTimeout(() => {
        if (!hasRun.current) {
          hasRun.current = true;
          setError(
            "Não encontramos uma autenticação Google ativa. Inicie o login novamente.",
          );
        }
      }, 1500);
      return () => window.clearTimeout(timeout);
    }

    hasRun.current = true;
    const redirectUrl = readAuthRedirect();
    void finishOAuth(redirectUrl);

    async function finishOAuth(target: string) {
      setPending(true);

      try {
        if (signIn.status === "complete") {
          await finalizeSignIn(signIn, target);
          return;
        }

        if (signUp.isTransferable) {
          const result = await signIn.create({ transfer: true });
          if (result.error) {
            throw result.error;
          }

          if (isComplete(signIn.status)) {
            await finalizeSignIn(signIn, target);
            return;
          }

          router.replace(buildAuthHref("/sign-in", target));
          return;
        }

        if (signIn.isTransferable) {
          const result = await signUp.create({ transfer: true });
          if (result.error) {
            throw result.error;
          }

          if (signUp.status === "complete") {
            await finalizeSignUp(signUp, target);
            return;
          }

          if (signUp.status === "missing_requirements") {
            setNeedsDetails(true);
            return;
          }
        }

        if (signUp.status === "complete") {
          await finalizeSignUp(signUp, target);
          return;
        }

        if (signIn.existingSession || signUp.existingSession) {
          const sessionId =
            signIn.existingSession?.sessionId ??
            signUp.existingSession?.sessionId;
          if (sessionId) {
            await clerk.setActive({
              session: sessionId,
              navigate: async ({ decorateUrl }) =>
                navigateTo(decorateUrl(target)),
            });
            return;
          }
        }

        throw new Error(
          "O Google concluiu a autenticação, mas a sessão precisa de uma etapa adicional.",
        );
      } catch (caughtError) {
        setError(getAuthError(caughtError));
      } finally {
        setPending(false);
      }
    }

    async function finalizeSignIn(
      resource: NonNullable<typeof signInState.signIn>,
      target: string,
    ) {
      const result = await resource.finalize({
        navigate: async ({ decorateUrl }) => navigateTo(decorateUrl(target)),
      });
      if (result.error) {
        throw result.error;
      }
    }

    async function finalizeSignUp(
      resource: NonNullable<typeof signUpState.signUp>,
      target: string,
    ) {
      const result = await resource.finalize({
        navigate: async ({ decorateUrl }) => navigateTo(decorateUrl(target)),
      });
      if (result.error) {
        throw result.error;
      }
    }

    function navigateTo(destination: string) {
      if (destination.startsWith("http")) {
        window.location.assign(destination);
        return;
      }

      router.replace(destination);
      router.refresh();
    }
  }, [
    clerk,
    router,
    signInState,
    signInState.signIn,
    signUpState,
    signUpState.signUp,
  ]);

  const submitMissingDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setPending(true);

    try {
      const signUp = signUpState.signUp;
      if (!signUp) {
        throw new Error("O cadastro ainda está carregando.");
      }

      const result = await signUp.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      if (result.error) {
        throw result.error;
      }

      if (signUp.status !== "complete") {
        throw new Error(
          "Ainda faltam informações para concluir seu cadastro pelo Google.",
        );
      }

      const target = readAuthRedirect();
      const finalized = await signUp.finalize({
        navigate: async ({ decorateUrl }) => {
          const destination = decorateUrl(target);
          if (destination.startsWith("http")) {
            window.location.assign(destination);
          } else {
            router.replace(destination);
            router.refresh();
          }
        },
      });
      if (finalized.error) {
        throw finalized.error;
      }
    } catch (caughtError) {
      setError(getAuthError(caughtError));
    } finally {
      setPending(false);
    }
  };

  if (needsDetails) {
    return (
      <main id="main-content" className="auth-page">
        <section className="auth-callback-card" aria-labelledby="sso-heading">
          <BrandMark />
          <p className="eyebrow">Quase lá</p>
          <h1 id="sso-heading">Complete seu cadastro</h1>
          <p>
            O Google não enviou todos os dados necessários. Informe seu nome
            para terminar de criar a conta na comunidade.
          </p>
          <form className="form-stack" onSubmit={submitMissingDetails}>
            <div className="auth-name-fields">
              <div className="field">
                <label htmlFor="sso-first-name">Nome</label>
                <input
                  id="sso-first-name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="sso-last-name">Sobrenome</label>
                <input
                  id="sso-last-name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
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
              {pending ? "Salvando…" : "Concluir cadastro"}
            </button>
          </form>
          <div id="clerk-captcha" className="clerk-captcha-slot" />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main id="main-content" className="auth-page">
        <section
          className="auth-callback-card"
          aria-labelledby="sso-error-heading"
        >
          <BrandMark />
          <p className="eyebrow">Não foi possível continuar</p>
          <h1 id="sso-error-heading">Falha ao entrar com Google</h1>
          <p role="alert">{error}</p>
          <div className="auth-callback-actions">
            <Link className="button button-primary" href="/sign-in">
              Voltar para entrar
            </Link>
            <Link className="button button-secondary" href="/">
              Ir para a comunidade
            </Link>
          </div>
          <div id="clerk-captcha" className="clerk-captcha-slot" />
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="auth-page">
      <section
        className="auth-callback-card"
        aria-labelledby="sso-loading-heading"
      >
        <BrandMark />
        <p className="eyebrow">Autenticação segura</p>
        <h1 id="sso-loading-heading">Finalizando com Google…</h1>
        <p aria-live="polite">
          Estamos preparando sua sessão e já vamos levar você de volta ao
          DevSquad.
        </p>
        <span className="auth-callback-spinner" aria-hidden="true" />
        <div id="clerk-captcha" className="clerk-captcha-slot" />
      </section>
    </main>
  );
}

function BrandMark() {
  return (
    <Image
      className="auth-callback-logo"
      src="/devsquad_logo.svg"
      alt="DevSquad"
      width={112}
      height={60}
      priority
    />
  );
}

function readAuthRedirect() {
  let value: string | null = null;

  try {
    value = window.sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
  } catch {
    // Use the default when storage is blocked by the browser.
  }

  return getSafeRedirect(value);
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

function isComplete(status: string) {
  return status === "complete";
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
