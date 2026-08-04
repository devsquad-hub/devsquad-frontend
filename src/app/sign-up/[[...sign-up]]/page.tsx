import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main id="main-content" className="auth-page">
      <SignUp />
    </main>
  );
}
