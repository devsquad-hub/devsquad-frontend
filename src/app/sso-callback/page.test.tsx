import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SsoCallbackPage from "./page";

const signIn = {
  id: undefined,
  status: "needs_first_factor",
  isTransferable: false,
  existingSession: undefined,
  supportedSecondFactors: [],
};

const signUp = {
  id: undefined,
  status: "missing_requirements",
  isTransferable: false,
  existingSession: undefined,
};

vi.mock("@clerk/nextjs", () => ({
  useClerk: () => ({ loaded: false }),
  useSignIn: () => ({ signIn }),
  useSignUp: () => ({ signUp }),
}));

vi.mock("next/image", () => ({
  default: () => <span aria-hidden="true" />,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
}));

describe("SsoCallbackPage", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("aguarda o Clerk carregar antes de declarar que o OAuth não existe", () => {
    vi.useFakeTimers();
    render(<SsoCallbackPage />);

    act(() => vi.advanceTimersByTime(1_600));

    expect(
      screen.getByRole("heading", { name: "Finalizando com Google…" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Falha ao entrar com Google" }),
    ).not.toBeInTheDocument();
  });
});
