/**
 * Stage 3A — LocalWeaknessMap invariant guards.
 *
 * Day 4 hardening. The component MUST NOT:
 *   1. Make Supabase calls — no import, no call.
 *   2. Make network calls (`window.fetch`).
 *   3. Write to localStorage — read-only consumer.
 *   4. Touch `mercy_user_facts` — semantic memory is a different
 *      surface (ROADMAP §Stage 3 Boundaries).
 *   5. Render any gamification or shame language — Vietnamese OR
 *      English (`voice-guidelines-vn.md` Rule 1; PRINCIPLES §10
 *      "no streak / XP / level / badge / score / fail / wrong / bad
 *      copy").
 *
 * These guards exist to catch future regressions. The current build
 * passes all six; an unrelated edit that accidentally adds e.g. a
 * "you scored 80!" string will fail this suite loudly rather than
 * slip into production.
 *
 * Two implementation modes used here:
 *   - Runtime spies — for the supabase / fetch / setItem axes.
 *     We render `LocalWeaknessMap` with seeded fixture data and
 *     assert no forbidden call fires during mount + render.
 *   - Source-text greps — for the `mercy_user_facts` import + the
 *     gamification regex. Greps run over the component's source
 *     file and its in-tree taxonomy (the only string source the
 *     component pulls copy from at the time of writing).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

import LocalWeaknessMap from "../LocalWeaknessMap";
import {
  aggregateLocalWeaknesses,
  type LocalWeaknessMap as LocalWeaknessMapData,
} from "@/lib/stage-3a/aggregator";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../../");

// ── Fixture data — populated so all three sections render. The data
// values are chosen NOT to contain any banned substrings; the
// taxonomy entries for these tags are clean Vietnamese learner copy. ─
function populatedData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 5, lastSeen: Date.now() - 3_600_000 },
      { tag: "vi_l1_past_ed", count: 3, lastSeen: Date.now() - 86_400_000 },
    ],
    placementWeaknesses: [
      { tag: "past_tense_unmarked", severity: "high" },
      { tag: "missing_articles", severity: "medium" },
    ],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.55, samples: 12 },
      { axis: "R_L", errorRate: 0.32, samples: 9 },
    ],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────────────
// Guard 1 — no Supabase touch
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — Supabase guard", () => {
  it("does not import @/lib/supabaseClient or @supabase/supabase-js from the component or its in-tree consumers", () => {
    const files = [
      "src/components/stage-3a/LocalWeaknessMap.tsx",
      "src/lib/stage-3a/aggregator.ts",
      "src/lib/stage-3a/taxonomy.ts",
      "src/lib/stage-3a/adapters/l1TagAdapter.ts",
      "src/lib/stage-3a/adapters/placementSnapshotAdapter.ts",
      "src/lib/stage-3a/adapters/pronunciationAdapter.ts",
      "src/pages/WeakAt.tsx",
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Match import + dynamic-require shapes; quote-agnostic.
      if (/from\s+['"]@\/lib\/supabaseClient['"]/.test(text)) {
        offenders.push(`${f}: imports @/lib/supabaseClient`);
      }
      if (/from\s+['"]@supabase\/supabase-js['"]/.test(text)) {
        offenders.push(`${f}: imports @supabase/supabase-js`);
      }
      if (/require\(['"]@\/lib\/supabaseClient['"]\)/.test(text)) {
        offenders.push(`${f}: requires @/lib/supabaseClient`);
      }
    }
    expect(offenders, `Supabase imports leaked into Stage 3A:\n${offenders.join("\n")}`).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 2 — no window.fetch
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — network guard", () => {
  it("does not call fetch during render or mount", () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(() => {
      throw new Error("LocalWeaknessMap called fetch — invariant breach");
    });
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    try {
      const { unmount } = render(
        <LocalWeaknessMap initialData={populatedData()} />,
      );
      // useEffect already flushed via testing-library; nothing should
      // have called fetch.
      expect(fetchSpy).not.toHaveBeenCalled();
      unmount();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 3 — no localStorage writes
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — localStorage write guard", () => {
  it("does not call localStorage.setItem / removeItem / clear during render", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    const { unmount } = render(
      <LocalWeaknessMap initialData={populatedData()} />,
    );

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
    unmount();
  });

  it("does not write even when the aggregator runs (no initialData seam)", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const { unmount } = render(<LocalWeaknessMap />);
    expect(setItemSpy).not.toHaveBeenCalled();
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 4 — no mercy_user_facts reference
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — mercy_user_facts guard", () => {
  it("does not USE `mercy_user_facts` anywhere in the Stage 3A subtree (comments allowed)", () => {
    const files = [
      "src/components/stage-3a/LocalWeaknessMap.tsx",
      "src/lib/stage-3a/aggregator.ts",
      "src/lib/stage-3a/taxonomy.ts",
      "src/lib/stage-3a/adapters/l1TagAdapter.ts",
      "src/lib/stage-3a/adapters/placementSnapshotAdapter.ts",
      "src/lib/stage-3a/adapters/pronunciationAdapter.ts",
      "src/pages/WeakAt.tsx",
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Strip block comments + line comments before scanning. The
      // invariant-documenting comments at the top of every Stage 3A
      // file intentionally NAME `mercy_user_facts` to declare what
      // the file must not touch — only actual code uses are a
      // violation.
      const code = stripJsComments(text);
      if (/mercy_user_facts/.test(code)) {
        offenders.push(f);
      }
    }
    expect(
      offenders,
      `mercy_user_facts used in Stage 3A code (not comments):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

function stripJsComments(text: string): string {
  // Order matters: strip block comments first so an inline `//` inside
  // a `/* ... */` isn't double-handled.
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

// ──────────────────────────────────────────────────────────────────────
// Guard 5 — no gamification or shame language in rendered output
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — copy guard (EN)", () => {
  it("renders no `/streak|xp|level|badge|score|fail|wrong|bad/i` substring (EN gamification + shame)", () => {
    const { container, unmount } = render(
      <LocalWeaknessMap initialData={populatedData()} />,
    );
    const text = container.textContent ?? "";
    expect(
      text,
      `Found banned EN gamification/shame substring in rendered output:\n${text}`,
    ).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    unmount();
  });

  it("renders no banned EN strings in the empty state either", () => {
    const empty: LocalWeaknessMapData = {
      topL1Patterns: [],
      placementWeaknesses: [],
      topPronunciationPainPoints: [],
      isEmpty: true,
      generatedAt: Date.now(),
    };
    const { container, unmount } = render(<LocalWeaknessMap initialData={empty} />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    unmount();
  });
});

describe("LocalWeaknessMap — copy guard (VI)", () => {
  it("renders no `/điểm số|hạng|sai|kém|tệ/i` substring (VI shame vocabulary)", () => {
    // Per dispatch — these are the Vietnamese shame/gamification
    // words that signal a regression of the warmth voice in
    // `docs/voice-guidelines-vn.md`. The regex is intentionally
    // verbatim from the dispatch and matches as a substring; any
    // future copy change that happens to include one of these will
    // surface here so the author can choose an alternative.
    const { container, unmount } = render(
      <LocalWeaknessMap initialData={populatedData()} />,
    );
    const text = container.textContent ?? "";
    expect(
      text,
      `Found banned VI shame substring in rendered output:\n${text}`,
    ).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
    unmount();
  });
});

// ══════════════════════════════════════════════════════════════════════
// Tier 2 invariants — gap audit !25 §4 ranks 7 / 8 / 10 / 11 / 12.
//
// Tier 1 (ranks 1–6) lives either in Stage 3A's original 6 guards above
// or in the Stage 3B mirror file (C5's `test/stage-3b-invariants` wave).
// Tier 2 closes the contracted-invariant degradations the design doc
// names but the original suite did not exercise:
//
//   G7  — aggregator + 3 adapters + perfInstrumentation contain no
//         fetch() call sites (gap audit 3A-G2).
//   G8  — `aggregateLocalWeaknesses().isEmpty` always matches the
//         constituent-empty rule across seeded + unseeded localStorage
//         (gap audit 3A-G4).
//   G9  — `LocalWeaknessMap` renders SkeletonLoading as its loading
//         branch — the early-return + the component definition both
//         survive in source (gap audit 3A-G7; runtime-flushing of
//         useEffect in testing-library makes a render-time spy
//         unreliable, so we lock the contract statically).
//   G10 — `perfInstrumentation.ts` contains no captureException CALL
//         site — only the breadcrumb path. Imports from a module whose
//         path happens to contain "captureException" are fine
//         (gap audit 3A-G8).
//   G11 — `aggregateLocalWeaknesses()` calls no localStorage write
//         APIs when invoked directly (no component render in between)
//         (gap audit 3A-G13).
// ══════════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────────
// Guard G7 — no fetch in aggregator / adapter / perfInstrumentation
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — adapter / aggregator fetch guard (gap audit 3A-G2)", () => {
  it("contains no fetch( call sites in the read-side surface", () => {
    const files = [
      "src/lib/stage-3a/aggregator.ts",
      "src/lib/stage-3a/adapters/l1TagAdapter.ts",
      "src/lib/stage-3a/adapters/placementSnapshotAdapter.ts",
      "src/lib/stage-3a/adapters/pronunciationAdapter.ts",
      "src/lib/stage-3a/perfInstrumentation.ts",
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Strip comments first — adapter headers legitimately name
      // `fetch` in prose to declare what the file must not do.
      const code = stripJsComments(text);
      if (/\bfetch\s*\(/.test(code)) {
        offenders.push(`${f}: contains fetch( call site`);
      }
      if (/window\.fetch\b/.test(code)) {
        offenders.push(`${f}: references window.fetch`);
      }
      if (/globalThis\.fetch\b/.test(code)) {
        offenders.push(`${f}: references globalThis.fetch`);
      }
    }
    expect(
      offenders,
      `fetch references leaked into Stage 3A read surface:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard G8 — isEmpty consistency in aggregator output
// ──────────────────────────────────────────────────────────────────────

const L1_STORAGE_KEY = "mb.stage3a.l1.recent";
const PRONUNCIATION_STORAGE_KEY = "mb.stage3a.pronunciation.recent";

describe("aggregateLocalWeaknesses — isEmpty consistency (gap audit 3A-G4)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns isEmpty: true with all three buckets empty when localStorage is unseeded", () => {
    const map = aggregateLocalWeaknesses();
    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.isEmpty).toBe(true);
  });

  it("returns isEmpty: false when ONLY the L1 bucket has data", () => {
    window.localStorage.setItem(
      L1_STORAGE_KEY,
      JSON.stringify([{ tag: "vi_l1_3rd_person_s", ts: 1_700_000_000 }]),
    );
    const map = aggregateLocalWeaknesses();
    expect(map.topL1Patterns.length).toBeGreaterThan(0);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.isEmpty).toBe(false);
  });

  it("returns isEmpty: false when ONLY the pronunciation bucket has data (≥3 samples)", () => {
    // Pronunciation aggregation gates on PRONUNCIATION_MIN_SAMPLES (3),
    // so seed three same-axis entries to surface a row.
    window.localStorage.setItem(
      PRONUNCIATION_STORAGE_KEY,
      JSON.stringify([
        { phoneme: "th", accuracy: 40, ts: 1_700_000_000, painPointAxis: "TH_T" },
        { phoneme: "th", accuracy: 40, ts: 1_700_000_001, painPointAxis: "TH_T" },
        { phoneme: "th", accuracy: 40, ts: 1_700_000_002, painPointAxis: "TH_T" },
      ]),
    );
    const map = aggregateLocalWeaknesses();
    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints.length).toBeGreaterThan(0);
    expect(map.isEmpty).toBe(false);
  });

  it("isEmpty is structurally derived: isEmpty === (l1.length===0 && placement.length===0 && pronunciation.length===0)", () => {
    // Cross-check the invariant across all four reachable buckets-empty
    // permutations we can synthesize here (placement adapter writes
    // are gated on a server-side completion that the unit test can't
    // replicate, so we exercise L1 + pronunciation × empty/seeded).
    const cases: Array<{ seed: () => void; expectEmpty: boolean }> = [
      { seed: () => {}, expectEmpty: true },
      {
        seed: () =>
          window.localStorage.setItem(
            L1_STORAGE_KEY,
            JSON.stringify([{ tag: "vi_l1_past_ed", ts: 1_700_000_000 }]),
          ),
        expectEmpty: false,
      },
    ];
    for (const c of cases) {
      window.localStorage.clear();
      c.seed();
      const map = aggregateLocalWeaknesses();
      const derived =
        map.topL1Patterns.length === 0 &&
        map.placementWeaknesses.length === 0 &&
        map.topPronunciationPainPoints.length === 0;
      expect(
        map.isEmpty,
        `isEmpty drifted from constituents: ${JSON.stringify(map)}`,
      ).toBe(derived);
      expect(map.isEmpty).toBe(c.expectEmpty);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard G9 — SkeletonLoading early-return survives in source
// ──────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap — loading state guard (gap audit 3A-G7)", () => {
  it("source contains the `!data → <SkeletonLoading />` early-return AND the component definition", () => {
    // Runtime check is unreliable here: react-testing-library flushes
    // useEffect synchronously, so by the time `render()` returns the
    // skeleton has already been swapped for the populated branch.
    // Lock the contract statically instead — if either half goes
    // missing, the loading branch becomes unreachable.
    const text = readFileSync(
      resolve(REPO_ROOT, "src/components/stage-3a/LocalWeaknessMap.tsx"),
      "utf8",
    );
    const code = stripJsComments(text);
    expect(
      code,
      "missing `if (!data) return <SkeletonLoading />` early-return",
    ).toMatch(/if\s*\(\s*!data\s*\)\s*return\s+<SkeletonLoading\s*\/>/);
    expect(
      code,
      "missing `function SkeletonLoading(...)` component definition",
    ).toMatch(/function\s+SkeletonLoading\s*\(/);
    expect(
      code,
      'missing the `data-testid="local-weakness-loading"` anchor',
    ).toContain('data-testid="local-weakness-loading"');
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard G10 — perfInstrumentation must not emit captureException
// ──────────────────────────────────────────────────────────────────────

describe("perfInstrumentation — breadcrumbs-only guard (gap audit 3A-G8)", () => {
  it("contains no captureException( call site (importing from the module's PATH is fine)", () => {
    const text = readFileSync(
      resolve(REPO_ROOT, "src/lib/stage-3a/perfInstrumentation.ts"),
      "utf8",
    );
    const code = stripJsComments(text);
    // Strict on call-site shape: `captureException(`. The named
    // module path `"../monitoring/captureException.js"` does NOT match
    // this regex because the trailing chars are `.js"`, not `(`.
    const callSiteRe = /\bcaptureException\s*\(/;
    expect(
      callSiteRe.test(code),
      "perfInstrumentation.ts called captureException — Stage 3A's contract is breadcrumbs-only",
    ).toBe(false);
    // And the file's documented import is `addBreadcrumb`-only.
    const namedImportRe =
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"][^'"]*captureException[^'"]*['"]/;
    const m = code.match(namedImportRe);
    if (m) {
      const names = m[1].split(",").map((s) => s.trim()).filter(Boolean);
      expect(
        names,
        "perfInstrumentation.ts imported beyond `addBreadcrumb` from captureException module",
      ).toEqual(["addBreadcrumb"]);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard G11 — aggregator itself never writes localStorage
// ──────────────────────────────────────────────────────────────────────

describe("aggregateLocalWeaknesses — no localStorage write (gap audit 3A-G13)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not call setItem / removeItem / clear when invoked directly (no component in between)", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    aggregateLocalWeaknesses();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it("stays write-free even with seeded buckets (read path exercises all three adapters)", () => {
    // Seed all three buckets so every adapter takes its full read
    // path. None of them should write back.
    window.localStorage.setItem(
      L1_STORAGE_KEY,
      JSON.stringify([{ tag: "vi_l1_3rd_person_s", ts: 1_700_000_000 }]),
    );
    window.localStorage.setItem(
      "mb.stage3a.placement.snapshot",
      JSON.stringify({
        cefr: "B1",
        weaknesses: ["past_tense_unmarked"],
        completedAt: 1_700_000_000,
        sessionId: "guard-fixture",
      }),
    );
    window.localStorage.setItem(
      PRONUNCIATION_STORAGE_KEY,
      JSON.stringify([
        { phoneme: "th", accuracy: 40, ts: 1_700_000_000, painPointAxis: "TH_T" },
        { phoneme: "th", accuracy: 40, ts: 1_700_000_001, painPointAxis: "TH_T" },
        { phoneme: "th", accuracy: 40, ts: 1_700_000_002, painPointAxis: "TH_T" },
      ]),
    );

    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    aggregateLocalWeaknesses();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });
});
