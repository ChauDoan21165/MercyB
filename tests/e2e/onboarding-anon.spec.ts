/**
 * /onboarding — anonymous picker render + click-through.
 *
 * Anon-only. The page is the public pair-picker (locked #14): it must
 * load without a Supabase user, without an existing language pair in
 * localStorage, and without any backend round-trip on first render.
 *
 * The spec seeds nothing (clean anon) and asserts:
 *   1. The native step header renders in BOTH VI and EN (the step is
 *      pre-pick, so the page is intentionally bilingual rather than
 *      chrome-language-only).
 *   2. The two universal native choices ("Tiếng Việt", "English") are
 *      visible and clickable.
 *   3. Picking a native language advances the page to the target step
 *      and renders the target step header.
 *
 * Why not assert post-click localStorage state: the picker writes to
 * Supabase via a React-Query mutation on `Continue`, not on native
 * click. The intra-page step transition is a pure client navigation,
 * so the spec stops at "the next header appeared" and avoids a
 * fixture-dependent Supabase write assertion.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/onboarding — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) renders the bilingual native-step header on first load", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/onboarding`);

    // VI is the semantic <h1> on the native step — pre-pick, so the
    // header is bilingual peers (StepHeader.lang omitted).
    await expect(
      page.getByRole("heading", { name: "Tiếng mẹ đẻ của bạn là gì?", level: 1 }),
    ).toBeVisible();
    // EN sibling renders alongside — same `stepTitleStyle`, peer
    // divider. Match by exact text so a translation drift fails loudly.
    await expect(
      page.getByText("What's your native language?", { exact: true }),
    ).toBeVisible();

    // Both body lines are present (VI + EN peers).
    await expect(
      page.getByText("Mercy sẽ giải thích bài học bằng ngôn ngữ này.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Mercy will explain your lessons in this language.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("(2) shows both universal native choices (Tiếng Việt + English)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/onboarding`);

    // Each choice is rendered in its OWN language so both audiences
    // can self-identify regardless of the default chrome language.
    await expect(
      page.getByRole("button", { name: /Tiếng Việt/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^English$/ })).toBeVisible();

    // The Skip affordance is also up — picker is dismissable per the
    // entry-step contract (writes a safe en→[vi] / vi→[en] default).
    await expect(page.getByRole("button", { name: /Bỏ qua|Skip/ })).toBeVisible();
  });

  test("(3) picking Tiếng Việt advances to the target step", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/onboarding`);

    await page.getByRole("button", { name: /Tiếng Việt/ }).click();

    // Target step header appears. Single-language chrome is the
    // default once a native pick has been recorded (lang=chromeLang on
    // the target StepHeader), so we assert the VI title and the VI
    // body — the EN sibling is no longer rendered as a peer here.
    await expect(
      page.getByRole("heading", {
        name: "Bạn muốn học ngôn ngữ nào?",
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Chọn một hoặc nhiều — bạn có thể thêm hoặc bớt sau trong Cài đặt.",
        { exact: true },
      ),
    ).toBeVisible();

    // The native step's title is gone — we navigated forward, not
    // overlaid.
    await expect(
      page.getByRole("heading", { name: "Tiếng mẹ đẻ của bạn là gì?", level: 1 }),
    ).toHaveCount(0);
  });

  test("(4) `?direction=vn` deep-link from the marketing landing pre-flips the picker for English speakers", async ({
    page,
  }) => {
    // The English-speaker CTA on the marketing landing sends the
    // visitor here with `?direction=vn`. The page reads the param via
    // `useSearchParams()` and should still render a usable picker —
    // the deep-link contract is "open the picker", not "skip it".
    await page.goto(`${BASE_URL}/onboarding?direction=vn`);

    // Header still renders — query-string variant must not blank the
    // page or hard-redirect.
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();
    // At least one native choice button remains reachable.
    await expect(
      page.getByRole("button", { name: /Tiếng Việt|^English$/ }).first(),
    ).toBeVisible();
  });
});
