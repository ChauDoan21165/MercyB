import { expect, test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

const fallbackRoutes = ["/signin", "/ai-tutor", "/auth/callback"] as const;

test.describe("SPA fallback routes", () => {
  for (const route of fallbackRoutes) {
    test(`${route} returns 200 and renders the app shell`, async ({ page }) => {
      await expectSpaResponse(page, route);

      await expect(page.locator("#root")).toBeVisible();
      if (route === "/ai-tutor") {
        await expect(page.locator("body")).toContainText(/ai tutor|mercy|sign in|đăng nhập/i);
      } else {
        await expect(page.getByRole("complementary", { name: /mercy blade/i })).toBeVisible();
      }
    });
  }
});
