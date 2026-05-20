import { expect, test } from "@playwright/test";

test.describe("Placement V3 B1 endurance safety", () => {
  test("keeps Placement V3 gated off without explicit test flags", async ({ page }) => {
    await page.goto("/placement/test/b1-endurance-safety");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: /Submit answer/i })).toHaveCount(0);
  });
});
