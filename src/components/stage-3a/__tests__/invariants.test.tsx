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
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

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
