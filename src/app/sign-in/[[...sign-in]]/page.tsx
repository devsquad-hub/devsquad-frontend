import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <main id="main-content" className="auth-page">
      <Suspense fallback={<AuthLoading />}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </main>
  );
}

function AuthLoading() {
  return <p className="muted auth-loading-page">Carregando autenticação…</p>;
}
