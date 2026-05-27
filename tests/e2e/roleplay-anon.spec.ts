/**
 * /roleplay — anonymous render smoke.
 *
 * Anon-viewable per AppRouter.tsx. The page is feature-flag-gated
 * via `useFeatureFlag` — when disabled it renders a calm "đang được
 * hoàn thiện" placeholder; when enabled it renders the full scenario
 * list. Both branches share the "Roleplay" h1, so the spec asserts
 * that one of the two branches mounted with the expected heading
 * rather than pinning to a single content shape.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/roleplay — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) Roleplay heading renders (flag-on or flag-off path)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/roleplay`);

    // Both branches render a `Roleplay` heading; the disabled branch
    // uses `level=1`/level-of-heading style "text-lg" and the enabled
    // branch uses the full `level=1` hero. Either is acceptable —
    // smoke-test just wants the page to mount.
    const headings = page.getByRole("heading", { name: "Roleplay" });
    await expect(headings.first()).toBeVisible();
  });

  test("(2) the page mounts in one of its two legitimate states", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/roleplay`);

    const disabledCopy = page.getByText(
      "Tính năng này đang được hoàn thiện. Quay lại sau bạn nhé.",
    );
    const enabledCopy = page.getByText(
      "Practice real-life situations in English with Mercy.",
    );

    const anyVisible = await Promise.race([
      disabledCopy
        .first()
        .waitFor({ state: "visible", timeout: 8_000 })
        .then(() => "disabled")
        .catch(() => null),
      enabledCopy
        .first()
        .waitFor({ state: "visible", timeout: 8_000 })
        .then(() => "enabled")
        .catch(() => null),
    ]);
    expect(anyVisible).not.toBeNull();
  });

  test("(3) does not require auth — anon load lands on /roleplay directly", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/roleplay`);
    await expect(page).toHaveURL(/\/roleplay$/);
  });
});
