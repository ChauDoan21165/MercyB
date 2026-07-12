import { test, expect } from "./fixtures/test";
import { BASE_URL } from "./fixtures/env";
import type { Page } from "@playwright/test";

const SHARE_FLAG_ON = process.env.VITE_INTERFERENCE_PROFILE_SHARE === "true";

async function openCompletedResults(page: Page) {
  const sessionId = "share-e2e-session";
  await page.goto(BASE_URL);
  await page.evaluate((id) => {
    window.sessionStorage.setItem(
      `mb.placement.v3.results.${id}`,
      JSON.stringify({
        sessionId: id,
        completedAt: "2026-07-11T00:00:00.000Z",
        overallCefr: "A2",
        overallConfidence: 0.64,
        overallSummary: {
          en: "Mercy placed your current working level around A2.",
          vi: "Mercy xếp trình độ hiện tại của bạn khoảng A2.",
        },
        skills: [
          { modality: "writing", cefr: "A2", confidence: 0.66, summary: { en: "Writing sample.", vi: "Bài viết." }, scoreEligible: true },
          { modality: "speaking", cefr: "A2", confidence: 0.61, summary: { en: "Speaking sample.", vi: "Bài nói." }, scoreEligible: true },
        ],
        l1Flags: [
          {
            id: "final-consonants",
            severity: "high",
            label: { en: "Final consonants", vi: "Âm cuối" },
            evidence: { en: "The learner drops the final /t/ in next.", vi: "drops final /t/ in next" },
          },
        ],
        recommendations: [],
        strengths: [{ en: "Clear goals.", vi: "Mục tiêu rõ." }],
        gaps: [{ en: "Final consonant control.", vi: "Kiểm soát âm cuối." }],
        questionCount: 5,
        placementValidity: "valid",
      }),
    );
  }, sessionId);
  await page.goto(`${BASE_URL}/placement/results/${sessionId}`);
  await expect(page.getByText(/Overall level|Trình độ chung/i)).toBeVisible();
}

test.describe("placement Interference Profile share flag", () => {
  test.skip(SHARE_FLAG_ON, "run with VITE_INTERFERENCE_PROFILE_SHARE absent/off for the off assertion");

  test("completed placement hides the share block when the flag is off", async ({ page }) => {
    await openCompletedResults(page);
    await expect(page.getByTestId("interference-profile-share")).toHaveCount(0);
  });
});

test.describe("placement Interference Profile share enabled", () => {
  test.skip(!SHARE_FLAG_ON, "run with VITE_PLACEMENT_DECISION_VISIBLE=true and VITE_INTERFERENCE_PROFILE_SHARE=true");

  test("completed placement shows the share block when the flag is on", async ({ page }) => {
    await openCompletedResults(page);
    await expect(page.getByTestId("interference-profile-share")).toBeVisible();
    await expect(page.getByTestId("interference-profile-card")).toContainText(/MercyBlade/);
    await expect(page.getByTestId("interference-profile-card")).toContainText(/Âm cuối|Final consonants/i);
  });
});
