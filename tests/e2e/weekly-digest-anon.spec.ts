/**
 * /blog/weekly-digest — anonymous community-digest render smoke.
 *
 * Public per AppRouter.tsx + the page's own comment ("Public, no
 * auth required. Reads the latest weekly_digest_data row from
 * Supabase via the singleton client. Anon SELECT is allowed by the
 * RLS policy"). The Supabase fetch is not stubbed by
 * `blockExternalServices` (which targets OpenAI / Anthropic /
 * Stripe), so depending on dev-server env the data section can
 * resolve to any of `loading`, `loaded`, `empty`, or `error`. The
 * synchronous header chrome is invariant across all four — that's
 * what we assert here.
 *
 * Spec scope: header chrome + Blog back-link + one of the legitimate
 * data-section states. Click flows and data-content assertions are
 * out of scope (would require a fixture row in the test Supabase
 * project — not part of this MR).
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/blog/weekly-digest — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) hero header renders with bilingual VI/EN peers", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog/weekly-digest`);

    await expect(
      page.getByRole("heading", {
        name: "Cộng đồng MercyBlade — tuần qua",
        level: 1,
      }),
    ).toBeVisible();
    // EN peer line beneath the VI h1.
    await expect(
      page.getByText("MercyBlade community — this week in numbers", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(2) renders the privacy footer note (load-bearing for trust)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog/weekly-digest`);

    // Footer copy is rendered synchronously regardless of fetch
    // state — see WeeklyDigest.tsx render tree.
    await expect(
      page.getByText("Tổng hợp công khai, không có dữ liệu cá nhân của ai.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(3) renders one of the legitimate data-section states", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog/weekly-digest`);

    // Depending on whether the dev server can reach the test
    // Supabase project, the fetch resolves to loading → loaded /
    // empty / error. All four are legitimate; the spec asserts at
    // least one of the marker strings is visible.
    const loadingCopy = page.getByText("Đang tải dữ liệu cộng đồng…");
    const emptyCopy = page.getByText(
      "Tuần này chưa có dữ liệu. Quay lại vào thứ Hai tuần sau nhé.",
    );
    // "loaded" state surfaces the `Tuần …` eyebrow string; "error"
    // surfaces `Không tải được dữ liệu`. We don't pin which one — we
    // just want the section to materialize.
    const errorCopy = page.getByText(/Không tải được dữ liệu/);
    const loadedEyebrow = page.getByText(/^Tuần \d/);
    const anyVisible = await Promise.race([
      loadingCopy.first().waitFor({ state: "visible", timeout: 8_000 }).then(() => "loading").catch(() => null),
      emptyCopy.first().waitFor({ state: "visible", timeout: 8_000 }).then(() => "empty").catch(() => null),
      errorCopy.first().waitFor({ state: "visible", timeout: 8_000 }).then(() => "error").catch(() => null),
      loadedEyebrow.first().waitFor({ state: "visible", timeout: 8_000 }).then(() => "loaded").catch(() => null),
    ]);
    expect(anyVisible).not.toBeNull();
  });

  test("(4) Blog back-link points at /blog", async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/weekly-digest`);

    const backLink = page.locator('a[href="/blog"]').first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveText(/Blog/);
  });
});
