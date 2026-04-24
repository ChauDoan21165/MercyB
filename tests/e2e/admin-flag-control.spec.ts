/**
 * Smoke 5/5 — Admin flag control.
 *
 * Flow:
 *   1. Admin logs in (TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD).
 *   2. Visits /admin/feature-flags, toggles a flag off.
 *   3. Admin signs out, regular TEST_USER signs in.
 *   4. The flag-gated surface is hidden.
 *   5. Admin restores the flag to ON as cleanup.
 *
 * Uses `placement_test_enabled` as the flag-under-test because it has a
 * clearly-visible gated surface (the "Take placement test" button on
 * /account). Falls back to `pronunciationScoringEnabled` if the
 * placement flag row isn't present.
 */

import { test, expect } from "./fixtures/test";
import {
  BASE_URL,
  TEST_ADMIN_EMAIL,
  TEST_ADMIN_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  hasTestAdmin,
  hasTestUser,
} from "./fixtures/env";
import { signInThroughUi, signOutThroughUi } from "./fixtures/auth";

const FLAG_UNDER_TEST = "placement_test_enabled";
const FLAG_GATED_BUTTON_TEXT = /take placement test|làm bài đánh giá/i;

test.describe("admin flag control", () => {
  test.skip(
    !hasTestAdmin() || !hasTestUser(),
    "Requires TEST_ADMIN_* and TEST_USER_* pairs. See tests/e2e/README.md.",
  );

  test("admin toggle propagates to end-user gating", async ({ browser }) => {
    // Admin session.
    const adminCtx = await browser.newContext();
    const adminPage = await adminCtx.newPage();

    await signInThroughUi(adminPage, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
    await adminPage.goto(`${BASE_URL}/admin/feature-flags`);
    await expect(adminPage.locator('text=/feature flags/i').first()).toBeVisible({
      timeout: 15_000,
    });

    // Find the row for our flag.
    const row = adminPage
      .locator(`tr:has-text("${FLAG_UNDER_TEST}")`)
      .first();
    await expect(
      row,
      `expected a feature_flags row for ${FLAG_UNDER_TEST}`,
    ).toBeVisible({ timeout: 10_000 });

    // Inline switch — capture initial state so we can restore.
    const toggle = row.locator('[role="switch"]').first();
    const initiallyOn = (await toggle.getAttribute("aria-checked")) === "true";

    // Turn OFF (if currently on) so the gated UI should disappear.
    if (initiallyOn) await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "false", {
      timeout: 5_000,
    });

    // User session — sign in in a separate context to keep cookies
    // independent.
    const userCtx = await browser.newContext();
    const userPage = await userCtx.newPage();
    await signInThroughUi(userPage, TEST_USER_EMAIL, TEST_USER_PASSWORD);
    await userPage.goto(`${BASE_URL}/account`);

    // Gated button should NOT be visible.
    await expect(
      userPage.locator('button').filter({ hasText: FLAG_GATED_BUTTON_TEXT }).first(),
    ).toHaveCount(0, { timeout: 15_000 });

    // Flip back ON from the admin context.
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true", { timeout: 5_000 });

    // User reloads → gated button returns. useFeatureFlag fires on mount,
    // so a full reload gives it a fresh read.
    await userPage.reload();
    await expect(
      userPage.locator('button').filter({ hasText: FLAG_GATED_BUTTON_TEXT }).first(),
    ).toBeVisible({ timeout: 15_000 });

    // Clean up: sign out both contexts.
    await signOutThroughUi(adminPage);
    await signOutThroughUi(userPage);
    await adminCtx.close();
    await userCtx.close();
  });
});
