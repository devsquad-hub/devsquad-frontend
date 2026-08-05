# Hierarchy and Reliability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the current reliability, visibility, scalability, hierarchy, and navigation defects while preserving the existing Next.js/Clerk/Primer frontend and Quarkus/Postgres backend.

**Architecture:** Keep the BFF and hexagonal backend boundaries. Introduce typed result states for server-loaded collections instead of treating failures as empty data, isolate public visibility rules in persistence queries, and shape the public project page around hub → project → overview/team/recruitment hierarchy. Use progressive disclosure for application forms and active navigation derived from the current route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Clerk, Primer React, Vitest, Playwright, Quarkus RESTEasy Reactive, Java 21+, JDBC, PostgreSQL, Flyway.

## Global Constraints

- Do not migrate frameworks or add a dependency when an existing primitive is sufficient.
- Keep all user-facing copy in pt-BR and map backend enum values at the presentation boundary.
- Public endpoints must never expose archived projects, closed recruitment, or inactive/deleted accounts.
- API failures must remain distinguishable from valid empty collections.
- Every behavior change starts with a failing test and ends with the smallest implementation that makes it pass.
- Keep the GitHub/Primer visual language: borders, spacing, active tab indicator, responsive one-column mobile layout, and no unnecessary motion.

---

### Task 1: Shared frontend labels and result-state primitives

**Files:**

- Create: `src/lib/labels.ts`
- Create: `src/lib/load-state.ts`
- Create: `src/lib/labels.test.ts`
- Create: `src/lib/load-state.test.ts`
- Modify: `src/lib/api-types.ts` only where response types need explicit unions.

**Interfaces:**

- `projectStatusLabel(status: Project["status"]): string`
- `roleLabel(role: string): string`
- `applicationStatusLabel(status: string): string`
- `priorityLabel(priority: string): string`
- `eventLabel(eventType: string): string`
- `type LoadState<T> = { kind: "ready"; data: T } | { kind: "empty"; data: T } | { kind: "error"; error: unknown }`
- `loadState<T>(loader: () => Promise<T>, isEmpty: (value: T) => boolean): Promise<LoadState<T>>`

- [ ] Write failing tests for all supported Portuguese labels and for `loadState` distinguishing successful empty data, successful non-empty data, and rejected loaders.
- [ ] Run `npm test -- src/lib/labels.test.ts src/lib/load-state.test.ts`; confirm the new imports/functions fail.
- [ ] Implement the maps and helper with no UI dependency.
- [ ] Run the focused tests, then `npm run typecheck`.

### Task 2: Reliable server loading and finite onboarding recovery

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/hubs/[hubSlug]/projects/[projectSlug]/page.tsx`
- Modify: `src/app/app/page.tsx`
- Modify: `src/app/app/applications/page.tsx`
- Modify: `src/app/app/invitations/page.tsx`
- Modify: `src/app/app/notifications/page.tsx`
- Modify: `src/app/app/projects/[projectId]/activity/page.tsx`
- Modify: `src/app/app/projects/[projectId]/recruitment/page.tsx`
- Modify: `src/app/app/hubs/[hubId]/members/page.tsx`
- Modify: `src/app/app/proposals/new/page.tsx`
- Modify: `src/app/app/projects/[projectId]/layout.tsx`
- Modify: `src/components/onboarding-state.tsx`
- Create: `src/components/load-error.tsx`
- Create: `src/components/onboarding-state.test.tsx`
- Modify: `tests/e2e/public-catalog.spec.ts`

**Interfaces:**

- `CatalogLoadResult = { hubs: Hub[]; projects: Project[]; failedHubIds: string[]; unavailable: boolean }`
- `OnboardingState` accepts optional `maxAttempts`, displays a stable retry action, and stops automatic reload after the limit.
- `LoadError` accepts `title`, `description`, and `onRetry`/`retryHref`.

- [ ] Add failing unit/E2E assertions: one failed hub does not erase healthy projects; a loader failure is not rendered as an empty state; onboarding stops after the retry budget and exposes a retry control.
- [ ] Run focused tests and verify failure.
- [ ] Implement `Promise.allSettled` catalog loading, explicit error states, and finite onboarding polling with cleanup.
- [ ] Preserve `notFound()` only for a confirmed 404; rethrow or render an error state for transport/5xx failures.
- [ ] Run frontend tests, typecheck, lint, and the public catalog E2E suite.

### Task 3: Public project hierarchy and progressive recruitment disclosure

**Files:**

- Modify: `src/app/hubs/[hubSlug]/projects/[projectSlug]/page.tsx`
- Modify: `src/components/public-project-view.tsx`
- Modify: `src/components/application-form.tsx`
- Modify: `src/components/catalog-view.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/public-project-view.test.tsx`
- Modify: `tests/e2e/public-catalog.spec.ts`

**Interfaces:**

- `PublicProjectView` receives `hub: Pick<Hub, "name" | "slug">` in addition to `project` and `positions`.
- `PublicProjectView` renders `ProjectSectionNav` with anchors `overview`, `team`, and `recruitment`.
- `ApplicationForm` remains responsible for fields/submission but is mounted only inside an explicit expandable application panel.

- [ ] Add failing component/E2E assertions for hub breadcrumb, section navigation, grouped admins/contributors, one collapsed application panel per position, localized status, and active anchor styling.
- [ ] Run the focused tests and verify they fail against the current flat page.
- [ ] Implement the hierarchy: project identity/breadcrumb, overview section, team summary grouped by `ADMIN`/`MEMBER`, recruitment cards with a “Quero me candidatar” disclosure, and a compact sidebar index.
- [ ] Add stable `aria-controls`, `aria-expanded`, and unique IDs based on position IDs.
- [ ] Move inline styles into named CSS classes and keep mobile content readable without horizontal overflow.
- [ ] Run component tests, Axe on the public detail page, and desktop/mobile Playwright checks.

### Task 4: Internal project navigation, labels, and mutation resilience

**Files:**

- Modify: `src/features/projects/project-navigation.ts`
- Modify: `src/components/project-shell.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/components/application-form.tsx`
- Modify: `src/components/resource-actions.tsx`
- Modify: `src/components/board-view.tsx`
- Modify: `src/components/hub-role-form.tsx`
- Modify: `src/components/invitation-form.tsx`
- Modify: `src/components/new-task-form.tsx`
- Modify: `src/components/profile-form.tsx`
- Modify: `src/components/project-admin-form.tsx`
- Modify: `src/components/project-settings-form.tsx`
- Modify: `src/components/proposal-form.tsx`
- Modify: `src/components/task-detail.tsx`
- Modify: `src/components/dashboard-view.tsx`
- Modify: `src/app/app/applications/page.tsx`
- Modify: `src/app/app/invitations/page.tsx`
- Modify: `src/app/app/proposals/page.tsx`
- Modify: `src/app/app/projects/[projectId]/recruitment/page.tsx`
- Modify: `src/app/app/projects/[projectId]/members/page.tsx`
- Modify: `src/app/app/projects/[projectId]/activity/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/features/projects/project-navigation.test.ts`

- [ ] Add failing tests for active project/sidebar links and localized status/role/priority/event rendering.
- [ ] Add a shared `requestMutation` helper test covering rejected fetch promises and non-2xx Problem Details.
- [ ] Implement route-aware `aria-current="page"`, active tab indicator, semantic section headings, and shared label usage.
- [ ] Wrap all client mutations in the shared helper so transport failures become inline Flash messages and always reset saving state.
- [ ] Keep existing optimistic board rollback behavior while handling network rejection.
- [ ] Run focused tests and all frontend checks.

### Task 5: Backend public visibility and membership hygiene

**Files:**

- Modify: `src/main/java/com/devsquad/project/adapter/out/persistence/JdbcProjectStore.java`
- Modify: `src/main/java/com/devsquad/recruitment/adapter/out/persistence/JdbcRecruitmentStore.java`
- Modify: `src/main/java/com/devsquad/hub/adapter/out/persistence/JdbcHubMembershipStore.java`
- Modify: `src/main/java/com/devsquad/identity/adapter/out/persistence/JdbcAccountStore.java` only if deletion needs membership cleanup.
- Create/modify: `src/test/java/com/devsquad/project/PublicVisibilityIntegrationTest.java`
- Create/modify: `src/test/java/com/devsquad/recruitment/PublicRecruitmentVisibilityTest.java`

- [ ] Add failing integration tests proving archived projects are absent from catalog and slug detail, archived projects expose no positions, and deleted accounts are absent from public project/hub members.
- [ ] Run the focused Gradle tests and confirm the current SQL fails those assertions.
- [ ] Add `p.status <> 'ARCHIVED'` to public slug and recruitment queries, require open project visibility where appropriate, and add `a.status = 'ACTIVE'` to member joins.
- [ ] On user deletion, mark active hub/project memberships inactive in the same transaction or make every public/private member query enforce account status.
- [ ] Run `./gradlew test` and `./gradlew quarkusBuild --no-daemon`.

### Task 6: Atomic recruitment setup and query scalability

**Files:**

- Modify: `src/main/java/com/devsquad/recruitment/application/RecruitmentService.java`
- Modify: `src/main/java/com/devsquad/recruitment/application/port/RecruitmentStore.java`
- Modify: `src/main/java/com/devsquad/recruitment/adapter/out/persistence/JdbcRecruitmentStore.java`
- Modify: `src/components/recruitment-setup-form.tsx`
- Modify: `src/main/java/com/devsquad/project/adapter/out/persistence/JdbcProjectStore.java`
- Modify: `src/main/java/com/devsquad/project/adapter/in/web/PublicProjectController.java`
- Modify: `src/main/java/com/devsquad/hub/adapter/in/web/PublicHubController.java` only if page parameters are added.
- Create/modify integration/unit tests for atomic setup and bounded public project reads.

- [ ] Add a failing backend test for round creation failure after position validation, asserting no partial round remains.
- [ ] Add a failing query/service test for bounded project catalog reads and member loading.
- [ ] Implement one transactional `createAndOpen` application operation for the UI flow, preserving the existing lower-level endpoints for compatibility.
- [ ] Add bounded page parameters to public project listing and avoid per-project member queries by loading members in one query or returning a compact member summary for the catalog.
- [ ] Update the frontend setup form to call the atomic endpoint and display the returned Problem Detail.
- [ ] Run all backend tests/builds and frontend mutation tests.

### Task 7: Regression suite and production-like verification

**Files:**

- Modify: `tests/e2e/public-catalog.spec.ts`
- Create: `tests/e2e/public-project.spec.ts`
- Create: `tests/e2e/error-states.spec.ts`
- Modify: `src/test/java/com/devsquad/BackendApplicationTest.java`
- Modify: `README.md` with the verification commands and recovery behavior.

- [ ] Add E2E coverage for project hierarchy, mobile layout, active navigation, collapsed recruitment forms, and API failure states.
- [ ] Add backend route tests for public archived/deleted visibility and private authentication boundaries.
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, `npx playwright test`.
- [ ] Run `./gradlew test --no-daemon` and `./gradlew quarkusBuild --no-daemon`.
- [ ] Run Semgrep auto scan on both repositories and inspect any findings.
- [ ] Verify production readiness, public catalog, project detail, and private 401 behavior with curl after deployment.
