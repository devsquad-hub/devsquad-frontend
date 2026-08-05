import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { OnboardingState } from "@/components/onboarding-state";
import { backendFetch } from "@/lib/api";
import {
  isAccountNotReadyProblem,
  isBackendError,
} from "@/lib/backend-failure";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/app");

  try {
    await backendFetch("/api/v1/me", { authenticated: true });
  } catch (error) {
    if (isBackendError(error) && isAccountNotReadyProblem(error.problem)) {
      return <OnboardingState />;
    }
    throw error;
  }

  return (
    <main id="main-content" className="app-layout">
      <AppSidebar />
      <div className="app-content">{children}</div>
    </main>
  );
}
