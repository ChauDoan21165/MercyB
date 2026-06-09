import { expect, test } from "./fixtures/test";
import { hasTestUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";
import { expectSpaResponse } from "./routeSmoke";

const authenticatedRoutes = ["/progress", "/account", "/pricing"] as const;

test.describe("authenticated navigation", () => {
  test.skip(
    !hasTestUser(),
    "Skipping authenticated E2E: set masked TEST_USER_EMAIL and TEST_USER_PASSWORD CI variables.",
  );

  test("loads progress, account, and pricing without 404 or crash", async ({ page }) => {
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);

    for (const route of authenticatedRoutes) {
      await expectSpaResponse(page, route);
      await expect(page.locator("body")).not.toContainText(/errorboundary|something went wrong/i);
    }
  });
});
