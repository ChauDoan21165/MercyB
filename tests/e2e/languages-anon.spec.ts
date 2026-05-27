/**
 * /languages — anonymous family hub render smoke.
 *
 * Anon-viewable per AppRouter.tsx (no RequireAuth wrapper). The page
 * is fully static — no Supabase, no network on first render — so the
 * spec just verifies the hero copy and the seven per-language cards
 * resolve to their expected sub-routes.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/languages — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) hero header renders with the brand tagline pair", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/languages`);

    await expect(
      page.getByRole("heading", { name: "Practical language learning", level: 1 }),
    ).toBeVisible();
    // EN subtitle below the h1 — names the languages explicitly.
    await expect(
      page.getByText(
        "Real-life lessons in Korean, Japanese, Chinese, French, German & more",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("(2) renders cards linking to every per-language sub-route", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/languages`);

    // The hub registers 7 sub-pages (french / german / japanese /
    // chinese / korean / vietnamese / spanish). Each card is a
    // <Link to="/languages/:lang"> — assert all 7 hrefs are present.
    const expectedHrefs = [
      "/languages/french",
      "/languages/german",
      "/languages/japanese",
      "/languages/chinese",
      "/languages/korean",
      "/languages/vietnamese",
      "/languages/spanish",
    ];
    for (const href of expectedHrefs) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("(3) does not require auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/languages`);
    await expect(page).toHaveURL(/\/languages$/);
  });
});
