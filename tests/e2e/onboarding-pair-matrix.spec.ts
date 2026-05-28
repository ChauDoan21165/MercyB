/**
 * /onboarding — pair-matrix (target step) → home entry. Anon.
 *
 * Coverage gap closure: the existing `onboarding-anon.spec.ts` covers
 * the native step and asserts that picking a native advances to the
 * target step header. It does NOT exercise the pair-matrix itself or
 * the navigation off the target step into `/` (home), which is the
 * single most-trafficked anon learner path post-pair-pick.
 *
 * This spec adds two assertions over that path:
 *
 *   (1) Happy path — anon picks VI native, accepts the recommended
 *       English target (pre-checked on entry per the product's
 *       "recommended: true" flag for `en` in `TARGET_MENU.vi`),
 *       clicks "Tiếp tục" (Continue), and lands on `/` (the
 *       HOME_ROUTE per `OnboardingPage.tsx`'s `handleFinish`
 *       contract). After navigation,
 *       `localStorage["mercyblade.languagePair"]` holds the picked
 *       pair — confirming the anon-only write path documented at
 *       `src/lib/languagePair/anonymousPair.ts`.
 *
 *   (2) Failure-mode / regression guard — toggling the pre-checked
 *       target off re-disables Continue. The "you cannot finish with
 *       zero targets" invariant is enforced at `OnboardingPage.tsx:1018`
 *       (`disabled={draft.target_languages.length === 0}`); without
 *       it, an anon visitor could accidentally finish onboarding with
 *       no pair stored. Toggling the target back on must re-enable
 *       the button — proves the disable isn't a one-way trap.
 *
 * Two product-shape facts this spec pinned during initial authoring:
 *   - The native picker renders options as `role="radio"` inside a
 *     `radiogroup`, not `role="button"`. (Page snapshot confirmed.)
 *   - The target step *pre-checks* the `recommended: true` option
 *     for the chosen native (`en` for vi). Continue is therefore
 *     ENABLED on first render of the target step. The failure-mode
 *     test below has to toggle the pre-check off before it can
 *     assert disabled-state.
 *
 * Why these two, not more: per the dispatch — one flow, one PR. The
 * `start_with` (>1 target → primary pick) sub-flow is intentionally
 * skipped to keep the surface tight; it's a follow-up if the single-
 * target path turns out flaky.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/onboarding — anon pair-matrix entry", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
    // Defensive: clear anon-pair storage so a previous spec run can't
    // skip the picker via the AppRouter `/` gate. AppRouter routes a
    // returning anon visitor with an existing pair directly to home —
    // which would bypass the very thing this spec is testing.
    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem("mercyblade.languagePair");
        window.localStorage.removeItem("mercyblade.nativeLang");
      } catch {
        // SSR / private browsing / disabled storage — safe to ignore.
      }
    });
  });

  test("(1) happy path: native → accept pre-checked English target → Continue navigates to / and writes the pair to localStorage", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/onboarding`);

    // Step 1 — pick VI native. Choices are `role="radio"` inside the
    // "Native language" radiogroup (not buttons).
    await page.getByRole("radio", { name: /Tiếng Việt/ }).click();

    // Step 2 — the pair-matrix renders. `OnboardingPage.tsx:296` sets
    // the group's aria-label = "Target languages"; scoping queries to
    // it avoids accidental matches in surrounding chrome.
    const matrix = page.getByRole("group", { name: "Target languages" });
    await expect(matrix).toBeVisible();

    // Tiếng Anh (English) is the recommended option for vi-native and
    // is pre-checked on first render of the target step. We verify
    // the pre-check rather than toggling — that IS the happy path.
    const englishOption = matrix.getByRole("checkbox", {
      name: /Tiếng Anh/,
    });
    await expect(englishOption).toBeChecked();

    // Continue is enabled because at least one target is selected.
    // Chrome is single-language (vi) past the native pick, so the
    // button label is `ONBOARDING_COPY.continue.vi` = "Tiếp tục".
    const continueBtn = page.getByRole("button", { name: /^Tiếp tục$/ });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    // Single-target Continue FINISHES (no `start_with` step). The
    // `HOME_ROUTE` is "/" — `OnboardingPage.tsx:699`. Wait for the
    // pathname to flip before asserting localStorage to avoid a race.
    await page.waitForURL((u) => {
      const url = new URL(u, BASE_URL);
      return url.pathname === "/";
    });

    // The anon pair is written to localStorage at
    // `mercyblade.languagePair` (per `anonymousPair.ts:28`). Shape:
    // {"native":"vi","targets":["en", ...]}.
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("mercyblade.languagePair"),
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? "{}") as {
      native?: string;
      targets?: string[];
    };
    expect(parsed.native).toBe("vi");
    expect(Array.isArray(parsed.targets)).toBe(true);
    expect(parsed.targets).toContain("en");
  });

  test("(2) failure-mode guard: toggling the pre-checked target off re-disables Continue; toggling back on re-enables", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/onboarding`);
    await page.getByRole("radio", { name: /Tiếng Việt/ }).click();

    const matrix = page.getByRole("group", { name: "Target languages" });
    await expect(matrix).toBeVisible();

    const englishOption = matrix.getByRole("checkbox", {
      name: /Tiếng Anh/,
    });
    const continueBtn = page.getByRole("button", { name: /^Tiếp tục$/ });

    // Initial state — English is pre-checked, Continue is enabled.
    await expect(englishOption).toBeChecked();
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toBeEnabled();

    // Toggle English off — Continue re-disables. This is the
    // load-bearing invariant: an anon visitor cannot navigate forward
    // with zero targets selected, even after un-picking the default.
    await englishOption.click();
    await expect(englishOption).not.toBeChecked();
    await expect(continueBtn).toBeDisabled();

    // Toggle English back on — Continue re-enables. Proves the
    // disabled state is responsive to user input, not a one-way trap.
    await englishOption.click();
    await expect(englishOption).toBeChecked();
    await expect(continueBtn).toBeEnabled();
  });
});
