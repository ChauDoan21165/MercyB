import { expect, test } from "./fixtures/test";
import { hasTestUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";

test.describe("authenticated sign-in", () => {
  test.skip(
    !hasTestUser(),
    "Skipping authenticated E2E: set masked TEST_USER_EMAIL and TEST_USER_PASSWORD CI variables.",
  );

  test("signs in and shows Account instead of Sign in", async ({ page }) => {
    await signInThroughUi(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);

    await expect(page.getByRole("link", { name: /account/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^sign in$/i })).toHaveCount(0);
  });
});
