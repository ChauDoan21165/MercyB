import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

test.describe("AI Tutor", () => {
  test("loads without crashing and renders the topic path", async ({ page }) => {
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
