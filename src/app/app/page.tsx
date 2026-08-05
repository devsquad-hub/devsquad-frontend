import { DashboardView } from "@/components/dashboard-view";
import { OnboardingState } from "@/components/onboarding-state";
import { backendFetch, currentAccount } from "@/lib/api";
import {
  isAccountNotReadyProblem,
  isBackendError,
} from "@/lib/backend-failure";
import type { PageResponse, Project } from "@/lib/api-types";

export default async function DashboardPage() {
  const result = await loadDashboard();
  if (result.kind === "ready") {
    return (
      <DashboardView
        account={result.account}
        projects={result.projects}
        openApplications={result.openApplications}
        pendingInvitations={result.pendingInvitations}
      />
    );
  }
  if (result.kind === "onboarding") {
    return <OnboardingState />;
  }
  return (
    <div className="error-state list-panel" role="alert">
      <h1>Não foi possível abrir o painel</h1>
      <p>A API está indisponível ou sua sessão precisa ser renovada.</p>
    </div>
  );
}

async function loadDashboard() {
  try {
    const [account, projectsResponse, applications, invitations] =
      await Promise.all([
        currentAccount(),
        backendFetch<PageResponse<Project>>("/api/v1/me/projects", {
          authenticated: true,
        }).catch(() => ({
          items: [],
          page: 0,
          size: 0,
          totalItems: 0,
        })),
        backendFetch<PageResponse<{ status: string }>>(
          "/api/v1/me/applications",
          {
            authenticated: true,
          },
        ),
        backendFetch<PageResponse<{ status: string }>>(
          "/api/v1/me/invitations",
          {
            authenticated: true,
          },
        ),
      ]);
    return {
      kind: "ready" as const,
      account,
      projects: projectsResponse.items,
      openApplications: applications.items.filter(
        (item) => item.status === "SUBMITTED",
      ).length,
      pendingInvitations: invitations.items.filter(
        (item) => item.status === "PENDING",
      ).length,
    };
  } catch (error) {
    if (isBackendError(error) && isAccountNotReadyProblem(error.problem)) {
      return { kind: "onboarding" as const };
    }
    return { kind: "error" as const };
  }
}
