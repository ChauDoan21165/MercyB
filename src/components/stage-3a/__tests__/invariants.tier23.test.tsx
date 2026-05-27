/**
 * Stage 3A — Tier 2 + Tier 3 invariant guards.
 *
 * Companion to `invariants.test.tsx` (which covers the Tier 1 guards
 * G1–G6). This file picks up the Stage 3A gaps ranked Tier 2 and
 * Tier 3 in `docs/stage-3ab/invariant-gap-audit.md` §4 — the ones
 * that would degrade UX, break a contracted behaviour, or surface as
 * a visible bug, but not silently leak data.
 *
 * Split rationale: the original Tier 1 file is the "must-never-leak"
 * surface; adding Tier 2 + Tier 3 here keeps each file under ~20
 * tests and makes it obvious at a glance which guards close which
 * tier of audit gap. The two files share no fixtures by design —
 * each tier's assertions are self-contained.
 *
 * Gap → guard mapping (audit §4 rank in parens):
 *
 *   3A-G4  isEmpty consistency on aggregator output         (rank 7)
 *   3A-G7  skeleton loading state before effect resolves    (rank 8)
 *   3A-G13 aggregator never writes to localStorage          (rank 10)
 *   3A-G2  no-fetch in aggregator / adapters / taxonomy /
 *          perfInstrumentation                              (rank 11)
 *   3A-G8  perfInstrumentation never CALLS captureException (rank 12)
 *   3A-G5  formatAgo returns a non-empty VI string for      (rank 13)
 *          every boundary input
 *   3A-G6  placement severity dot is aria-hidden + has no   (rank 14)
 *          text label
 *   3A-G10 taxonomy describe* functions never throw and     (rank 17)
 *          return the FALLBACK entry verbatim for unknown
 *          input
 *   3A-G3  every adapter reader tolerates the same four     (rank 20)
 *          fault classes and returns its documented safe
 *          default
 *
 * Implementation modes:
 *   - Source-text greps (with the existing `stripJsComments` helper
 *     pattern) for 3A-G2 / 3A-G8 — the only files that name those
 *     identifiers do so in prose at the top of the file to declare
 *     what they must not touch.
 *   - Direct unit invocation for 3A-G4 / 3A-G10 / 3A-G3 — these are
 *     pure function contracts, no React render needed.
 *   - Runtime spies for 3A-G13.
 *   - SSR-style first-paint render (via react-dom/server) for 3A-G7
 *     so the skeleton state is observable before any `useEffect`
 *     gets a chance to flush and resolve the data.
 *   - Component render boundary cases for 3A-G5 + 3A-G6 — the
 *     functions under test are not exported (per Stage 3A's "no
 *     logic changes" posture for this MR), so we drive them via the
 *     component's public surface and read the rendered DOM.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import LocalWeaknessMap from "../LocalWeaknessMap";
import {
  aggregateLocalWeaknesses,
  type LocalWeaknessMap as LocalWeaknessMapData,
} from "@/lib/stage-3a/aggregator";
import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
} from "@/lib/stage-3a/taxonomy";
import { readL1RecentTags } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { readPlacementSnapshot } from "@/lib/stage-3a/adapters/placementSnapshotAdapter";
import {
  readPronunciationRecent,
  PRONUNCIATION_RECENT_KEY,
} from "@/lib/stage-3a/adapters/pronunciationAdapter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../../");

// ── Adapter storage keys.
//
// Two of the three keys are file-private constants in their
// adapters (only `PRONUNCIATION_RECENT_KEY` is exported). Mirroring
// the literals here is intentional — the fault-tolerance guards
// test the CONTRACT at a specific localStorage key, which is itself
// part of the surface a future contributor must not silently change.
// If an adapter's key changes, this fixture is the right place to
// learn about it.
const L1_STORAGE_KEY = "mb.stage3a.l1.recent";
const PLACEMENT_STORAGE_KEY = "mb.stage3a.placement.snapshot";
const PRON_STORAGE_KEY = PRONUNCIATION_RECENT_KEY;

// ── Files scanned by the source-grep guards (3A-G2 + 3A-G8).
// Kept as a const so a future contributor moves them into the Tier 1
// drift-guard once that lands. ─────────────────────────────────────
const STAGE_3A_NO_FETCH_FILES = [
  "src/lib/stage-3a/aggregator.ts",
  "src/lib/stage-3a/taxonomy.ts",
  "src/lib/stage-3a/perfInstrumentation.ts",
  "src/lib/stage-3a/adapters/l1TagAdapter.ts",
  "src/lib/stage-3a/adapters/placementSnapshotAdapter.ts",
  "src/lib/stage-3a/adapters/pronunciationAdapter.ts",
] as const;

const PERF_INSTRUMENTATION_FILE = "src/lib/stage-3a/perfInstrumentation.ts";

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

function stripJsComments(text: string): string {
  // Mirror of the helper in invariants.test.tsx — strip block then
  // line comments so invariant-documenting prose at the top of each
  // file (which intentionally names banned identifiers) is not
  // misread as a violation.
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

// ──────────────────────────────────────────────────────────────────────
// 3A-G4 — aggregator isEmpty consistency
//
// The flag gates both LocalWeaknessMap's empty card AND
// SuggestedPracticeList's empty card. If it drifts from the bucket
// counts, learners would see the populated shell with no rows, or
// the empty card while data exists. The contract is:
//
//   isEmpty === (topL1Patterns.length === 0
//                && placementWeaknesses.length === 0
//                && topPronunciationPainPoints.length === 0)
//
// The two assertions below cover both directions: empty in → empty
// out, and non-empty in → non-empty out, for each bucket.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 2: aggregator isEmpty consistency (3A-G4)", () => {
  it("isEmpty is true when every adapter returns nothing", () => {
    // No localStorage seeded — every adapter returns its empty
    // default ([] / null / []).
    const result = aggregateLocalWeaknesses();
    expect(result.topL1Patterns).toHaveLength(0);
    expect(result.placementWeaknesses).toHaveLength(0);
    expect(result.topPronunciationPainPoints).toHaveLength(0);
    expect(result.isEmpty).toBe(true);
  });

  it("isEmpty is false when any single bucket has at least one entry (3 independent fixtures)", () => {
    // L1 only.
    window.localStorage.setItem(
      L1_STORAGE_KEY,
      JSON.stringify([
        { tag: "vi_l1_3rd_person_s", ts: Date.now() - 60_000 },
      ]),
    );
    const l1Only = aggregateLocalWeaknesses();
    expect(l1Only.topL1Patterns.length).toBeGreaterThan(0);
    expect(l1Only.isEmpty).toBe(false);
    window.localStorage.clear();

    // Placement only.
    window.localStorage.setItem(
      PLACEMENT_STORAGE_KEY,
      JSON.stringify({
        cefr: "B1",
        weaknesses: ["vi_l1_missing_be"],
        completedAt: Date.now(),
        sessionId: "test-session",
      }),
    );
    const placementOnly = aggregateLocalWeaknesses();
    expect(placementOnly.placementWeaknesses.length).toBeGreaterThan(0);
    expect(placementOnly.isEmpty).toBe(false);
    window.localStorage.clear();

    // Pronunciation only.
    window.localStorage.setItem(
      PRON_STORAGE_KEY,
      JSON.stringify([
        { phoneme: "θ", accuracy: 0.4, ts: Date.now(), painPointAxis: "TH_T" },
        { phoneme: "θ", accuracy: 0.3, ts: Date.now(), painPointAxis: "TH_T" },
        { phoneme: "θ", accuracy: 0.5, ts: Date.now(), painPointAxis: "TH_T" },
        { phoneme: "θ", accuracy: 0.4, ts: Date.now(), painPointAxis: "TH_T" },
        { phoneme: "θ", accuracy: 0.3, ts: Date.now(), painPointAxis: "TH_T" },
      ]),
    );
    const pronOnly = aggregateLocalWeaknesses();
    expect(pronOnly.topPronunciationPainPoints.length).toBeGreaterThan(0);
    expect(pronOnly.isEmpty).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G7 — skeleton loading state before effect resolves
//
// `LocalWeaknessMap` without an `initialData` prop must render a
// loading skeleton FIRST, then resolve data in `useEffect`. A
// regression that returns the empty card on the synchronous render
// path would make every cold load look like "you have no weaknesses
// yet" before data arrives — directly contradicting the design's
// "no shame" rule on a slow device.
//
// Tested via `react-dom/server`'s `renderToString` — SSR-style
// render runs the component synchronously without flushing any
// `useEffect`, so the initial null-data branch is observable.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 2: skeleton on first paint (3A-G7)", () => {
  it("renders the loading skeleton on the synchronous first-paint pass, not the empty state", () => {
    const html = renderToString(<LocalWeaknessMap />);
    expect(
      html,
      "expected first-paint render to contain the loading testid",
    ).toContain('data-testid="local-weakness-loading"');
    expect(
      html,
      "first paint must not show the empty state — empty resolves through useEffect",
    ).not.toContain('data-testid="local-weakness-empty"');
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G13 — aggregator never writes to localStorage
//
// Today's Tier 1 invariants test spies during component render only.
// A future "remember which signals we surfaced last" caching change
// in the aggregator itself would slip through the component-only
// spy. This guard calls the aggregator directly with the write APIs
// instrumented.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 2: aggregator no-localStorage-write (3A-G13)", () => {
  it("aggregateLocalWeaknesses() makes zero localStorage write calls", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    aggregateLocalWeaknesses();
    aggregateLocalWeaknesses();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G2 — no-fetch in any Stage 3A library file
//
// Source-grep over aggregator + 3 adapters + taxonomy +
// perfInstrumentation. The Tier 1 invariants test only runtime-spies
// fetch during the component's render path; this guard catches a
// future "let's call a CDN for the taxonomy" hack at static analysis
// time, before render even happens.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 2: no-fetch in library files (3A-G2)", () => {
  it("no Stage 3A library file calls fetch / globalThis.fetch / window.fetch", () => {
    const offenders: string[] = [];
    for (const f of STAGE_3A_NO_FETCH_FILES) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      const code = stripJsComments(text);
      // Bare `fetch(` is too broad — it would match e.g. `prefetch(`.
      // We anchor on a word boundary and forbid the three call
      // shapes that would actually hit the network.
      if (/\bfetch\s*\(/.test(code)) {
        offenders.push(`${f}: contains bare fetch(`);
      }
      if (/globalThis\.fetch\s*\(/.test(code)) {
        offenders.push(`${f}: contains globalThis.fetch(`);
      }
      if (/window\.fetch\s*\(/.test(code)) {
        offenders.push(`${f}: contains window.fetch(`);
      }
    }
    expect(
      offenders,
      `Stage 3A library files call fetch:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G8 — perfInstrumentation never CALLS captureException
//
// The module documents "we emit a Sentry breadcrumb. We never emit a
// captureException." The import path string `"…/captureException.js"`
// does contain the word, so the grep is for the CALL shape
// (`captureException(`) only — the import-statement match is OK and
// must not trip the guard.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 2: perfInstrumentation never calls captureException (3A-G8)", () => {
  it("captureException(...) does not appear in perfInstrumentation.ts (calls only, import path is fine)", () => {
    const text = readFileSync(
      resolve(REPO_ROOT, PERF_INSTRUMENTATION_FILE),
      "utf8",
    );
    const code = stripJsComments(text);
    // The CALL shape, with optional whitespace before the paren.
    // The import statement is `import { addBreadcrumb } from
    // "../monitoring/captureException.js"` — no opening paren, so
    // the regex below does not match it.
    expect(
      code,
      "perfInstrumentation.ts called captureException — Stage 3A is breadcrumbs-only",
    ).not.toMatch(/captureException\s*\(/);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G5 — formatAgo boundary behaviour
//
// `formatAgo` is a file-private helper in LocalWeaknessMap.tsx (not
// exported, per the "no logic changes" constraint on this MR — we
// don't add an export just to test it). Drive it through the
// component's L1 row, which renders `{count} lần · {formatAgo(...)}`
// inside a `QuietMeta` block.
//
// The five boundary inputs below cover every defensive branch in
// the function: zero, negative, NaN, Infinity, and a future date.
// All must produce a non-empty VI string and never leak "NaN" /
// "undefined" / "Infinity" into the rendered DOM.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 3: formatAgo boundary behaviour (3A-G5)", () => {
  function fixtureWithLastSeen(lastSeen: number): LocalWeaknessMapData {
    return {
      topL1Patterns: [{ tag: "vi_l1_3rd_person_s", count: 1, lastSeen }],
      placementWeaknesses: [],
      topPronunciationPainPoints: [],
      isEmpty: false,
      generatedAt: Date.now(),
    };
  }

  function renderAndReadL1Text(lastSeen: number): string {
    const { container } = render(
      <LocalWeaknessMap initialData={fixtureWithLastSeen(lastSeen)} />,
    );
    const section = container.querySelector(
      '[data-testid="local-weakness-l1"]',
    );
    return section?.textContent ?? "";
  }

  it("lastSeen=0 → calm 'lần gần đây' fallback, no NaN / undefined", () => {
    const text = renderAndReadL1Text(0);
    expect(text).toContain("lần gần đây");
    expect(text).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("lastSeen=-1 → calm 'lần gần đây' fallback", () => {
    const text = renderAndReadL1Text(-1);
    expect(text).toContain("lần gần đây");
    expect(text).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("lastSeen=NaN → calm 'lần gần đây' fallback, never 'NaN phút trước'", () => {
    const text = renderAndReadL1Text(Number.NaN);
    expect(text).toContain("lần gần đây");
    expect(text).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("lastSeen=Infinity → calm fallback, never 'Infinity phút trước'", () => {
    const text = renderAndReadL1Text(Number.POSITIVE_INFINITY);
    expect(text).toContain("lần gần đây");
    expect(text).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("lastSeen=future → calm fallback (diff < 0 path), never a negative duration", () => {
    const text = renderAndReadL1Text(Date.now() + 60_000);
    expect(text).toContain("lần gần đây");
    expect(text).not.toMatch(/NaN|undefined|Infinity|-\d/);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G6 — placement severity dot a11y
//
// The dot is the only severity signal in the placement section. A
// regression that adds a tooltip / aria-label / inner text saying
// "high severity" would (a) violate the "no shame language" rule
// AND (b) read garbage to screen-reader users. The dot must stay
// aria-hidden and carry no text content.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3A — Tier 3: placement severity dot a11y (3A-G6)", () => {
  it("every rendered severity dot is aria-hidden and has empty text content", () => {
    const fixture: LocalWeaknessMapData = {
      topL1Patterns: [],
      placementWeaknesses: [
        { tag: "vi_l1_missing_be", severity: "high" },
        { tag: "vi_l1_missing_article", severity: "medium" },
        { tag: "vi_l1_past_ed", severity: "low" },
      ],
      topPronunciationPainPoints: [],
      isEmpty: false,
      generatedAt: Date.now(),
    };
    const { container } = render(<LocalWeaknessMap initialData={fixture} />);
    const dots = container.querySelectorAll(
      '[data-testid="placement-severity-dot"]',
    );
    expect(dots.length).toBe(3);
    for (const dot of dots) {
      expect(
        dot.getAttribute("aria-hidden"),
        "severity dot must be aria-hidden",
      ).toBe("true");
      expect(
        (dot.textContent ?? "").trim(),
        "severity dot must carry no text",
      ).toBe("");
      // Also forbid an aria-label sneaking in — same accessibility
      // failure mode through a different attribute.
      expect(
        dot.getAttribute("aria-label"),
        "severity dot must not carry an aria-label",
      ).toBeNull();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G10 — taxonomy describe* functions: never throw, FALLBACK on
// unknown input
//
// The three describe* functions are the only string source the UI
// has for engineer-tag → learner-language translation. They must
// not throw, and unknown input must surface the FALLBACK entry
// verbatim (so raw engineer-tags never leak into the rendered DOM).
//
// Inputs cover three classes: a confidently-unknown ASCII tag,
// the empty string, and one in the right shape but with a typo
// that should not match any taxonomy key.
// ──────────────────────────────────────────────────────────────────────

const FALLBACK_VI = "Một mẫu câu bạn còn đang luyện.";
const FALLBACK_EN = "A pattern you're still working on.";
const UNKNOWN_INPUTS = [
  "definitely_not_a_real_tag",
  "",
  "NOT_AN_AXIS",
] as const;

describe("Stage 3A — Tier 3: taxonomy describe* fallback (3A-G10)", () => {
  it("describeL1Tag never throws and returns FALLBACK for unknown tags", () => {
    for (const input of UNKNOWN_INPUTS) {
      // The function's parameter is typed `L1WeaknessTag | string` —
      // the string branch is the unknown-tag path.
      const result = describeL1Tag(input);
      expect(result.shortVi).toBe(FALLBACK_VI);
      expect(result.shortEn).toBe(FALLBACK_EN);
    }
  });

  it("describePhonemeAxis never throws and returns FALLBACK for unknown axes", () => {
    for (const input of UNKNOWN_INPUTS) {
      const result = describePhonemeAxis(input);
      expect(result.shortVi).toBe(FALLBACK_VI);
      expect(result.shortEn).toBe(FALLBACK_EN);
    }
  });

  it("describePlacementWeakness never throws and returns FALLBACK for unknown tags", () => {
    for (const input of UNKNOWN_INPUTS) {
      const result = describePlacementWeakness(input);
      expect(result.shortVi).toBe(FALLBACK_VI);
      expect(result.shortEn).toBe(FALLBACK_EN);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3A-G3 — adapter readers tolerate the same fault classes
//
// Each adapter has its own unit tests covering its own corruption
// cases. This cross-cutting guard puts all three under the same
// matrix: feed each one `not-json`, a wrong-shape object literal, an
// empty array, and the string `"null"`. Each reader must return its
// documented safe default and never throw.
//
// Documented safe defaults:
//   readL1RecentTags             → []
//   readPlacementSnapshot        → null
//   readPronunciationRecent      → []
// ──────────────────────────────────────────────────────────────────────

const FAULT_FIXTURES = [
  "not-json",
  '{"corrupt": true}',
  "[]",
  "null",
] as const;

describe("Stage 3A — Tier 3: adapter fault tolerance (3A-G3)", () => {
  it("readL1RecentTags returns [] for every corrupted storage state", () => {
    for (const fixture of FAULT_FIXTURES) {
      window.localStorage.setItem(L1_STORAGE_KEY, fixture);
      expect(() => readL1RecentTags()).not.toThrow();
      expect(readL1RecentTags()).toEqual([]);
      window.localStorage.clear();
    }
  });

  it("readPlacementSnapshot returns null for every corrupted storage state", () => {
    for (const fixture of FAULT_FIXTURES) {
      window.localStorage.setItem(PLACEMENT_STORAGE_KEY, fixture);
      expect(() => readPlacementSnapshot()).not.toThrow();
      expect(readPlacementSnapshot()).toBeNull();
      window.localStorage.clear();
    }
  });

  it("readPronunciationRecent returns [] for every corrupted storage state", () => {
    for (const fixture of FAULT_FIXTURES) {
      window.localStorage.setItem(PRON_STORAGE_KEY, fixture);
      expect(() => readPronunciationRecent()).not.toThrow();
      expect(readPronunciationRecent()).toEqual([]);
      window.localStorage.clear();
    }
  });
});
