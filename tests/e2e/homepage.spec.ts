import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

test.describe("homepage", () => {
  test("loads with the MercyBlade logo and sign-in button", async ({ page }) => {
    await expectSpaResponse(page, "/");

    await expect(page.getByRole("img", { name: /mercy blade/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
