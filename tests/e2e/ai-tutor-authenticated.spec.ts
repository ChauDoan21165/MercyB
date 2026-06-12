import { expect, test } from "./fixtures/test";
import { hasTestUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";
import { expectSpaResponse } from "./routeSmoke";

test.describe("authenticated AI Tutor", () => {
  test.skip(
    !hasTestUser(),
    "Skipping authenticated E2E: set masked TEST_USER_EMAIL and TEST_USER_PASSWORD CI variables.",
  );

  test("renders topic path and opens an interactive tutor surface", async ({ page }) => {
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
    await expectSpaResponse(page, "/ai-tutor");

    await expect(page.getByTestId("ai-tutor-shell")).toBeVisible();
    await expect(page.getByTestId("teacher-mercy-mode-tabs")).toBeVisible();
    await page.getByRole("button", { name: /lộ trình|journey/i }).click();

    const topicPath = page.getByTestId("ai-tutor-journey-path");
    await expect(topicPath).toBeVisible();
    await expect(topicPath.getByRole("listitem")).toHaveCount(3);
    await expect(page.locator("body")).not.toContainText(/errorboundary|something went wrong/i);

    const topicOrStartControl = topicPath
      .getByRole("button")
      .or(topicPath.getByRole("link"))
      .first();
    await expect(topicOrStartControl).toBeVisible();
    await topicOrStartControl.click();

    await expect(
      page
        .getByTestId("ai-tutor-conversation")
        .or(page.getByTestId("ai-tutor-layout"))
        .or(page.getByTestId("ai-tutor-speak-practice")),
    ).toBeVisible();
  });
});
