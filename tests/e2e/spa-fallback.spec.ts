import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

const fallbackRoutes = ["/signin", "/ai-tutor", "/auth/callback"] as const;

test.describe("SPA fallback routes", () => {
  for (const route of fallbackRoutes) {
    test(`${route} returns 200 and renders the app shell`, async ({ page }) => {
      await expectSpaResponse(page, route);

      await expect(page.locator("#root")).toBeVisible();
      await expect(page.getByRole("img", { name: /mercy|mercy blade|teacher mercy/i }).first()).toBeVisible();
    });
  }
});
