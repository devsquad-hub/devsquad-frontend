"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button, LinkButton } from "@primer/react";
import { BellIcon, PlusIcon } from "@primer/octicons-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            className="brand"
            href="/"
            aria-label="DevSquad, página inicial"
          >
            <span className="brand-mark" aria-hidden="true">
              &lt;/&gt;
            </span>
            <span className="brand-name">DevSquad</span>
          </Link>
          <form action="/" role="search">
            <label htmlFor="global-project-search">
              <span className="sr-only">Buscar projetos</span>
              <input
                id="global-project-search"
                className="header-search"
                name="q"
                type="search"
                placeholder="Buscar projetos"
              />
            </label>
          </form>
          <div className="header-actions">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button className="header-control" variant="invisible">
                  Entrar
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Cadastre-se</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link className="header-link optional" href="/app">
                Painel
              </Link>
              <LinkButton
                href="/app/notifications"
                leadingVisual={BellIcon}
                aria-label="Notificações"
                variant="invisible"
                className="header-control icon-link"
              >
                <span className="sr-only">Notificações</span>
              </LinkButton>
              <LinkButton
                href="/app/proposals/new"
                leadingVisual={PlusIcon}
                aria-label="Nova proposta"
                variant="invisible"
                className="header-control icon-link"
              >
                <span className="sr-only">Nova proposta</span>
              </LinkButton>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>
    </>
  );
}
