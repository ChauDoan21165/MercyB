import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

test.describe("AI Tutor", () => {
  test("loads without crashing and renders the topic path", async ({ page }) => {
    // Bare /ai-tutor with no language pair renders the "Choose Your Language"
    // onboarding picker (AiTutor.tsx: `if (!hasUrlPair && !hasStoredPair)`), so the
    // tutor shell never mounts. Seed the pair a real onboarded user carries — the
    // readAnonymousPair shape {native, targets[]} + the nativeLang mirror — before
    // navigating, so the shell renders. (Same gate diagnosed in the synthetic-learner
    // run #8b; this stale pre-gate e2e reddened scheduled runs.)
    await page.addInitScript(() => {
      localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
      localStorage.setItem("mercyblade.nativeLang", "vi");
    });
    await expectSpaResponse(page, "/ai-tutor");

    await expect(page.getByTestId("ai-tutor-shell")).toBeVisible();
    await expect(page.getByTestId("teacher-mercy-mode-tabs")).toBeVisible();
    await page.getByRole("button", { name: /lộ trình|journey/i }).click();

    const journeyPath = page.getByTestId("ai-tutor-journey-path");
    await expect(journeyPath).toBeVisible();
    await expect(journeyPath.getByRole("listitem")).toHaveCount(3);
    await expect(page.locator("body")).not.toContainText(/errorboundary|something went wrong/i);
  });
});
