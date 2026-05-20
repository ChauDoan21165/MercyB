import { expect, test } from "./fixtures/test";
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, hasTestAdmin, BASE_URL } from "./fixtures/env";
import { signInThroughUi } from "./fixtures/auth";

test.describe("placement benchmark dashboard", () => {
  test.skip(!hasTestAdmin(), "Requires TEST_ADMIN_* credentials. See tests/e2e/README.md.");

  test.beforeEach(async ({ page }) => {
    await page.route("**/functions/v1/placement-v3-benchmark-report", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          runs: [
            {
              id: "run-1",
              suite_id: "suite",
              scenario_id: "beginner-a1",
              started_at: "2026-05-20T10:00:00.000Z",
              completed_at: "2026-05-20T10:01:00.000Z",
              status: "success",
              total_duration_ms: 60000,
              total_tokens_input: 1000,
              total_tokens_output: 250,
              estimated_cost_usd: 0.002,
            },
          ],
          steps: [
            {
              run_id: "run-1",
              scenario_id: "beginner-a1",
              step_id: "reading",
              modality: "reading",
              provider: "openai",
              model: "gpt-4o-mini",
              started_at: "2026-05-20T10:00:00.000Z",
              completed_at: "2026-05-20T10:00:02.000Z",
              duration_ms: 2000,
              status: "success",
              tokens_input: 500,
              tokens_output: 120,
              estimated_cost_usd: 0.0002,
              attempts: ["openai"],
              failover: false,
              error_code: null,
              error_message: null,
              cefr_estimate: "A1",
            },
          ],
        }),
      });
    });
    await signInThroughUi(page, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/placement-benchmarks`);
  });

  test("shows KPI cards", async ({ page }) => {
    await expect(page.getByTestId("placement-benchmark-dashboard")).toBeVisible();
    await expect(page.getByTestId("benchmark-kpis")).toContainText("P95 latency");
  });

  test("shows provider distribution", async ({ page }) => {
    await expect(page.getByTestId("provider-distribution-chart")).toBeVisible();
    await expect(page.getByText("Provider Distribution")).toBeVisible();
  });

  test("shows token and cost table", async ({ page }) => {
    await expect(page.getByText("Token and Cost Trends")).toBeVisible();
    await expect(page.getByText("beginner-a1")).toBeVisible();
  });

  test("shows worst-performing steps", async ({ page }) => {
    await expect(page.getByText("Worst Steps")).toBeVisible();
    await expect(page.getByText("reading")).toBeVisible();
  });

  test("shows regression panel", async ({ page }) => {
    await expect(page.getByTestId("benchmark-regression-warnings")).toBeVisible();
  });
});
