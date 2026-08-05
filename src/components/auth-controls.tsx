"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  SignOutIcon,
} from "@primer/octicons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authPresentationState } from "@/lib/auth-flow";

type AuthActionProps = {
  children: React.ReactNode;
  className?: string;
  redirectUrl?: string;
};

export function SignInAction({
  children,
  className = "",
  redirectUrl,
}: AuthActionProps) {
  return (
    <Link className={className} href={buildAuthHref("/sign-in", redirectUrl)}>
      {children}
    </Link>
  );
}

export function SignUpAction({
  children,
  className = "",
  redirectUrl,
}: AuthActionProps) {
  return (
    <Link className={className} href={buildAuthHref("/sign-up", redirectUrl)}>
      {children}
    </Link>
  );
}

export function AuthControls() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const pathname = usePathname();
  const redirectUrl = isAuthPath(pathname) ? undefined : pathname;
  const state = authPresentationState({
    isAuthLoaded,
    isUserLoaded,
    isSignedIn,
    hasUser: Boolean(user),
  });

  if (state === "loading") {
    return <span className="auth-loading" aria-label="Carregando conta" />;
  }

  if (state === "pending") {
    return (
      <SignInAction
        className="header-link header-auth-link"
        redirectUrl={redirectUrl}
      >
        Confirmar sessão
      </SignInAction>
    );
  }

  if (state === "signed-out") {
    return (
      <>
        <SignInAction
          className="header-link header-auth-link"
          redirectUrl={redirectUrl}
        >
          Entrar
        </SignInAction>
        <SignUpAction className="header-cta" redirectUrl={redirectUrl}>
          Criar conta
        </SignUpAction>
      </>
    );
  }

  return (
    <>
      <Link className="header-link optional" href="/app">
        Painel
      </Link>
      <Link
        className="header-icon-link"
        href="/app/notifications"
        aria-label="Notificações"
        title="Notificações"
      >
        <BellIcon size={16} aria-hidden="true" />
        <span className="sr-only">Notificações</span>
      </Link>
      <Link
        className="header-icon-link"
        href="/app/proposals/new"
        aria-label="Nova proposta"
        title="Nova proposta"
      >
        <PlusIcon size={16} aria-hidden="true" />
        <span className="sr-only">Nova proposta</span>
      </Link>
      <AccountMenu />
    </>
  );
}

export function AuthGate({
  children,
  redirectUrl,
}: {
  children: React.ReactNode;
  redirectUrl?: string;
}) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const state = authPresentationState({
    isAuthLoaded,
    isUserLoaded,
    isSignedIn,
    hasUser: Boolean(user),
  });

  if (state === "loading") {
    return <p className="muted auth-gate-status">Verificando sua sessão…</p>;
  }

  if (state === "pending") {
    return (
      <div className="auth-gate">
        <p>Sua sessão precisa ser confirmada antes de continuar.</p>
        <SignInAction
          className="button button-primary"
          redirectUrl={redirectUrl}
        >
          Confirmar sessão
        </SignInAction>
      </div>
    );
  }

  if (state === "signed-out") {
    return (
      <div className="auth-gate">
        <p>Entre na comunidade para enviar sua candidatura.</p>
        <SignInAction
          className="button button-primary"
          redirectUrl={redirectUrl}
        >
          Entrar para se candidatar
        </SignInAction>
      </div>
    );
  }

  return <>{children}</>;
}

function AccountMenu() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const displayName =
    user?.fullName || user?.primaryEmailAddress?.emailAddress || "Conta";
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <details className="account-menu">
      <summary className="account-trigger" aria-label="Abrir menu da conta">
        <span className="account-avatar" aria-hidden="true">
          {initials(displayName)}
        </span>
        <span className="account-trigger-copy">
          <strong>{displayName}</strong>
          <small>Minha conta</small>
        </span>
        <ChevronDownIcon size={14} aria-hidden="true" />
      </summary>
      <div className="account-popover" role="menu">
        <div className="account-popover-heading">
          <strong>{displayName}</strong>
          {email && <span>{email}</span>}
        </div>
        <Link role="menuitem" href="/app/profile">
          Perfil
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => void signOut({ redirectUrl: "/" })}
        >
          <SignOutIcon size={16} aria-hidden="true" />
          Sair
        </button>
      </div>
    </details>
  );
}

function buildAuthHref(path: "/sign-in" | "/sign-up", redirectUrl?: string) {
  const safeRedirect = getSafeRedirect(redirectUrl);
  return safeRedirect
    ? `${path}?redirect_url=${encodeURIComponent(safeRedirect)}`
    : path;
}

function getSafeRedirect(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  return value;
}

function isAuthPath(pathname: string | null) {
  return pathname === "/sign-in" || pathname === "/sign-up";
}

function initials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "DS"
  );
}
