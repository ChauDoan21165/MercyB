/**
 * Stage 3A ↔ Stage 3B — cross-surface invariant guards.
 *
 * Closes the `3AB-G*` cross-surface entries in
 * `docs/stage-3ab/invariant-gap-audit.md` §4, plus the additional
 * cross-surface contracts called out in the dispatch (shared
 * localStorage key namespacing, public-API discipline, no
 * circular references between the two subtrees).
 *
 * Why a third invariants file (instead of extending either side's
 * existing file):
 *   - Stage 3A's `invariants.test.tsx` + `invariants.tier23.test.tsx`
 *     scope is "things the 3A surface must not do" — adding 3B-aware
 *     assertions there would muddy that responsibility.
 *   - Stage 3B's `invariants.test.tsx` mirror is the same shape, one
 *     surface only.
 *   - Cross-surface contracts (page composition, namespace
 *     separation, public-API discipline, one-way dependency) are by
 *     definition shared and shouldn't live under either side.
 *
 * Guard → audit-ID / dispatch-clause mapping:
 *
 *   X1  3AB-G1   /weak-at page (`src/pages/WeakAt.tsx`) inherits all
 *                no-import guards: no fetch call site, no analytics
 *                SDK import. Supabase + mercy_user_facts on WeakAt
 *                are already covered by the Stage 3A invariants
 *                file's G1/G4 grep file lists; this guard closes the
 *                fetch + analytics axes the existing suites leave
 *                open for the composition page.
 *
 *   X2  3AB-G2   Section testids stay stable. The E2E spec
 *                (`tests/e2e/stage-3a-weak-at.spec.ts`) and the
 *                marketing-screenshot spec key off a fixed set of
 *                `data-testid` values; renaming any of them would
 *                silently break both. The grep locks the union of
 *                anchors actually used today.
 *
 *   X3  3AB-G3   Render `<WeakAt />` with empty localStorage; assert
 *                BOTH `local-weakness-empty` AND
 *                `suggested-practice-empty` render (page-level
 *                composition contract — neither half degrades the
 *                other's empty state).
 *
 *   X4  (dispatch) localStorage key namespace separation —
 *                `mb.stage3a.*` keys live in Stage 3A runtime source
 *                only; `mb.stage3b.*` keys in Stage 3B only. A bleed
 *                in either direction means a surface is reaching
 *                across the boundary at runtime.
 *
 *   X5  (dispatch) Engine kind discriminator alignment — the three
 *                `SuggestedPracticeKind` values ("l1" / "placement"
 *                / "pronunciation") must map 1-to-1 to the three
 *                Stage 3A aggregator buckets (topL1Patterns /
 *                placementWeaknesses / topPronunciationPainPoints).
 *                Adding a kind on one side without the other would
 *                surface either empty placeholders or unhandled
 *                discriminants.
 *
 *   X6  (dispatch) Stage 3B imports only Stage 3A's public API —
 *                allowed: `@/lib/stage-3a/aggregator`,
 *                `@/lib/stage-3a/taxonomy`. Disallowed:
 *                `@/lib/stage-3a/adapters/*`,
 *                `@/lib/stage-3a/perfInstrumentation`,
 *                `@/components/stage-3a/*`. Adapters + perf are
 *                internal to 3A; reaching past them would couple
 *                Stage 3B to 3A's storage shape, not its
 *                aggregated read seam.
 *
 *   X7  (dispatch) No circular reference — Stage 3A subtree
 *                (`src/lib/stage-3a/**`, `src/components/stage-3a/**`)
 *                imports nothing from Stage 3B subtree. The reverse
 *                (3B → 3A) is fine. `src/pages/WeakAt.tsx` is the
 *                composition layer above both and intentionally
 *                imports from each — it is NOT in the 3A subtree for
 *                this purpose.
 *
 * Implementation modes:
 *   - Source-text greps with the standard JS-comment stripper (so
 *     invariant-documenting prose in file headers is not flagged).
 *   - Runtime render with `MemoryRouter` for the page-composition
 *     test (`SuggestedPracticeList` calls `useNavigate()` at the
 *     hook level, so router context is required even when the test
 *     never navigates).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import WeakAt from "@/pages/WeakAt";
import type { SuggestedPracticeKind } from "@/stage-3b/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../");

// ── Repo-relative path roots used across guards. ──────────────────────
const STAGE_3A_LIB_ROOT = "src/lib/stage-3a";
const STAGE_3A_COMPONENTS_ROOT = "src/components/stage-3a";
const STAGE_3B_LIB_ROOT = "src/stage-3b";
const STAGE_3B_COMPONENTS_ROOT = "src/components/stage-3b";
const WEAK_AT_PAGE = "src/pages/WeakAt.tsx";

// ── Recursive .ts/.tsx walker scoped to non-test files. ───────────────
function walkRuntimeSourceFiles(rootRel: string): string[] {
  const absRoot = resolve(REPO_ROOT, rootRel);
  const out: string[] = [];
  const stack: string[] = [absRoot];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = resolve(dir, name);
      let s;
      try {
        s = statSync(full);
      } catch {
        continue;
      }
      if (s.isDirectory()) {
        // Skip per-directory test folders and node_modules guards.
        if (name === "__tests__" || name === "node_modules") continue;
        stack.push(full);
        continue;
      }
      // Test files use `.test.` / `.spec.` and live alongside source;
      // exclude them so guards reflect the runtime surface only.
      if (/\.(test|spec)\.[tj]sx?$/.test(name)) continue;
      if (/\.(ts|tsx)$/.test(name)) out.push(relative(REPO_ROOT, full));
    }
  }
  return out.sort();
}

function stripJsComments(text: string): string {
  // Mirrors the helper used in both surfaces' invariants files. Order
  // matters: block comments first.
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ══════════════════════════════════════════════════════════════════════
// X1 — /weak-at page no-import inheritance (gap audit 3AB-G1)
// ══════════════════════════════════════════════════════════════════════

describe("/weak-at page — no-import inheritance (gap audit 3AB-G1)", () => {
  it("contains no fetch( call site or window.fetch / globalThis.fetch reference", () => {
    const text = readFileSync(resolve(REPO_ROOT, WEAK_AT_PAGE), "utf8");
    const code = stripJsComments(text);
    const offenders: string[] = [];
    if (/\bfetch\s*\(/.test(code)) {
      offenders.push("fetch( call site");
    }
    if (/window\.fetch\b/.test(code)) {
      offenders.push("window.fetch reference");
    }
    if (/globalThis\.fetch\b/.test(code)) {
      offenders.push("globalThis.fetch reference");
    }
    expect(
      offenders,
      `/weak-at page violated no-fetch inheritance: ${offenders.join(", ")}`,
    ).toEqual([]);
  });

  it("does not import any analytics SDK or shim", () => {
    // Modules mirror the list locked in Stage 3B's invariants suite
    // (`src/components/stage-3b/__tests__/invariants.test.tsx`'s G8).
    // Stage 3A's invariants file has no analytics grep yet — until it
    // does, this cross-surface guard closes the page's exposure.
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
    const text = readFileSync(resolve(REPO_ROOT, WEAK_AT_PAGE), "utf8");
    const code = stripJsComments(text);
    const offenders: string[] = [];
    for (const mod of bannedModules) {
      const escaped = mod.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const importRe = new RegExp(`from\\s+['"]${escaped}['"]`);
      const requireRe = new RegExp(`require\\(['"]${escaped}['"]\\)`);
      if (importRe.test(code) || requireRe.test(code)) {
        offenders.push(mod);
      }
    }
    expect(
      offenders,
      `/weak-at page imported an analytics SDK: ${offenders.join(", ")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// X2 — section testid stability (gap audit 3AB-G2)
// ══════════════════════════════════════════════════════════════════════
//
// The map below intentionally lists each testid against the source
// file that must contain it. Removing an entry from this list to make
// a test pass is the wrong move — it would silently strand the E2E
// spec or the marketing-screenshot spec on a missing anchor. The
// correct move is to update both the renamed component AND any
// downstream spec.
// ══════════════════════════════════════════════════════════════════════

const TESTID_ANCHORS: Array<{ file: string; testids: readonly string[] }> = [
  {
    file: WEAK_AT_PAGE,
    testids: ["weak-at-title-vi", "weak-at-title-en"],
  },
  {
    file: "src/components/stage-3a/LocalWeaknessMap.tsx",
    testids: [
      "local-weakness-map",
      "local-weakness-empty",
      "local-weakness-loading",
      "local-weakness-l1",
      "local-weakness-placement",
      "local-weakness-pronunciation",
      "placement-severity-dot",
      "pronunciation-meta",
    ],
  },
  {
    file: "src/components/stage-3b/SuggestedPracticeList.tsx",
    testids: [
      "suggested-practice-list",
      "suggested-practice-empty",
      "suggested-practice-loading",
    ],
  },
];

describe("cross-surface — section testid stability (gap audit 3AB-G2)", () => {
  for (const { file, testids } of TESTID_ANCHORS) {
    it(`${file} keeps its canonical testids in source`, () => {
      const text = readFileSync(resolve(REPO_ROOT, file), "utf8");
      const missing = testids.filter(
        (id) => !text.includes(`data-testid="${id}"`),
      );
      expect(
        missing,
        `${file} dropped canonical testids (E2E + marketing-screenshot specs depend on them): ${missing.join(", ")}`,
      ).toEqual([]);
    });
  }
});

// ══════════════════════════════════════════════════════════════════════
// X3 — both empty cards render on global empty state (gap audit 3AB-G3)
// ══════════════════════════════════════════════════════════════════════

describe("WeakAt page composition — empty-state contract (gap audit 3AB-G3)", () => {
  it("renders BOTH `local-weakness-empty` and `suggested-practice-empty` when localStorage is unseeded", async () => {
    // `localStorage.clear()` already in `beforeEach`. Render the
    // page; both halves consume the aggregator independently, so
    // both must hit their own empty branch.
    render(
      <MemoryRouter>
        <WeakAt />
      </MemoryRouter>,
    );

    expect(
      await screen.findByTestId("local-weakness-empty"),
      "LocalWeaknessMap dropped its empty card",
    ).toBeTruthy();
    expect(
      await screen.findByTestId("suggested-practice-empty"),
      "SuggestedPracticeList dropped its empty card",
    ).toBeTruthy();

    // And the populated section testids are NOT present.
    expect(screen.queryByTestId("local-weakness-map")).toBeNull();
    expect(screen.queryByTestId("suggested-practice-list")).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════
// X4 — localStorage key namespace separation (dispatch)
// ══════════════════════════════════════════════════════════════════════
//
// `mb.stage3a.*` keys may appear in Stage 3A runtime source only;
// `mb.stage3b.*` keys in Stage 3B runtime source only. A reference to
// a 3B key from Stage 3A (or vice versa) means a surface is reaching
// across the boundary at runtime — which would couple them at the
// wrong layer (the aggregator's read seam is the only intended
// hand-off).
//
// Scope: runtime source files only (test fixtures legitimately
// reference both namespaces; the namespace contract is about runtime
// behaviour, not test infrastructure).
// ══════════════════════════════════════════════════════════════════════

const STAGE_3A_KEY_RE = /mb\.stage3a\.[A-Za-z0-9_.-]+/g;
const STAGE_3B_KEY_RE = /mb\.stage3b\.[A-Za-z0-9_.-]+/g;

describe("cross-surface — localStorage key namespace separation (dispatch)", () => {
  it("no Stage 3A runtime source file references an `mb.stage3b.*` key", () => {
    const files = [
      ...walkRuntimeSourceFiles(STAGE_3A_LIB_ROOT),
      ...walkRuntimeSourceFiles(STAGE_3A_COMPONENTS_ROOT),
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const code = stripJsComments(readFileSync(resolve(REPO_ROOT, f), "utf8"));
      const matches = code.match(STAGE_3B_KEY_RE);
      if (matches) {
        offenders.push(`${f}: ${[...new Set(matches)].join(", ")}`);
      }
    }
    expect(
      offenders,
      `Stage 3A source referenced an mb.stage3b.* key (namespace leak):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("no Stage 3B runtime source file references an `mb.stage3a.*` key", () => {
    const files = [
      ...walkRuntimeSourceFiles(STAGE_3B_LIB_ROOT),
      ...walkRuntimeSourceFiles(STAGE_3B_COMPONENTS_ROOT),
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const code = stripJsComments(readFileSync(resolve(REPO_ROOT, f), "utf8"));
      const matches = code.match(STAGE_3A_KEY_RE);
      if (matches) {
        offenders.push(`${f}: ${[...new Set(matches)].join(", ")}`);
      }
    }
    expect(
      offenders,
      `Stage 3B source referenced an mb.stage3a.* key (namespace leak):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// X5 — engine kind ↔ aggregator bucket 1-to-1 (dispatch)
// ══════════════════════════════════════════════════════════════════════

describe("cross-surface — kind ↔ bucket alignment (dispatch)", () => {
  it("`SuggestedPracticeKind` covers exactly the three Stage 3A aggregator buckets", () => {
    // The kind union is a literal-string type; the same set lives in
    // the aggregator output's bucket field names. Drift on either
    // side would surface as either unhandled-discriminant code paths
    // (more kinds than buckets) or silently-empty cards (more
    // buckets than kinds).
    const expectedKinds = ["l1", "placement", "pronunciation"] as const;
    // Type-level assertion: assigning each literal to the union
    // proves the union covers every expected kind. A regression that
    // drops `pronunciation` from the union fails compilation here.
    const _l1: SuggestedPracticeKind = "l1";
    const _placement: SuggestedPracticeKind = "placement";
    const _pronunciation: SuggestedPracticeKind = "pronunciation";
    void _l1;
    void _placement;
    void _pronunciation;

    // Static cross-check: the type definition file must declare all
    // three literal values in the union. A regression that adds a
    // fourth kind also surfaces here for review.
    const typesText = readFileSync(
      resolve(REPO_ROOT, "src/stage-3b/types.ts"),
      "utf8",
    );
    const code = stripJsComments(typesText);
    const unionMatch = code.match(/SuggestedPracticeKind\s*=\s*([^;]+);/);
    expect(
      unionMatch,
      "Could not locate the SuggestedPracticeKind type declaration",
    ).not.toBeNull();
    const declaredKinds = (unionMatch?.[1] ?? "")
      .split("|")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    expect(declaredKinds.sort()).toEqual([...expectedKinds].sort());
  });

  it("aggregator output bucket field names map 1-to-1 to engine kinds", () => {
    // The aggregator's `LocalWeaknessMap` interface declares three
    // bucket fields. The engine reads each by name to populate one
    // kind. Drift here means an aggregator bucket goes unread or an
    // engine kind has no source.
    const aggText = readFileSync(
      resolve(REPO_ROOT, "src/lib/stage-3a/aggregator.ts"),
      "utf8",
    );
    const code = stripJsComments(aggText);
    const expectedBuckets = [
      "topL1Patterns",
      "placementWeaknesses",
      "topPronunciationPainPoints",
    ] as const;
    for (const bucket of expectedBuckets) {
      expect(
        code,
        `aggregator interface lost the \`${bucket}\` bucket — engine kind has no source`,
      ).toMatch(new RegExp(`\\b${bucket}\\b\\s*:`));
    }
  });

  it("`selectSuggestedPractice` reads each of the three buckets exactly", () => {
    const engineText = readFileSync(
      resolve(REPO_ROOT, "src/stage-3b/suggestedPractice.ts"),
      "utf8",
    );
    const code = stripJsComments(engineText);
    expect(code).toMatch(/state\.topL1Patterns\[0\]/);
    expect(code).toMatch(/state\.placementWeaknesses\[0\]/);
    expect(code).toMatch(/state\.topPronunciationPainPoints\[0\]/);
  });
});

// ══════════════════════════════════════════════════════════════════════
// X6 — Stage 3B → Stage 3A public-API discipline (dispatch)
// ══════════════════════════════════════════════════════════════════════
//
// Allowed Stage 3A import targets from Stage 3B code:
//   - `@/lib/stage-3a/aggregator` (public type + function)
//   - `@/lib/stage-3a/taxonomy`   (describe* accessors)
//
// Disallowed:
//   - `@/lib/stage-3a/adapters/*`        (internal storage shapes)
//   - `@/lib/stage-3a/perfInstrumentation` (3A's own perf wrapper)
//   - `@/components/stage-3a/*`          (3A's UI components)
//
// Why: the aggregator IS the read seam between 3A and 3B. Reaching
// past it couples 3B to 3A's storage shape rather than its
// aggregated output. 3B has its OWN perfInstrumentation; sharing
// 3A's would conflate the two surfaces' breadcrumb categories.
// ══════════════════════════════════════════════════════════════════════

const ALLOWED_3A_IMPORT_PATHS = [
  "@/lib/stage-3a/aggregator",
  "@/lib/stage-3a/taxonomy",
] as const;

const DISALLOWED_3A_IMPORT_PREFIXES = [
  "@/lib/stage-3a/adapters",
  "@/lib/stage-3a/perfInstrumentation",
  "@/components/stage-3a",
] as const;

describe("cross-surface — Stage 3B → Stage 3A public-API discipline (dispatch)", () => {
  it("every Stage 3A import in Stage 3B runtime source resolves to the public allowlist", () => {
    const files = [
      ...walkRuntimeSourceFiles(STAGE_3B_LIB_ROOT),
      ...walkRuntimeSourceFiles(STAGE_3B_COMPONENTS_ROOT),
    ];
    const offenders: string[] = [];
    // Capture every `from '<...stage-3a...>'` or
    // `require('<...stage-3a...>')` path string.
    const importRe = /from\s+['"]([^'"]*stage-3a[^'"]*)['"]/g;
    const requireRe = /require\(\s*['"]([^'"]*stage-3a[^'"]*)['"]\s*\)/g;
    for (const f of files) {
      const code = stripJsComments(readFileSync(resolve(REPO_ROOT, f), "utf8"));
      const seen = new Set<string>();
      let m: RegExpExecArray | null;
      while ((m = importRe.exec(code)) !== null) seen.add(m[1]);
      while ((m = requireRe.exec(code)) !== null) seen.add(m[1]);
      for (const path of seen) {
        // Normalize trailing `.js` / `.ts` to be tolerant of
        // verbose import styles.
        const normalized = path.replace(/\.(?:js|ts|tsx)$/i, "");
        const allowed = ALLOWED_3A_IMPORT_PATHS.some(
          (a) => normalized === a,
        );
        const disallowed = DISALLOWED_3A_IMPORT_PREFIXES.some((p) =>
          normalized.startsWith(p),
        );
        if (disallowed || !allowed) {
          offenders.push(
            `${f}: imports ${path} (allowed: ${ALLOWED_3A_IMPORT_PATHS.join(" | ")})`,
          );
        }
      }
    }
    expect(
      offenders,
      `Stage 3B reached past the public 3A read seam:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// X7 — one-way dependency: 3A subtree imports nothing from 3B
// ══════════════════════════════════════════════════════════════════════

describe("cross-surface — one-way dependency 3A → 3B (dispatch)", () => {
  it("no file under src/lib/stage-3a or src/components/stage-3a imports from src/stage-3b or src/components/stage-3b", () => {
    const files = [
      ...walkRuntimeSourceFiles(STAGE_3A_LIB_ROOT),
      ...walkRuntimeSourceFiles(STAGE_3A_COMPONENTS_ROOT),
    ];
    const offenders: string[] = [];
    // Quote-agnostic; matches both `@/stage-3b/...` and
    // `@/components/stage-3b/...`. Relative paths (`../../stage-3b/...`)
    // also caught.
    const stage3bImportRe =
      /from\s+['"]((?:@\/|\.{1,2}\/)[^'"]*stage-3b[^'"]*)['"]/g;
    const stage3bRequireRe =
      /require\(\s*['"]((?:@\/|\.{1,2}\/)[^'"]*stage-3b[^'"]*)['"]\s*\)/g;
    for (const f of files) {
      const code = stripJsComments(readFileSync(resolve(REPO_ROOT, f), "utf8"));
      let m: RegExpExecArray | null;
      while ((m = stage3bImportRe.exec(code)) !== null) {
        offenders.push(`${f}: imports ${m[1]}`);
      }
      while ((m = stage3bRequireRe.exec(code)) !== null) {
        offenders.push(`${f}: requires ${m[1]}`);
      }
    }
    expect(
      offenders,
      `Stage 3A subtree imported from Stage 3B (circular / wrong-direction dependency):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
