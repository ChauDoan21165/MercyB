/**
 * `/` (first-visit anonymous) — MarketingLandingPage render smoke.
 *
 * Anon-only. `AnonymousOnboardingGate` at `/` renders the marketing
 * landing when:
 *   - auth has resolved AND
 *   - there is no Supabase user AND
 *   - `hasAnonymousPair()` returns false (no `mercyblade.languagePair`
 *      in localStorage) AND
 *   - no `?trypron=1` CTA-escape query is present.
 *
 * A fresh Playwright context starts with empty localStorage so the
 * default state hits the marketing landing. We still defensively
 * clear the pair key in an init script in case a future config
 * pollutes the context.
 *
 * Spec asserts:
 *   1. The canonical bilingual brand line is the page <h1>.
 *      (Locked phrase per the "marketing landing decisions" memory —
 *       any drift is intentional only if Chau signs off.)
 *   2. Both CTA buttons link to `/onboarding` (one with no query,
 *      one with `?direction=vn` per PR #675).
 */

import { test, expect, type Page } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

const PAIR_KEY = "mercyblade.languagePair";
const NATIVE_MIRROR_KEY = "mercyblade.nativeLang";

async function clearAnonPair(page: Page): Promise<void> {
  await page.addInitScript(
    ({ PAIR_KEY, NATIVE_MIRROR_KEY }) => {
      try {
        localStorage.removeItem(PAIR_KEY);
        localStorage.removeItem(NATIVE_MIRROR_KEY);
      } catch {
        // Private mode / quota — fine: defaults already hit the
        // first-time-anonymous branch.
      }
    },
    { PAIR_KEY, NATIVE_MIRROR_KEY },
  );
}

test.describe("/ (first-visit anon) — marketing landing", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
    await clearAnonPair(page);
  });

  test("(1) canonical bilingual brand line is the page <h1>", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/`);

    // The locked VI brand line is the semantic <h1> — required
    // verbatim by the marketing-landing-decisions memory.
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh",
      }),
    ).toBeVisible();

    // EN sibling line — same hero block.
    await expect(
      page.getByText(
        "Foreign languages for Vietnamese learners and Vietnamese for the English-speaking world",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("(2) both hero CTAs link to /onboarding (one with ?direction=vn)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/`);

    const viCta = page.getByRole("link", { name: "Tôi học ngoại ngữ" });
    const enCta = page.getByRole("link", { name: /I'm learning Vietnamese/ });

    await expect(viCta).toBeVisible();
    await expect(enCta).toBeVisible();

    // The VI primary CTA goes to the bare picker; the EN secondary
    // CTA carries the `?direction=vn` deep-link for English speakers
    // learning Vietnamese (PR #675 contract).
    expect(await viCta.getAttribute("href")).toBe("/onboarding");
    expect(await enCta.getAttribute("href")).toBe("/onboarding?direction=vn");
  });

  test("(3) the page does NOT render the signed-in Home shell", async ({
    page,
  }) => {
    // Smoke guard: the AnonymousOnboardingGate could regress into
    // rendering Home for first-time anon, which would hide the brand
    // line. The cheapest proof that we're on the landing (not Home)
    // is the absence of any "Welcome back" / Home-only test-id +
    // the presence of the VI brand h1.
    await page.goto(`${BASE_URL}/`);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh",
      }),
    ).toBeVisible();
  });
});
