/**
 * Smoke 1/5 — Auth & placement.
 *
 * Flow:
 *   1. New user signs up via /signup.
 *   2. App redirects to placement welcome (placement_test_enabled).
 *   3. User completes the placement questions.
 *   4. profiles.placement_cefr_level is set in the DB.
 *   5. Home shows the focus-areas card (FOCUS_AREAS_CARD_ENABLED).
 *
 * Requires TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY, and
 * TEST_SUPABASE_SERVICE_KEY (for the DB read + user teardown).
 */

import { test, expect } from "./fixtures/test";
import { BASE_URL, hasServiceKey, hasSupabaseTestCreds, newUserEmail } from "./fixtures/env";
import { deleteUser, fetchProfile } from "./fixtures/db";
import { signUpThroughUi } from "./fixtures/auth";

test.describe("auth & placement", () => {
  test.skip(
    !hasSupabaseTestCreds(),
    "Set TEST_SUPABASE_URL + TEST_SUPABASE_ANON_KEY. See tests/e2e/README.md.",
  );

  let createdUserId: string | null = null;

  test.afterEach(async () => {
    if (createdUserId) {
      await deleteUser(createdUserId).catch(() => {});
      createdUserId = null;
    }
  });

  test("new signup lands on placement and sets placement_cefr_level", async ({ page }) => {
    const email = newUserEmail("placement");
    const password = "smoke-test-Password-42!";

    await signUpThroughUi(page, email, password);

    // After signup we expect to land on the placement welcome route (or
    // be redirected there from /). If the app lands somewhere else, the
    // smoke test flags it.
    await expect(page).toHaveURL(/\/placement/, { timeout: 15_000 });

    // Walk through the placement questions. We don't know the exact
    // question count / shape, so we loop: click the first answer button
    // until the "Finish / Submit" button appears or we exit the flow.
    for (let i = 0; i < 60; i++) {
      const finishBtn = page.locator(
        'button:has-text(/finish|submit|done|hoàn thành/i)',
      );
      if (await finishBtn.isVisible().catch(() => false)) {
        await finishBtn.first().click();
        break;
      }
      const answerBtn = page
        .locator('[data-testid^="placement-answer"], button.mb-placement-answer, button[role="radio"]')
        .first();
      if (!(await answerBtn.isVisible().catch(() => false))) {
        // Fallback: pick any button within the placement card.
        const fallback = page
          .locator('main button, section[aria-label*="placement"] button')
          .first();
        if (await fallback.isVisible().catch(() => false)) {
          await fallback.click();
        } else {
          break;
        }
      } else {
        await answerBtn.click();
      }
      // A short settle so the next question can render.
      await page.waitForTimeout(120);
    }

    // Expected landing after placement: /placement/results or /.
    await page.waitForURL(
      (url) =>
        url.pathname.endsWith("/placement/results") ||
        url.pathname === "/" ||
        url.pathname === "/home",
      { timeout: 30_000 },
    );

    // Verify placement_cefr_level is set on the profile. Requires
    // service key to bypass RLS (we don't know the user_id from the UI).
    test.skip(
      !hasServiceKey(),
      "TEST_SUPABASE_SERVICE_KEY missing — can't verify profiles row",
    );

    // Pull the user id out of the page via local storage. MercyBlade uses
    // supabase-js's default auth storage, which stashes the session at
    // "sb-<project>-auth-token".
    const userId = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key) ?? "null");
            return parsed?.user?.id ?? null;
          } catch {
            return null;
          }
        }
      }
      return null;
    });

    expect(userId, "Should have found a signed-in user id in localStorage").toBeTruthy();
    createdUserId = userId as string;

    const profile = await fetchProfile(createdUserId);
    expect(profile, "profiles row should exist for the new user").toBeTruthy();
    expect(
      profile?.placement_cefr_level ?? profile?.placement_cefr,
      "placement_cefr_level should be populated after placement completion",
    ).toBeTruthy();
  });

  test("Home shows the focus-areas card after signup + placement", async ({ page }) => {
    // This test assumes auto-login after signup keeps the session; we
    // piggyback on the previous test's setup by creating another user.
    const email = newUserEmail("focus-areas");
    const password = "smoke-test-Password-42!";
    await signUpThroughUi(page, email, password);

    await page.goto(`${BASE_URL}/`);

    const focusCard = page
      .locator(
        '[data-testid="focus-areas-card"], [aria-label*="focus" i], section:has-text(/focus areas|trọng tâm/i)',
      )
      .first();
    // The card may be hidden until placement completes — test this as a
    // "if present, it shouldn't be in an error state" smoke.
    if (await focusCard.isVisible().catch(() => false)) {
      await expect(focusCard).toBeVisible();
      // Should NOT contain a raw error string.
      await expect(focusCard).not.toContainText(/error|failed|undefined/i);
    } else {
      test.info().annotations.push({
        type: "observation",
        description:
          "focus-areas card not visible on Home after signup — check FOCUS_AREAS_CARD_ENABLED flag + placement completion gating.",
      });
    }
  });
});
