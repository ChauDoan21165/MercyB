import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3107";
const RUN_DASHBOARD_E2E = process.env.RUN_ADMIN_DASHBOARD_E2E === "1";

test.describe("Placement data-quality dashboard", () => {
  test.skip(!RUN_DASHBOARD_E2E, "Set RUN_ADMIN_DASHBOARD_E2E=1 with an admin session to run these flows.");

  test("renders the dashboard shell", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByRole("heading", { name: /placement v3 data quality/i })).toBeVisible();
  });

  test("shows issue count cards", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByText(/issue counts/i)).toBeVisible();
    await expect(page.getByText(/blockers/i)).toBeVisible();
  });

  test("shows taxonomy conflict bucket", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByText(/taxonomy conflicts/i)).toBeVisible();
  });

  test("shows orphan recommendation bucket", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByText(/orphan recommendations/i)).toBeVisible();
  });

  test("shows duplicate prompt bucket", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByText(/duplicate prompts/i)).toBeVisible();
  });

  test("shows CEFR inconsistency bucket", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByText(/cefr inconsistencies/i)).toBeVisible();
  });

  test("shows unresolved issue table", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByRole("heading", { name: /unresolved integrity issues/i })).toBeVisible();
  });

  test("refresh action remains available", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/placement-data-quality`);
    await expect(page.getByRole("button", { name: /refresh/i })).toBeVisible();
  });
});
