/**
 * /tiers — anonymous tier-map render smoke.
 *
 * Anon-viewable per AppRouter.tsx (no RequireAuth wrapper). The page
 * is a static three-column tier map ("English / Core / Life"). No
 * Supabase fetch on mount.
 *
 * Spec covers:
 *   1. The "Tier Map" h1.
 *   2. The "Pricing / Upgrade" CTA links to /upgrade.
 *   3. Either the mobile shorthand or the desktop tagline copy is
 *      visible (the page renders one or the other based on viewport).
 *      Smoke config uses 1280×800 so we expect desktop copy, but the
 *      spec accepts either so a future config tweak doesn't break it.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/tiers — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) Tier Map h1 renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/tiers`);

    await expect(
      page.getByRole("heading", { name: "Tier Map", level: 1 }),
    ).toBeVisible();
  });

  test("(2) Pricing / Upgrade CTA links to /upgrade", async ({ page }) => {
    await page.goto(`${BASE_URL}/tiers`);

    const cta = page.getByRole("link", {
      name: /Open pricing \/ upgrade/i,
    });
    await expect(cta).toBeVisible();
    expect(await cta.getAttribute("href")).toBe("/upgrade");
  });

  test("(3) renders the three column-label trio (English / Core / Life)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/tiers`);

    // Whether the mobile shorthand or the desktop tagline is rendered
    // depends on the viewport — smoke config is 1280×800 (desktop),
    // but both variants list the trio in the same order. Asserting
    // each label is present in the page is robust to either layout.
    const body = page.locator("body");
    await expect(body).toContainText("English");
    await expect(body).toContainText("Core");
    await expect(body).toContainText("Life");
  });

  test("(4) does not require auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/tiers`);
    await expect(page).toHaveURL(/\/tiers$/);
  });
});
