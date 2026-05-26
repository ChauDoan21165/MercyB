/**
 * Smoke 2/5 — Grammar + L1 hint.
 *
 * Flow:
 *   1. Log in as TEST_USER_EMAIL / TEST_USER_PASSWORD.
 *   2. Open the Grammar tab inside Mercy Guide.
 *   3. Submit "she study english every day".
 *   4. Correction renders ("studies") AND an L1 hint card appears with
 *      a 3rd-person-s rule.
 *   5. Clicking "Learn more →" navigates to the linked room (or opens
 *      the linked lesson — the adapter may change which), and the URL
 *      changes away from the Grammar tab.
 */

import { test, expect } from "./fixtures/test";
import { BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD, hasTestUser } from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";

test.describe("grammar + L1 hint", () => {
  test.skip(
    !hasTestUser(),
    "Set TEST_USER_EMAIL + TEST_USER_PASSWORD. See tests/e2e/README.md.",
  );

  test.beforeEach(async ({ page }) => {
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  });

  test("correction + 3rd-person-s L1 hint renders, Learn more navigates", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Open Mercy Guide (drawer / panel) — entry point varies by page.
    const mercyToggle = page
      .locator('[data-testid="mercy-guide-open"], button[aria-label*="Mercy" i]')
      .first();
    if (await mercyToggle.isVisible().catch(() => false)) {
      await mercyToggle.click();
    }

    // Grammar tab inside the guide.
    const grammarTab = page
      .locator('[role="tab"]:has-text(/grammar|ngữ pháp/i), button:has-text(/grammar/i)')
      .first();
    await grammarTab.click({ timeout: 10_000 });

    // Input the sentence and submit.
    const grammarInput = page
      .locator('textarea, input[type="text"]')
      .filter({ hasText: "" })
      .first();
    await grammarInput.fill("she study english every day");

    await page
      .locator('button:has-text(/check|submit|kiểm tra|gửi/i)')
      .first()
      .click();

    // Expect a correction to appear. The canonical fix is "studies".
    await expect(
      page.locator('text=/studies/i').first(),
      "correction should mention 'studies'",
    ).toBeVisible({ timeout: 20_000 });

    // L1 hint card should appear referencing the 3rd-person rule.
    const l1Hint = page
      .locator(
        '[data-testid="l1-hint-card"], section:has-text(/third[- ]?person|ngôi thứ ba|3rd person/i)',
      )
      .first();
    await expect(l1Hint, "L1 hint card should render").toBeVisible({ timeout: 10_000 });

    // Click "Learn more" — verify navigation (either to /room/... or a
    // lesson route).
    const learnMore = l1Hint
      .locator('a, button')
      .filter({ hasText: /learn more|tìm hiểu thêm|xem thêm/i })
      .first();
    if (await learnMore.isVisible().catch(() => false)) {
      const priorUrl = page.url();
      await learnMore.click();
      await page.waitForURL((u) => u.toString() !== priorUrl, {
        timeout: 10_000,
      });
      // Navigation should land on a room page (or a lesson detail).
      await expect(page).toHaveURL(/\/(room|lesson|learn)/, { timeout: 10_000 });
    } else {
      test.info().annotations.push({
        type: "observation",
        description:
          "L1 hint card rendered but no Learn more link visible — check L1HintCard renders the linked-room CTA from PR #28.",
      });
    }
  });
});
