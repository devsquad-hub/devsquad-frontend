"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";

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
            <Image
              className="brand-logo"
              src="/devsquad_logo.svg"
              alt=""
              aria-hidden="true"
              width={86}
              height={46}
              priority
            />
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
            <AuthControls />
          </div>
        </div>
      </header>
    </>
  );
}
