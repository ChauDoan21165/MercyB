/**
 * Stage 3A — /weak-at empty / populated / partial state smoke.
 *
 * Anonymous learner only — the page is a read-only local-signal
 * surface (no auth, no Supabase, no network). The spec seeds the
 * three Stage-3A localStorage keys before navigation and asserts
 * the visible buckets line up with the seeded data.
 *
 * The three localStorage keys + their schemas are owned by the
 * sibling adapters (src/lib/stage-3a/adapters/*) and the design doc
 * docs/stage-3a/local-weakness-map-design.md §4. This spec encodes
 * fixtures inline so a future schema drift surfaces here loudly
 * rather than via a silently-empty UI.
 *
 * Seed pattern: `page.addInitScript` runs before the first script in
 * the page, so the data is in `localStorage` by the time
 * `LocalWeaknessMap` mounts and calls `aggregateLocalWeaknesses()`.
 */

import { test, expect, type Page } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

// ── localStorage keys — must match the adapters verbatim. ─────────────
const L1_KEY = "mb.stage3a.l1.recent";
const PLACEMENT_KEY = "mb.stage3a.placement.snapshot";
const PRONUNCIATION_KEY = "mb.stage3a.pronunciation.recent";

// ── Fixture data — chosen so taxonomy.ts returns descriptions for
// every tag (so the rendered UI populates rather than silently no-ops). ─
function l1Fixture() {
  // 5 entries: 3x vi_l1_3rd_person_s, 2x vi_l1_past_ed. Both are in
  // L1_DESCRIPTIONS so taxonomy resolves.
  const base = Date.UTC(2026, 4, 25);
  return [
    { tag: "vi_l1_3rd_person_s", ts: base + 1_000 },
    { tag: "vi_l1_3rd_person_s", ts: base + 2_000 },
    { tag: "vi_l1_3rd_person_s", ts: base + 3_000 },
    { tag: "vi_l1_past_ed", ts: base + 4_000 },
    { tag: "vi_l1_past_ed", ts: base + 5_000 },
  ];
}

function placementFixture() {
  return {
    cefr: "B1",
    weaknesses: ["past_tense_unmarked", "missing_articles"],
    completedAt: Date.UTC(2026, 4, 24),
    sessionId: "smoke-fixture-1",
  };
}

function pronunciationFixture() {
  // Three samples on the `th` phoneme — meets the ≥3-sample gate in
  // the aggregator. Accuracy at 30 to land firmly in the "needs
  // practice" band without tripping any banned-word copy.
  const base = Date.UTC(2026, 4, 26);
  return [
    { phoneme: "th", accuracy: 30, ts: base + 1_000 },
    { phoneme: "th", accuracy: 30, ts: base + 2_000 },
    { phoneme: "th", accuracy: 30, ts: base + 3_000 },
  ];
}

// ── Helpers ────────────────────────────────────────────────────────────

type Seed = {
  l1?: ReturnType<typeof l1Fixture>;
  placement?: ReturnType<typeof placementFixture>;
  pronunciation?: ReturnType<typeof pronunciationFixture>;
};

async function seedLocalStorage(page: Page, seed: Seed) {
  // Runs before any page script — guarantees the data is present
  // before `LocalWeaknessMap` reads from localStorage on mount.
  await page.addInitScript(
    ({ L1_KEY, PLACEMENT_KEY, PRONUNCIATION_KEY, seed }) => {
      try {
        if (seed.l1 !== undefined) {
          localStorage.setItem(L1_KEY, JSON.stringify(seed.l1));
        }
        if (seed.placement !== undefined) {
          localStorage.setItem(PLACEMENT_KEY, JSON.stringify(seed.placement));
        }
        if (seed.pronunciation !== undefined) {
          localStorage.setItem(
            PRONUNCIATION_KEY,
            JSON.stringify(seed.pronunciation),
          );
        }
      } catch {
        // Some browsers throw on localStorage in pre-render; the
        // page will degrade to its empty state — which is fine if
        // the test was for the empty case. Populated tests will
        // surface the failure as a missing-section assertion.
      }
    },
    { L1_KEY, PLACEMENT_KEY, PRONUNCIATION_KEY, seed },
  );
}

test.describe("Stage 3A /weak-at — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) empty state — no localStorage signal → empty-state card renders", async ({
    page,
  }) => {
    // No seed. The page should detect the empty state in the
    // aggregator and render the global empty card.
    await page.goto(`${BASE_URL}/weak-at`);

    // Page chrome is up.
    await expect(page.getByTestId("weak-at-title-vi")).toHaveText(
      "Điểm yếu của bạn",
    );
    await expect(page.getByTestId("weak-at-title-en")).toHaveText(
      "What you're working on",
    );

    // Empty state visible — the populated map is NOT mounted.
    await expect(page.getByTestId("local-weakness-empty")).toBeVisible();
    await expect(page.getByTestId("local-weakness-map")).toHaveCount(0);
    await expect(page.getByTestId("local-weakness-l1")).toHaveCount(0);
    await expect(page.getByTestId("local-weakness-placement")).toHaveCount(0);
    await expect(page.getByTestId("local-weakness-pronunciation")).toHaveCount(
      0,
    );
  });

  test("(2) populated state — all three sources seeded → three sections render", async ({
    page,
  }) => {
    await seedLocalStorage(page, {
      l1: l1Fixture(),
      placement: placementFixture(),
      pronunciation: pronunciationFixture(),
    });

    await page.goto(`${BASE_URL}/weak-at`);

    // Page chrome still up.
    await expect(page.getByTestId("weak-at-title-vi")).toHaveText(
      "Điểm yếu của bạn",
    );

    // All three section testids present; empty-state is NOT.
    await expect(page.getByTestId("local-weakness-map")).toBeVisible();
    await expect(page.getByTestId("local-weakness-l1")).toBeVisible();
    await expect(page.getByTestId("local-weakness-placement")).toBeVisible();
    await expect(
      page.getByTestId("local-weakness-pronunciation"),
    ).toBeVisible();
    await expect(page.getByTestId("local-weakness-empty")).toHaveCount(0);

    // Section headings — sanity-check the Vietnamese strings reach
    // the DOM (UTF-8 round-trip, taxonomy lookups resolved, etc.).
    await expect(page.getByText("Lỗi ngữ pháp hay gặp")).toBeVisible();
    await expect(page.getByText("Kết quả kiểm tra trình độ")).toBeVisible();
    await expect(page.getByText("Phát âm cần luyện")).toBeVisible();
  });

  test("(3) partial state — only L1 seeded → only L1 section renders", async ({
    page,
  }) => {
    await seedLocalStorage(page, { l1: l1Fixture() });

    await page.goto(`${BASE_URL}/weak-at`);

    // L1 section is up; the other two are not in the DOM.
    await expect(page.getByTestId("local-weakness-map")).toBeVisible();
    await expect(page.getByTestId("local-weakness-l1")).toBeVisible();
    await expect(page.getByTestId("local-weakness-placement")).toHaveCount(0);
    await expect(page.getByTestId("local-weakness-pronunciation")).toHaveCount(
      0,
    );
    // Empty state must NOT fire — the map is not globally empty.
    await expect(page.getByTestId("local-weakness-empty")).toHaveCount(0);
  });
});
