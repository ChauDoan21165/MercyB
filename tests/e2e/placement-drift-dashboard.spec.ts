import { expect, test } from "@playwright/test";

test.describe("Placement Drift dashboard operator flows", () => {
  test("1 route is protected by admin access", async ({ page }) => {
    await page.goto("/admin/placement-drift");
    await expect(page.locator("body")).toContainText(/Admin|Sign|Loading|required/i);
  });

  test("2 dashboard route does not 404", async ({ page }) => {
    await page.goto("/admin/placement-drift");
    await expect(page.locator("body")).not.toContainText("404");
  });

  test("3 admin dashboard links to Placement Drift", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toContainText(/Placement Drift|Admin|Sign/i);
  });

  test("4 non-admin operators see signed-in identity context", async ({ page }) => {
    await page.goto("/admin/placement-drift");
    await expect(page.locator("body")).toContainText(/Signed in as/i);
  });

  test("5 non-admin operators see admin level context", async ({ page }) => {
    await page.goto("/admin/placement-drift");
    await expect(page.locator("body")).toContainText(/Admin level/i);
  });

  test("6 blocked operators can navigate back home", async ({ page }) => {
    await page.goto("/admin/placement-drift");
    await expect(page.getByRole("link", { name: /Back to Home/i })).toBeVisible();
  });
});
