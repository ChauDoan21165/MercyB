/**
 * /stories — anonymous testimonial-index render smoke.
 *
 * Anon-viewable per AppRouter.tsx ("public stories index, owner share
 * flow (auth-gated)"). The index reads a user-submitted-stories list
 * from Supabase; with the dev server's default config the fetch may
 * resolve to a populated list, an empty list, or an error. Header
 * chrome is invariant — that's where the spec lives.
 *
 * The /stories/share flow is auth-required and therefore out of
 * scope for this anon spec.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/stories — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) bilingual hero copy renders (VI primary, EN secondary)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/stories`);

    await expect(
      page.getByRole("heading", {
        name: "Câu chuyện thật của người học",
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Real stories from Vietnamese learners.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(2) trust note about editorial review renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/stories`);

    // Load-bearing for trust — sets the expectation that stories are
    // moderated, not auto-published.
    await expect(
      page.getByText(
        "Mỗi câu chuyện đều do người học tự gửi và được đội ngũ MercyBlade duyệt.",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("(3) tag filter region is rendered (anon-readable)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/stories`);

    // The "Bộ lọc" region is rendered regardless of fetch state.
    // Use the aria-label as the selector — it's stable across data
    // states.
    await expect(
      page.locator('[aria-label="Bộ lọc"]'),
    ).toBeVisible();
  });

  test("(4) does not require auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/stories`);
    await expect(page).toHaveURL(/\/stories$/);
  });
});
