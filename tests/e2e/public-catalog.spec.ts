import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(() => {
  test.skip(
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    "Clerk test keys are required",
  );
});

test("renders the public catalog without horizontal overflow", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", {
      name: "Ideias ganham equipe. Equipes entregam projetos.",
    }),
  ).toBeVisible();
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width);
});

test("opens a public project with grouped team and progressive recruitment", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const projectLink = page
    .locator('a[href^="/hubs/"][href*="/projects/"]')
    .first();
  if ((await projectLink.count()) === 0) {
    test.skip(true, "A seeded public project is required for this flow");
  }
  await projectLink.click();
  await expect(
    page.getByRole("heading", { name: "Sobre o projeto" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Equipe" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Posições abertas" }),
  ).toBeVisible();
  await expect(page.locator("nav.breadcrumb a").first()).toHaveAttribute(
    "href",
    "/#projetos",
  );
  const disclosures = page.locator("details.application-disclosure");
  for (let index = 0; index < (await disclosures.count()); index += 1) {
    await expect(disclosures.nth(index)).not.toHaveAttribute("open");
  }
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width);
});

test("has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await settleReveals(page);
  const catalogResults = await new AxeBuilder({ page }).analyze();
  expect(catalogResults.violations).toEqual([]);

  const projectLink = page
    .locator('a[href^="/hubs/"][href*="/projects/"]')
    .first();
  if ((await projectLink.count()) === 0) {
    test.skip(true, "A seeded public project is required for this flow");
  }
  await projectLink.click();
  await expect(
    page.getByRole("heading", { name: "Sobre o projeto" }),
  ).toBeVisible();
  await settleReveals(page);
  const projectResults = await new AxeBuilder({ page }).analyze();
  expect(projectResults.violations).toEqual([]);
});

async function settleReveals(page: Page) {
  await page.evaluate(() => {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => element.classList.add("is-visible"));
  });
  await page.waitForTimeout(550);
}
