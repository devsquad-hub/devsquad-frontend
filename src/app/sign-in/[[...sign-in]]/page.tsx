import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main id="main-content" className="auth-page">
      <SignIn />
    </main>
  );
}
