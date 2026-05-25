/**
 * Smoke — placement → first lesson (anon happy path).
 *
 * Closes the runbook at docs/runbooks/placement-to-lesson.md.
 * Distinct from the existing placement specs:
 *   - placement-v3.spec.ts        starts at /placement, stops at Results.
 *   - auth-and-placement.spec.ts  is signed-in + writes to Supabase.
 *
 * This spec enters from the Home `Placement test` CTA (anon), walks the
 * v3 task set the existing happy-path test exercises, and clicks the
 * first `Start this lesson` button on Results to confirm the
 * `/room/:roomId` hop. Read-only end-to-end: no DB writes, no PII, no
 * Supabase event sync (mirrors safety invariants in the runbook).
 */

import { test, expect } from "./fixtures/test";
import { BASE_URL } from "./fixtures/env";

const placementV3Enabled =
  process.env.E2E_PLACEMENT_V3_ENABLED === "true" ||
  process.env.VITE_PLACEMENT_TEST_ENABLED === "true";

test.describe("placement → first lesson (anon happy path)", () => {
  test.skip(
    !placementV3Enabled,
    "Placement v3 routes are compile-time gated off by default. Run with a build that enables PLACEMENT_TEST_ENABLED and PLACEMENT_V3_UI_ENABLED.",
  );

  test("anon Home CTA → placement → Results → first lesson room URL", async ({ page }) => {
    // Step 1 + 2 — anon Home renders the Placement test CTA; click it.
    await page.goto(`${BASE_URL}/`);
    const placementCta = page.getByRole("button", { name: "Placement test" });
    await expect(placementCta).toBeVisible();
    await placementCta.click();
    await page.waitForURL(/\/placement(?:\b|$)/);

    // Step 3 — Welcome → Start.
    await expect(
      page.getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu/i),
    ).toBeVisible();
    await page.getByRole("button", { name: /Start placement test/i }).click();

    // Step 4 — Who-for picker.
    await page.getByRole("button", { name: /adult learner/i }).click();

    // Step 5 — five tasks. Uses the same placeholder text the existing
    // v3 happy-path spec uses verbatim so the bar stays consistent.
    await page
      .getByLabel(/Writing answer/i)
      .fill(
        "I study English every day because I need it for work and interviews. I want better grammar this month.",
      );
    await page.getByRole("button", { name: /Submit answer/i }).click();

    await page
      .getByLabel(/Transcript or typed answer/i)
      .fill("I am learning English for work and for a future interview.");
    await page.getByRole("button", { name: /Submit answer/i }).click();

    await page
      .getByRole("radio", { name: /Send three feedback slides/i })
      .click();
    await page.getByRole("button", { name: /Submit answer/i }).click();

    await page.getByRole("radio", { name: /the bus is delayed/i }).click();
    await page.getByRole("button", { name: /Submit answer/i }).click();

    await page
      .getByLabel(/Conversation answer/i)
      .fill(
        "I want an office job where I can email customers and speak clearly in meetings.",
      );
    await page.getByRole("button", { name: /Submit answer/i }).click();

    // Step 6 — Results page shows recommendations.
    await expect(page.getByText(/Start here|Bắt đầu từ đây/i)).toBeVisible();
    const firstLessonBtn = page
      .getByRole("button", { name: /Start this lesson · Bắt đầu bài này/i })
      .first();
    await expect(firstLessonBtn).toBeEnabled();

    // Step 7 — first-lesson click → /room/:roomId.
    await firstLessonBtn.click();
    await page.waitForURL(/\/room\/[^/]+$/);
    expect(page.url()).toMatch(/\/room\/[^/]+$/);
  });
});
