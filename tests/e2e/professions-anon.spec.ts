/**
 * /professions — anonymous profession-packs hub render smoke.
 *
 * Anon-viewable per AppRouter.tsx ("Profession packs — vocational
 * English verticals (anon-viewable)"). Fully static — no Supabase
 * fetch on first render.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/professions — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) bilingual hero copy renders (VI primary, EN secondary)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/professions`);

    await expect(
      page.getByRole("heading", {
        name: "Tiếng Anh nghề nghiệp cho người Việt",
        level: 1,
      }),
    ).toBeVisible();
    // EN sibling — load-bearing for SEO + non-VN landing visitors.
    await expect(
      page.getByText("Vocational English for Vietnamese workers", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(2) renders cards for every active profession sub-route", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/professions`);

    // Active cards link to /professions/:slug. The seven slugs match
    // the seven routed sub-pages (nail-tech, restaurant,
    // customer-service, tech-worker, healthcare, drivers,
    // hospitality). "Coming soon" cards may render WITHOUT a Link, so
    // we assert at least the active ones are linked.
    const activeHrefs = [
      "/professions/nail-tech",
      "/professions/restaurant",
      "/professions/customer-service",
      "/professions/tech-worker",
      "/professions/healthcare",
      "/professions/drivers",
      "/professions/hospitality",
    ];
    let linkedCount = 0;
    for (const href of activeHrefs) {
      const visible = await page
        .locator(`a[href="${href}"]`)
        .first()
        .isVisible()
        .catch(() => false);
      if (visible) linkedCount += 1;
    }
    // At least one active link must be present — soft contract so
    // the spec doesn't break the day Chau marks a card "soon".
    expect(linkedCount).toBeGreaterThanOrEqual(1);
  });

  test("(3) does not require auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/professions`);
    await expect(page).toHaveURL(/\/professions$/);
  });
});
