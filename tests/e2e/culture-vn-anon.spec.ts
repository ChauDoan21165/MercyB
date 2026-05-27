/**
 * /culture/vn — anonymous VN cultural-packs index render smoke.
 *
 * Anon-viewable per AppRouter.tsx ("VN cultural packs (Step 10) —
 * public, no auth needed"). Fully static — `VN_CULTURAL_PACKS` is a
 * compile-time constant.
 *
 * Spec asserts:
 *   1. The bilingual hero header (VI primary, EN secondary).
 *   2. The "Miễn phí cho mọi người dùng" trust line (matches the
 *      pack-positioning copy on the page).
 *   3. At least one pack card links into /culture/vn/:packId.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/culture/vn — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) bilingual hero copy renders (VI primary, EN secondary)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/culture/vn`);

    await expect(
      page.getByRole("heading", {
        name: "Văn hoá Việt — giải thích bằng tiếng Anh",
        level: 1,
      }),
    ).toBeVisible();
    // EN subheader sits directly below the VI h1.
    await expect(
      page.getByText(
        "Vietnamese culture, in English — for diaspora users explaining their world to coworkers, neighbors, and kids' teachers.",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("(2) free-for-everyone trust line renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/culture/vn`);

    // Bilingual positioning — pinned because the public packs are
    // intentionally free, and the framing matters for trust.
    await expect(
      page.getByText("Miễn phí cho mọi người dùng / Free for everyone.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(3) the pack list renders at least one link into /culture/vn/:packId", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/culture/vn`);

    const packLinks = page.locator('a[href^="/culture/vn/"]');
    await expect(packLinks.first()).toBeVisible();
    expect(await packLinks.count()).toBeGreaterThan(0);

    // The list is wrapped in an `aria-label="Cultural packs"` region —
    // assert it's present so a future refactor that drops the
    // semantic landmark surfaces here.
    await expect(
      page.locator('[aria-label="Cultural packs"]'),
    ).toBeVisible();
  });

  test("(4) does not require auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/culture/vn`);
    await expect(page).toHaveURL(/\/culture\/vn$/);
  });
});
