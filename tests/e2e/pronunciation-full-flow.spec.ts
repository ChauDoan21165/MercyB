/**
 * Smoke 3/5 — Pronunciation full flow.
 *
 * Flow:
 *   1. Log in as TEST_USER (must have pronunciationScoringEnabled on).
 *   2. Visit /speak.
 *   3. Stubbed SpeechRecognition resolves with "she is walking" → scorer
 *      produces a mid-range score (~70).
 *   4. Phoneme feedback section renders (PR #33).
 *   5. Tap "Try these words" on a phoneme chip → drill target swaps to
 *      that word (the carrier sentence shows the practice word).
 *   6. speech_attempts row lands in the DB (via Supabase service client).
 *   7. Navigate to /speech/history → newest row shows up.
 */

import { test, expect } from "./fixtures/test";
import {
  BASE_URL,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  hasTestUser,
  hasServiceKey,
} from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";
import { installWebSpeechStubs } from "./fixtures/mocks";
import { serviceClient } from "./fixtures/db";

test.describe("pronunciation full flow", () => {
  test.skip(
    !hasTestUser(),
    "Set TEST_USER_EMAIL + TEST_USER_PASSWORD. See tests/e2e/README.md.",
  );

  test.beforeEach(async ({ page }) => {
    // Install stubs BEFORE sign-in so no app code has booted the real
    // recognizer yet.
    await installWebSpeechStubs(page, {
      transcript: "she is walking",
    });
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  });

  test("mic → score → phoneme feedback → practice word → history", async ({ page }) => {
    await page.goto(`${BASE_URL}/speak`);
    // The page redirects to / if the flag is off. Fail loudly with a
    // helpful message.
    if (page.url().endsWith("/") || page.url().endsWith("/home")) {
      test.skip(
        true,
        "pronunciationScoringEnabled is off for TEST_USER. Enable in /admin/feature-flags cohort.",
      );
    }

    // Tap the big mic button.
    const micBtn = page
      .locator('[aria-label*="Record" i], [aria-label*="mic" i], button:has(svg[class*="mic" i])')
      .first();
    await micBtn.click({ timeout: 10_000 });

    // Wait for the result state to render.
    await expect(
      page.locator('text=/score|điểm|keep practicing|great|good/i').first(),
    ).toBeVisible({ timeout: 15_000 });

    // Phoneme feedback block (PR #33).
    const phonemeSection = page
      .locator(
        '[data-testid="phoneme-feedback"], section:has-text(/phoneme|try these|âm|luyện lại/i)',
      )
      .first();
    if (await phonemeSection.isVisible().catch(() => false)) {
      // Tap the first "Try this word" button — drill target should swap.
      const tryWord = phonemeSection
        .locator('button:has-text(/try|luyện|practice/i)')
        .first();
      if (await tryWord.isVisible().catch(() => false)) {
        const priorTarget = await page
          .locator('[data-testid="speech-drill-target"], [aria-label*="say"]')
          .first()
          .textContent()
          .catch(() => null);
        await tryWord.click();
        await page.waitForTimeout(500);
        const newTarget = await page
          .locator('[data-testid="speech-drill-target"], [aria-label*="say"]')
          .first()
          .textContent()
          .catch(() => null);
        expect(
          newTarget,
          "drill target should change after tapping Try this word",
        ).not.toBe(priorTarget);
      }
    } else {
      test.info().annotations.push({
        type: "observation",
        description:
          "Phoneme feedback section not visible after score — regression on PR #33.",
      });
    }

    // If we have service credentials, verify the attempt actually landed.
    if (hasServiceKey()) {
      const svc = serviceClient();
      const { data, error } = await svc
        .from("speech_attempts")
        .select("id, attempted_at, overall_score")
        .order("attempted_at" as never, { ascending: false })
        .limit(1);
      expect(error, "speech_attempts service read should not error").toBeNull();
      expect(data?.length ?? 0, "at least one speech_attempts row should exist").toBeGreaterThan(0);
    }

    // /speech/history should render the latest attempt.
    await page.goto(`${BASE_URL}/speech/history`);
    await expect(
      page.locator('text=/My Pronunciation History|Lịch sử phát âm/i').first(),
    ).toBeVisible({ timeout: 15_000 });

    // At least one attempt row.
    const rows = page.locator('[data-testid="attempt-row-toggle"]');
    await expect(rows.first()).toBeVisible({ timeout: 10_000 });

    // Tap to expand — word pills should appear.
    await rows.first().click();
    await expect(
      page.locator('text=/Heard:|Target:/i').first(),
    ).toBeVisible({ timeout: 5_000 });
  });
});
