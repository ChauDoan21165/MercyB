import { test } from "@playwright/test";
import { expectSpaResponse } from "./routeSmoke";

const deepRoutes = ["/pricing", "/progress", "/account", "/ai-tutor"] as const;

test.describe("deep routes", () => {
  for (const route of deepRoutes) {
    test(`${route} loads the SPA without a 404`, async ({ page }) => {
      await expectSpaResponse(page, route);
    });
  }
});
