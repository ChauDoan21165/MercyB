import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

test.describe("sign-in page", () => {
  test("renders email, password, Google, and Facebook sign-in controls", async ({ page }) => {
    await expectSpaResponse(page, "/signin");

    await expect(page.getByRole("textbox", { name: /^Email$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /facebook/i })).toBeVisible();

    await page.getByRole("button", { name: /sign in with password/i }).click();
    await expect(page.getByRole("textbox", { name: /password/i })).toBeVisible();
  });
});
