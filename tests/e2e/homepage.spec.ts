import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

test.describe("homepage", () => {
  test("loads with the MercyBlade logo and sign-in button", async ({ page }) => {
    await expectSpaResponse(page, "/");

    // Logo accessible name is "MercyBlade" (one word) on the homepage; allow the
    // spaced "Mercy Blade" variant used on other surfaces too. The old /mercy blade/i
    // (mandatory space) stopped matching the one-word alt and reddened scheduled runs.
    await expect(page.getByRole("img", { name: /mercy\s*blade/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
