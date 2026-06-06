/**
 * /practice/pronunciation — anonymous render + hardening smoke.
 *
 * The page is anon-viewable, content-browse only (no auth, no scorer, no
 * server call). This spec locks the hardening surface so it can't silently
 * regress:
 *   - both drill blocks mount
 *   - the self-compare recorder + its controls render with accessible names
 *   - tone-clip play buttons carry distinguishing accessible names and are
 *     keyboard-operable
 *   - the trust floor holds: no percent / score text anywhere
 *
 * Deliberately does NOT exercise real MediaRecorder/getUserMedia — mic
 * hardware is environment-fragile in headless CI. The recorder's device
 * failure paths are covered deterministically by the unit suite
 * (src/hooks/__tests__/usePronunciationRecorder.test.ts).
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices, installWebSpeechStubs } from "./fixtures/mocks";

test.describe("/practice/pronunciation — anon hardening", () => {
  test.beforeEach(async ({ page }) => {
    await installWebSpeechStubs(page, { transcript: "xe" });
    await blockExternalServices(page);
  });

  test("(1) both drill blocks mount", async ({ page }) => {
    await page.goto(`${BASE_URL}/practice/pronunciation`);
    await expect(page.getByTestId("pronunciation-drills-page")).toBeVisible();
    await expect(page.getByTestId("tone-pairs-section")).toBeVisible();
    await expect(page.getByTestId("vn-en-drills-section")).toBeVisible();
  });

  test("(2) self-compare recorder renders with a labelled, keyboard-focusable record button", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/practice/pronunciation`);
    await expect(page.getByTestId("self-compare-recorder")).toBeVisible();

    const recordBtn = page.getByTestId("self-compare-record");
    await expect(recordBtn).toBeVisible();
    // Accessible name (not just a decorative ● glyph).
    await expect(recordBtn).toHaveAccessibleName(/Thu âm giọng của bạn/i);
    // Keyboard-operable: it can hold focus.
    await recordBtn.focus();
    await expect(recordBtn).toBeFocused();
  });

  test("(3) tone-clip play buttons carry distinguishing accessible names", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/practice/pronunciation`);
    // Every tone clip gets a "Play: <syllable> — <tone> tone (...)" name so
    // screen-reader users can tell the dozens of play buttons apart.
    const named = page.getByRole("button", { name: /Play:\s*xe\b.*tone/i });
    await expect(named.first()).toBeVisible();
    // Still keyboard-operable.
    await named.first().focus();
    await expect(named.first()).toBeFocused();
  });

  test("(4) trust floor: no percent / score language on the page", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/practice/pronunciation`);
    await expect(page.getByTestId("pronunciation-drills-page")).toBeVisible();
    const bodyText = (await page.locator("main").innerText()) ?? "";
    expect(bodyText).not.toMatch(/\d+\s*%/);
    // Honest framing present instead.
    expect(bodyText).toMatch(/không có điểm số|không chấm điểm/i);
  });
});
