/**
 * /pricing — anonymous render smoke.
 *
 * Anon-only. `/pricing` (and its alias `/upgrade`) is the conversion
 * funnel terminus: every paywall CTA in the app lands here. The page
 * must render for an anonymous visitor without a Supabase user and
 * without the platform billing scripts (Stripe / Apple) being
 * reachable — both are blocked by `blockExternalServices`.
 *
 * Spec asserts:
 *   1. The bilingual hero header renders (EN brand line + VI subtitle).
 *   2. The "Cancel anytime" / "No hidden fees" trust strip is
 *      present — these strings have been load-bearing for app-store
 *      review and we want the regression to fail loudly if either
 *      goes missing.
 *   3. `/upgrade` aliases to the same page (no separate render).
 *
 * No checkout-button click is exercised: Stripe / Apple checkout
 * outbound calls are stubbed by `blockExternalServices` so a click
 * would either no-op or 200-with-stub-body — neither tests anything
 * meaningful about the page itself.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/pricing — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) hero header renders with bilingual brand copy", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pricing`);

    // EN brand line — the primary <h1> on the page.
    await expect(
      page.getByRole("heading", {
        name: "Get full access to all premium rooms",
        level: 1,
      }),
    ).toBeVisible();
    // VI subtitle — peer to the EN h1.
    await expect(
      page.getByText("Mở toàn bộ phòng học premium của MercyBlade", {
        exact: true,
      }),
    ).toBeVisible();
    // Plan-pace copy below the hero (EN + VI).
    await expect(
      page.getByText("Choose a plan that fits your learning pace. Upgrade anytime.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Chọn gói phù hợp với tốc độ học của bạn. Có thể nâng cấp bất cứ lúc nào.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(2) trust strip — 'Cancel anytime' + 'No hidden fees' visible", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pricing`);

    // Both strings are load-bearing for app-store policy review. If
    // either disappears (refactor, locale toggle), surface that
    // loudly here rather than as a store-rejection email weeks later.
    await expect(
      page.getByText("Cancel anytime", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("No hidden fees", { exact: true }),
    ).toBeVisible();
  });

  test("(3) `/upgrade` aliases to the same Pricing page", async ({ page }) => {
    await page.goto(`${BASE_URL}/upgrade`);

    // AppRouter.tsx maps `/upgrade` → same Pricing component. The
    // hero h1 is the cheapest proof that the alias renders the same
    // tree (no separate placeholder, no 404).
    await expect(
      page.getByRole("heading", {
        name: "Get full access to all premium rooms",
        level: 1,
      }),
    ).toBeVisible();
  });
});
