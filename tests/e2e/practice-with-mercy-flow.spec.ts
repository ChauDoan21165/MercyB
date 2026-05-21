/**
 * Practice with Mercy CTA smoke.
 *
 * Verifies the IELTS topic CTA lands on /speak with lesson context, preloads
 * the sample answer sentence queue, scores one attempt, and reloads with
 * persisted lesson progress from user_room_progress.
 */

import { test, expect } from "./fixtures/test";
import {
  BASE_URL,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  hasTestUser,
} from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";
import { installWebSpeechStubs } from "./fixtures/mocks";

test.describe("Practice with Mercy lesson flow", () => {
  test.skip(
    !hasTestUser(),
    "Set TEST_USER_EMAIL + TEST_USER_PASSWORD. See tests/e2e/README.md.",
  );

  test.beforeEach(async ({ page }) => {
    await installWebSpeechStubs(page, {
      transcript: "I'm originally from Da Nang, a coastal city in central Vietnam.",
    });
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  });

  test("topic CTA opens Speak with lesson loaded and persists progress", async ({ page }) => {
    await page.goto(`${BASE_URL}/exam-prep/ielts/speaking/ielts_speaking_part1_hometown`);

    await page.getByRole("button", { name: /Luyện với Mercy|Practice with Mercy/i }).click();
    await expect(page).toHaveURL(/\/speak\?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown/);

    if (page.url().endsWith("/") || page.url().includes("/signin")) {
      test.skip(
        true,
        "Speak route redirected before rendering. Check auth and pronunciationScoringEnabled for TEST_USER.",
      );
    }

    await expect(page.getByTestId("lesson-practice-context")).toContainText("Hometown");
    await expect(page.locator("text=/I'm originally from|Đà Nẵng/i").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("text=/0% complete|Hoàn thành 0%/i").first()).toBeVisible();

    await page.getByRole("button", { name: /Start recording|Listening/i }).click();
    await expect(page.locator("text=/Great pronunciation|Good|Keep practicing|Phát âm/i").first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("text=/% complete|Hoàn thành/i").first()).not.toContainText("0%");

    await page.reload();
    await expect(page.getByTestId("lesson-practice-context")).toContainText("Hometown");
    await expect(page.locator("text=/% complete|Hoàn thành/i").first()).not.toContainText("0%", {
      timeout: 10_000,
    });
  });
});
