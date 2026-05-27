/**
 * Stage 3B — Suggested Practice invariant guards.
 *
 * Mirror of `src/components/stage-3a/__tests__/invariants.test.tsx`,
 * applied to the Stage 3B subtree:
 *
 *   - src/stage-3b/suggestedPractice.ts
 *   - src/stage-3b/types.ts
 *   - src/components/stage-3b/SuggestedPracticeList.tsx
 *   - src/components/stage-3b/practiceRoutes.ts
 *
 * The Stage 3B surface MUST NOT:
 *   1. Make Supabase calls — no import, no call.
 *   2. Make network calls (`window.fetch`) during component render
 *      or engine execution.
 *   3. Write to localStorage — with one carved-out exception (active
 *      as of !29 / C7): `src/stage-3b/viewCount.ts` may write the
 *      key `mb.stage3b.viewCount`, and nothing else. Every other
 *      Stage 3B file and key remains banned.
 *   4. Touch `mercy_user_facts` — semantic memory is a different
 *      surface (ROADMAP §Stage 3 Boundaries).
 *   5. Render any gamification or shame language in Vietnamese OR
 *      English on populated OR empty fixtures.
 *   6. Drift from the deterministic / byte-for-byte engine contract —
 *      `selectSuggestedPractice` may not call `Date.now()` or
 *      `Math.random()` (the engine's "Pure function" docstring is
 *      the source of truth, gap audit 3B-G7).
 *   7. Import analytics SDKs (posthog, GA, segment, mixpanel,
 *      Vercel analytics, or the internal `@/lib/analytics` shim) —
 *      Stage 3 is local-only by posture (gap audit 3B-G15 / Tier 1).
 *
 * Implementation modes:
 *   - Runtime spies for fetch / setItem / Date / Math.random axes.
 *   - Source-text greps for Supabase / mercy_user_facts / analytics
 *     imports. Greps strip JS comments first so the
 *     invariant-documenting prose at the top of each Stage 3B file
 *     (which intentionally names the banned identifiers to declare
 *     what the file must not touch) is not flagged as a violation.
 *
 * Source list is captured ONCE in `STAGE_3B_FILES` so adding a guard
 * (or a new Stage 3B file) is a one-line change. WeakAt.tsx is
 * intentionally NOT in this list — it's already covered by the
 * Stage 3A invariants suite (`src/components/stage-3a/__tests__/
 * invariants.test.tsx`'s G1 / G4 file lists).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import SuggestedPracticeList from "../SuggestedPracticeList";
import { selectSuggestedPractice } from "@/stage-3b/suggestedPractice";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../../");

// ── Source files this suite scans. Adding a new Stage 3B file means
// adding it here AND keeping the gaps audit (docs/stage-3ab/
// invariant-gap-audit.md §2.2) in sync. ───────────────────────────────
const STAGE_3B_FILES = [
  "src/stage-3b/suggestedPractice.ts",
  "src/stage-3b/types.ts",
  "src/stage-3b/viewCount.ts",
  "src/stage-3b/perfInstrumentation.ts",
  "src/components/stage-3b/SuggestedPracticeList.tsx",
  "src/components/stage-3b/practiceRoutes.ts",
] as const;

// ── The single carved-out localStorage writer (see !29 /
// `src/stage-3b/viewCount.ts` header for the contract). G3 below
// enforces both halves of the carve-out: only this file may write,
// and only the `mb.stage3b.viewCount` key may be written. ───────────
const ALLOWED_LOCALSTORAGE_WRITE_FILE = "src/stage-3b/viewCount.ts";
const ALLOWED_LOCALSTORAGE_WRITE_KEY = "mb.stage3b.viewCount";

// ── Fixture data ─ Populated case exercises all three kinds; the tag
// values are chosen so the resolved VI/EN labels (sourced from
// stage-3a/taxonomy.ts) contain no banned substrings. ────────────────
function populatedData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: Date.now() - 600_000 },
    ],
    placementWeaknesses: [
      { tag: "th_stopping_and_fronting", severity: "medium" },
    ],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.6, samples: 5 },
    ],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

function emptyData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: Date.now(),
  };
}

function renderList(initialState: LocalWeaknessMapData) {
  // `SuggestedPracticeList` calls `useNavigate()` at the hook level,
  // so a router context is required even for tests that never
  // navigate. `MemoryRouter` keeps the test fully in-memory — no
  // `window.history` writes, no localStorage spill.
  return render(
    <MemoryRouter>
      <SuggestedPracticeList initialState={initialState} />
    </MemoryRouter>,
  );
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

describe("Stage 3B — Supabase guard", () => {
  it("does not import @/lib/supabaseClient or @supabase/supabase-js from any Stage 3B source file", () => {
    const offenders: string[] = [];
    for (const f of STAGE_3B_FILES) {
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
    expect(
      offenders,
      `Supabase imports leaked into Stage 3B:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 2 — no window.fetch
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — network guard", () => {
  it("does not call fetch during SuggestedPracticeList render or mount", () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(() => {
      throw new Error("Stage 3B called fetch — invariant breach");
    });
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    try {
      const { unmount } = renderList(populatedData());
      expect(fetchSpy).not.toHaveBeenCalled();
      unmount();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("does not call fetch during selectSuggestedPractice execution", () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn(() => {
      throw new Error("selectSuggestedPractice called fetch — invariant breach");
    });
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    try {
      selectSuggestedPractice(populatedData());
      selectSuggestedPractice(emptyData());
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 3 — localStorage write carve-out
//
// As of !29 (C7), Stage 3B has exactly ONE allowed localStorage write
// site: `src/stage-3b/viewCount.ts` may call `localStorage.setItem`
// with the key `mb.stage3b.viewCount` (and only that key). Every other
// Stage 3B file remains strictly read-only with respect to
// localStorage. `viewCount.ts`'s own header (lines 25–29) is the
// source-of-truth for this carve-out; the four assertions below lock
// both halves of the contract:
//
//   3a — runtime, render path: setItem may fire only with the
//        allowed key; removeItem / clear remain at zero calls.
//   3b — runtime, engine path: selectSuggestedPractice still writes
//        nothing whatsoever.
//   3c — static, file attribution: only viewCount.ts may contain
//        localStorage write call sites in code.
//   3d — static, key attribution: every setItem in viewCount.ts
//        must reference the `VIEW_COUNT_KEY` constant or the literal
//        `'mb.stage3b.viewCount'` string.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — localStorage write guard", () => {
  it("runtime (render path): setItem fires only with the allowed key; removeItem and clear are banned", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    const { unmount } = renderList(populatedData());

    const offendingKeys = setItemSpy.mock.calls
      .map((call) => String(call[0]))
      .filter((k) => k !== ALLOWED_LOCALSTORAGE_WRITE_KEY);
    expect(
      offendingKeys,
      `Stage 3B wrote disallowed localStorage keys during render: ${offendingKeys.join(", ")}`,
    ).toEqual([]);
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
    unmount();
  });

  it("runtime (engine path): selectSuggestedPractice writes nothing", () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
    const clearSpy = vi.spyOn(window.localStorage, "clear");

    selectSuggestedPractice(populatedData());
    selectSuggestedPractice(emptyData());

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it("static: only viewCount.ts may contain localStorage write call sites", () => {
    const offenders: string[] = [];
    for (const f of STAGE_3B_FILES) {
      if (f === ALLOWED_LOCALSTORAGE_WRITE_FILE) continue;
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Strip comments first — viewCount.ts's invariant-documenting
      // header names the write APIs in prose, and other files may
      // legitimately reference them in comments while remaining
      // write-free in code.
      const code = stripJsComments(text);
      if (/localStorage\.setItem\s*\(/.test(code)) {
        offenders.push(`${f}: contains localStorage.setItem(`);
      }
      if (/localStorage\.removeItem\s*\(/.test(code)) {
        offenders.push(`${f}: contains localStorage.removeItem(`);
      }
      if (/localStorage\.clear\s*\(/.test(code)) {
        offenders.push(`${f}: contains localStorage.clear(`);
      }
    }
    expect(
      offenders,
      `Stage 3B localStorage writes from disallowed files:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("static: viewCount.ts setItem calls reference only the allowed key", () => {
    const text = readFileSync(
      resolve(REPO_ROOT, ALLOWED_LOCALSTORAGE_WRITE_FILE),
      "utf8",
    );
    const code = stripJsComments(text);
    // Allowed first-arg expressions: the `VIEW_COUNT_KEY` constant
    // (defined in this same file) OR the literal string in either
    // quote style. Anything else — a second key, a computed expression,
    // a variable — fails the contract and forces a code review.
    const allowedKeyExpressions = new Set([
      "VIEW_COUNT_KEY",
      `"${ALLOWED_LOCALSTORAGE_WRITE_KEY}"`,
      `'${ALLOWED_LOCALSTORAGE_WRITE_KEY}'`,
    ]);
    const setItemRe = /localStorage\.setItem\s*\(\s*([^,)]+)\s*,/g;
    const offenders: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = setItemRe.exec(code)) !== null) {
      const arg = m[1].trim();
      if (!allowedKeyExpressions.has(arg)) {
        offenders.push(
          `${ALLOWED_LOCALSTORAGE_WRITE_FILE}: setItem with disallowed key expression \`${arg}\``,
        );
      }
    }
    expect(
      offenders,
      `viewCount.ts wrote a non-allowlisted key:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 4 — no mercy_user_facts reference (comments allowed)
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — mercy_user_facts guard", () => {
  it("does not USE `mercy_user_facts` anywhere in the Stage 3B subtree (comments allowed)", () => {
    const offenders: string[] = [];
    for (const f of STAGE_3B_FILES) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Strip block + line comments first; the invariant-documenting
      // headers in each Stage 3B file intentionally name
      // `mercy_user_facts` to declare what the file must not touch.
      const code = stripJsComments(text);
      if (/mercy_user_facts/.test(code)) {
        offenders.push(f);
      }
    }
    expect(
      offenders,
      `mercy_user_facts used in Stage 3B code (not comments):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

function stripJsComments(text: string): string {
  // Order matters: strip block comments first so an inline `//` inside
  // a `/* ... */` isn't double-handled. Mirrors the helper in
  // src/components/stage-3a/__tests__/invariants.test.tsx so future
  // contributors keep the two suites consistent.
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

// ──────────────────────────────────────────────────────────────────────
// Guard 5 — no gamification / shame language in rendered output (EN)
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — copy guard (EN)", () => {
  it("renders no `/streak|xp|level|badge|score|fail|wrong|bad/i` substring on the populated fixture", () => {
    const { container, unmount } = renderList(populatedData());
    const text = container.textContent ?? "";
    expect(
      text,
      `Found banned EN gamification/shame substring in rendered output:\n${text}`,
    ).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    unmount();
  });

  it("renders no banned EN substring in the empty state either", () => {
    const { container, unmount } = renderList(emptyData());
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 6 — no shame language in rendered output (VI)
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — copy guard (VI)", () => {
  it("renders no `/điểm số|hạng|sai|kém|tệ/i` substring on the populated fixture", () => {
    const { container, unmount } = renderList(populatedData());
    const text = container.textContent ?? "";
    expect(
      text,
      `Found banned VI shame substring in rendered output:\n${text}`,
    ).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
    unmount();
  });

  it("renders no banned VI substring in the empty state either", () => {
    const { container, unmount } = renderList(emptyData());
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 7 — engine purity (gap audit 3B-G7, Tier 1 rank 6)
//
// `selectSuggestedPractice` is documented as "Pure function. No I/O.
// Deterministic: identical input → identical output, byte-for-byte."
// Calling `Date.now()` or `Math.random()` would break determinism
// silently — the existing "same input twice" test would still pass
// (same closure-call timing) and prod would jitter on every render.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — engine purity guard", () => {
  it("does not call Date.now() during selectSuggestedPractice", () => {
    // Construct fixtures BEFORE attaching the spy — the fixture
    // helpers call `Date.now()` for `generatedAt` / `lastSeen`,
    // which would otherwise be miscounted as engine calls.
    const fullState = populatedData();
    const emptyState = emptyData();

    const dateNowSpy = vi.spyOn(Date, "now");

    selectSuggestedPractice(fullState);
    selectSuggestedPractice(emptyState);

    expect(
      dateNowSpy,
      "selectSuggestedPractice called Date.now() — engine is documented as pure / deterministic",
    ).not.toHaveBeenCalled();
  });

  it("does not call Math.random() during selectSuggestedPractice", () => {
    const fullState = populatedData();
    const emptyState = emptyData();

    const randomSpy = vi.spyOn(Math, "random");

    selectSuggestedPractice(fullState);
    selectSuggestedPractice(emptyState);

    expect(
      randomSpy,
      "selectSuggestedPractice called Math.random() — engine is documented as deterministic",
    ).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────────────
// Guard 8 — no analytics SDK import (gap audit 3B-G15, Tier 1 rank 4)
//
// Stage 3 is local-only. A PR adding `import { trackEvent } from
// "@/lib/analytics"` (or any vendor SDK) to either Stage 3B source
// file would silently begin emitting tag identifiers to a remote
// provider. Banned across the subtree.
// ──────────────────────────────────────────────────────────────────────

describe("Stage 3B — analytics import guard", () => {
  it("does not import any analytics SDK or shim from any Stage 3B source file", () => {
    // Quote-agnostic shape: `from '<module>'` or `from "<module>"`.
    // Module list mirrors the gap audit's stated set; add new
    // analytics modules here as they enter the codebase.
    const bannedModules = [
      "@/lib/analytics",
      "posthog-js",
      "react-ga",
      "react-ga4",
      "mixpanel-browser",
      "@segment/analytics-next",
      "@vercel/analytics",
      "@vercel/analytics/react",
    ];
    const offenders: string[] = [];
    for (const f of STAGE_3B_FILES) {
      const text = readFileSync(resolve(REPO_ROOT, f), "utf8");
      // Strip comments — invariant-documenting prose may name an
      // analytics module to declare what the file must not import.
      const code = stripJsComments(text);
      for (const mod of bannedModules) {
        // Escape regex specials in the module name. The current list
        // contains `/` and `@` and `-`; only `/` and `@` would need
        // escaping in a character class but neither is special in a
        // string-literal pattern. Keeping the manual escape so a
        // future module like `posthog.js` (with a literal dot) is
        // handled correctly.
        const escaped = mod.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const importRe = new RegExp(`from\\s+['"]${escaped}['"]`);
        const requireRe = new RegExp(`require\\(['"]${escaped}['"]\\)`);
        if (importRe.test(code) || requireRe.test(code)) {
          offenders.push(`${f}: imports ${mod}`);
        }
      }
    }
    expect(
      offenders,
      `Analytics SDK imports leaked into Stage 3B:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
