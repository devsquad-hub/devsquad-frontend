import { expect, test } from "@playwright/test";

test.beforeEach(() => {
  test.skip(
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    "Clerk test keys are required",
  );
});

test("offers the custom Google action on sign-in and sign-up", async ({
  page,
}) => {
  for (const path of ["/sign-in", "/sign-up"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(
      page.getByRole("button", { name: "Continuar com Google" }),
    ).toBeVisible();
    await expect(
      page.locator('[class*="cl-"], [data-clerk-component]'),
    ).toHaveCount(0);
  }
});

test("renders a custom OAuth callback state", async ({ page }) => {
  await page.goto("/sso-callback", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: "Falha ao entrar com Google" }),
  ).toBeVisible();
  await expect(
    page.locator('[class*="cl-"], [data-clerk-component]'),
  ).toHaveCount(0);
});
