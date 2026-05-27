# Stage 3A + 3B — Invariant Gap Audit

**Status:** audit only. No tests added; this doc enumerates what to add
in a follow-up wave.

**Scope:** invariants that SHOULD hold for the "What I'm Weak At"
surface (Stage 3A: `LocalWeaknessMap`, aggregator, three adapters,
taxonomy, perf instrumentation) and the "Suggested Practice" surface
(Stage 3B: `selectSuggestedPractice`, `SuggestedPracticeList`) plus the
shared `/weak-at` page that hosts both.

**Method:** read every file under `src/components/stage-3{a,b}/`,
`src/lib/stage-3a/`, `src/stage-3b/`, `src/pages/WeakAt.tsx`, and the
existing test suites listed in §1; cross-reference against the design
doc (`docs/stage-3a/local-weakness-map-design.md`) and the in-file
"Hard invariants" comments. The "should hold" set in §2 is the union
of those declared invariants plus the additional ones the source code
implicitly relies on (e.g. `isEmpty` consistency, `formatAgo` boundary
behaviour).

---

## 1. Currently enforced invariants

### 1.1 Stage 3A — `src/components/stage-3a/__tests__/invariants.test.tsx`

Six guard families, eight `it()` blocks. All pass on `main` as of
`a8cc0ab45`.

| # | Guard family | Enforcement mode | Files scanned (where source-grep) |
|---|---|---|---|
| G1 | No `@/lib/supabaseClient` or `@supabase/supabase-js` import | source-grep | LocalWeaknessMap.tsx, aggregator.ts, taxonomy.ts, 3 adapters, WeakAt.tsx |
| G2 | No `fetch` call during render/mount | runtime spy on `globalThis.fetch` | (component under test only) |
| G3 | No `localStorage.setItem` / `removeItem` / `clear` during render | runtime spy (×2: with `initialData`, without) | (component under test only) |
| G4 | No `mercy_user_facts` reference in code (comments allowed) | source-grep with comment stripper | same 7 files as G1 |
| G5 | No EN gamification / shame substring in rendered output | text scan on `container.textContent`, populated + empty fixtures | (component output) |
| G6 | No VI shame substring in rendered output | text scan on populated fixture | (component output) |

### 1.2 Stage 3A — collateral coverage outside the invariants file

- `src/lib/stage-3a/__tests__/perf.test.ts` — breadcrumb threshold,
  breadcrumb category, payload-keys-only allowlist (asserts the
  serialized crumb does not contain `vi_l1_3rd_person_s`,
  `vi_l1_past_ed`, `vi_l1_plural_s`, `TH_T`).
- `src/lib/stage-3a/__tests__/aggregator.test.ts`,
  `taxonomy.test.ts`, and the three adapter test files — unit
  behaviour, not invariants in the "must-never-do" sense.
- `tests/e2e/stage-3a-weak-at.spec.ts` — empty / populated / partial
  state at the route level.

### 1.3 Stage 3B — currently enforced

- **No `invariants.test.tsx` exists.** Stage 3B has only:
  - `src/stage-3b/__tests__/suggestedPractice.test.ts` — 8 unit tests
    on the engine (empty input → `[]`, one-per-kind cap, deterministic
    output, fallback for unknown placement tags, no EN shame regex on
    `rationale`).
  - `src/components/stage-3b/__tests__/SuggestedPracticeList.test.tsx`
    — 6 rendering tests including a no-EN-shame and no-VI-shame regex
    on container text (matches G5/G6 from §1.1 but in a different
    file, with a different fixture, and not framed as an invariant).

The shared `/weak-at` page hosts both surfaces (`src/pages/WeakAt.tsx`)
but has no invariants test of its own — the page imports
`LocalWeaknessMap` and `SuggestedPracticeList` directly with no shell
between them.

---

## 2. Gaps — invariants that should hold but aren't tested

Each row below names an invariant declared (or strongly implied) by
the source code, plus the gap class:

- **NOT-TESTED** — invariant has no enforcement at all.
- **PARTIAL** — invariant has enforcement only on one surface or one
  fixture; a regression on another path slips through.
- **INDIRECT** — invariant happens to be exercised by a behavioural
  test but no dedicated guard documents the rule.

### 2.1 Stage 3A gaps

| ID | Invariant | Gap class | Source-of-truth |
|---|---|---|---|
| 3A-G1 | Aggregator and the three adapters must not import Supabase / `@supabase/supabase-js` directly | INDIRECT | aggregator.ts header §"Hard invariants", file paths already listed in invariants.test.tsx G1 source-grep — already covered; reclassify to TESTED (see §3 note) |
| 3A-G2 | Aggregator + adapters must not call `fetch` | NOT-TESTED | aggregator.ts header §"No Supabase, no network"; only the component is fetch-spied today |
| 3A-G3 | Adapters' `safeRead*` paths must never throw on corrupted JSON, missing key, schema drift | PARTIAL | l1TagAdapter.ts, placementSnapshotAdapter.ts, pronunciationAdapter.ts (each has its own unit test but no cross-cutting "all three tolerate the same fault classes" guard) |
| 3A-G4 | `aggregateLocalWeaknesses().isEmpty === (topL1Patterns.length === 0 && placementWeaknesses.length === 0 && topPronunciationPainPoints.length === 0)` — derived field must stay consistent with constituents | NOT-TESTED | aggregator.ts L98–102; consumers gate UI on `isEmpty`, drift here misroutes both the empty card and the suggested-practice empty state |
| 3A-G5 | `formatAgo` must return a non-empty VI string for any finite `epochMs >= 0`, never `"NaN phút trước"` or `"undefined"` | NOT-TESTED | LocalWeaknessMap.tsx L355–367 |
| 3A-G6 | `SeverityDot` must be `aria-hidden` and carry no text label / numeric severity | NOT-TESTED | LocalWeaknessMap.tsx L239–256; design doc forbids "high/medium/low" text |
| 3A-G7 | Skeleton state (`local-weakness-loading`) must render before `initialData` resolves (i.e. there is a loading state, not an empty render) | NOT-TESTED | LocalWeaknessMap.tsx L91 |
| 3A-G8 | `perfInstrumentation.ts` must not import `captureException` (only `addBreadcrumb`) — Stage 3A's policy is "breadcrumbs only, never an exception" | NOT-TESTED | perfInstrumentation.ts header §"never emit a captureException" |
| 3A-G9 | Breadcrumb payload keys for the aggregator must remain exactly `{durationMs, l1Count, placementCount, pronunciationCount}` — adding e.g. `tagPreview` would silently leak tag strings | INDIRECT | perfInstrumentation.ts L82–88; perf.test.ts asserts the key set once but only for one breadcrumb |
| 3A-G10 | `describeL1Tag`, `describePhonemeAxis`, `describePlacementWeakness` must never throw and must return the `FALLBACK` entry verbatim for unknown input | PARTIAL | taxonomy.ts L881–894; covered piecewise in taxonomy.test.ts but not framed as a "no-throw" invariant |
| 3A-G11 | No `import` from `@/lib/analytics`, `posthog-js`, `react-ga`, `mixpanel`, or any analytics SDK in the Stage 3A subtree | NOT-TESTED | aggregator.ts header §"No Supabase, no analytics" (implied) |
| 3A-G12 | No `mercy_user_facts` anywhere in **perfInstrumentation.ts** — not in the G4 file list today | NOT-TESTED | invariants.test.tsx L166–174 file list omits `src/lib/stage-3a/perfInstrumentation.ts` |
| 3A-G13 | Aggregator + adapters must not write to `localStorage` (only the `record*` functions in adapters write, and only when called by upstream signal-producers; the **aggregator** must remain read-only) | INDIRECT | aggregator.ts header §"No localStorage WRITE"; current invariants test only spies during component render |
| 3A-G14 | The 7-file source-grep list in invariants.test.tsx must stay in sync with the actual Stage 3A subtree (or the test silently under-covers when new files are added) | NOT-TESTED | invariants.test.tsx L79–87 + L166–174 (hardcoded lists, drift-prone) |

### 2.2 Stage 3B gaps

| ID | Invariant | Gap class | Source-of-truth |
|---|---|---|---|
| 3B-G1 | No Supabase / `@supabase/supabase-js` import in `src/stage-3b/*` or `src/components/stage-3b/*` | NOT-TESTED | suggestedPractice.ts header §"No Supabase imports" |
| 3B-G2 | No `fetch` call during `SuggestedPracticeList` render/mount | NOT-TESTED | SuggestedPracticeList.tsx header §"No fetch" |
| 3B-G3 | No `localStorage.setItem` / `removeItem` / `clear` during `SuggestedPracticeList` render (engine is pure — but the list calls `aggregateLocalWeaknesses()` which reads; no write expected) | NOT-TESTED | SuggestedPracticeList.tsx header §"No localStorage.setItem / removeItem" |
| 3B-G4 | No `mercy_user_facts` reference (comments allowed) in `src/stage-3b/*` or `src/components/stage-3b/*` | NOT-TESTED | suggestedPractice.ts header §"No mercy_user_facts" |
| 3B-G5 | `SuggestedPracticeList` renders no EN gamification / shame substring on populated + empty fixtures | PARTIAL | SuggestedPracticeList.test.tsx already covers populated case (line 87) and empty (line 105), but framed as unit tests not invariants — vulnerable to deletion under "this duplicates G1/G2" reasoning |
| 3B-G6 | `SuggestedPracticeList` renders no VI shame substring on populated + empty fixtures | PARTIAL | same as 3B-G5 |
| 3B-G7 | `selectSuggestedPractice` must not call `Date.now()` or `Math.random()` — engine is documented as "pure / deterministic / byte-for-byte" | NOT-TESTED | suggestedPractice.ts header §"Deterministic: identical input → identical output, byte-for-byte" |
| 3B-G8 | At most ONE item per `kind` ("l1" / "placement" / "pronunciation") regardless of input size | PARTIAL | suggestedPractice.test.ts covers the L1 cap but not placement / pronunciation caps; a regression that loops the placement array would slip |
| 3B-G9 | `id` field always matches `^(l1\|placement\|pronunciation):.+$` | INDIRECT | types.ts L13; one test asserts equality on a specific shape, no regex guard for arbitrary inputs |
| 3B-G10 | `viLabel` / `enLabel` / `rationale` are non-empty for every emitted item | INDIRECT | suggestedPractice.test.ts L121–124 (one fixture); not asserted across the unknown-tag fallback or partial inputs |
| 3B-G11 | Engineer-tag identifiers (the snake_case / UPPER_SNAKE_CASE source tag) must never appear inside `viLabel`, `enLabel`, or `rationale` | PARTIAL | suggestedPractice.test.ts L123–127 covers it for one fixture; not a structural invariant across all tags |
| 3B-G12 | The row's `onClick` `console.log("[suggested-practice] selected", item.id)` is a known breadcrumb. If it stays in production, it must NEVER carry the engineer-tag in a way other than `item.id` itself — i.e. no `console.log(item.viLabel)`, no PII | NOT-TESTED | SuggestedPracticeList.tsx L113; arguable whether the current shape is acceptable — flag for design call |
| 3B-G13 | `kindPresentation` is total across `SuggestedPracticeKind` — TS catches this compile-time, but runtime input from a future corrupted state must not crash the row (today a bad kind would fall off the switch and return `undefined`, then `Icon` is `undefined`, then React throws) | NOT-TESTED | SuggestedPracticeList.tsx L147–172 |
| 3B-G14 | `selectSuggestedPractice` returns `[]` (not `null`, not `undefined`, not a throw) for any `LocalWeaknessMap`-shaped input including malformed ones (e.g. `topL1Patterns: undefined as any`) | NOT-TESTED | suggestedPractice.ts §"Returns" contract; current tests use the typed builder only |
| 3B-G15 | No `import` from `@/lib/analytics`, `posthog-js`, etc. in Stage 3B subtree | NOT-TESTED | suggestedPractice.ts header (implied, mirrors 3A-G11) |

### 2.3 Cross-surface gaps

| ID | Invariant | Gap class |
|---|---|---|
| 3AB-G1 | The shared `/weak-at` page (`src/pages/WeakAt.tsx`) must inherit all Stage 3A + 3B no-import guards (Supabase / fetch / mercy_user_facts / analytics) | NOT-TESTED |
| 3AB-G2 | Section testids (`local-weakness-map`, `local-weakness-empty`, `suggested-practice-list`, `suggested-practice-empty`) must remain stable — the E2E spec keys off them, the marketing screenshot spec keys off them | INDIRECT |
| 3AB-G3 | When `aggregateLocalWeaknesses()` returns `isEmpty: true`, both `LocalWeaknessMap` and `SuggestedPracticeList` must render their own empty card — not skeleton, not nothing | INDIRECT (e2e covers one half) |

---

## 3. Proposed test patterns + effort

Effort scale: **S** = one-line addition to existing file (< 10 LoC),
**M** = new `describe` block in an existing file (10–40 LoC), **L** =
new test file (> 40 LoC).

### 3.1 Stage 3A

| ID | Pattern | Effort |
|---|---|---|
| 3A-G2 | Source-grep `globalThis.fetch\|window\.fetch\|^fetch\(` (after comment strip) over the 7-file list + `perfInstrumentation.ts` | S |
| 3A-G3 | New `describe("Stage 3A — fault tolerance")` block: feed each adapter `'not-json'`, `'{"corrupt": true}'`, `[]`, `null` via `localStorage.setItem`, assert reader returns the documented safe default | M |
| 3A-G4 | Unit test on `aggregator.ts`: build fixtures where one bucket has zero entries but `isEmpty: false`; assert recomputed `isEmpty` matches the bucket constituent rule | S |
| 3A-G5 | Unit test on `formatAgo` (extract as named export OR re-derive via rendering boundary cases at `lastSeen = 0`, `-1`, `Date.now() + 60_000`, `NaN`, `Infinity`) | S |
| 3A-G6 | Add to invariants.test.tsx: render populated fixture, query `[data-testid="placement-severity-dot"]`, assert `getAttribute("aria-hidden") === "true"` and `textContent === ""` | S |
| 3A-G7 | Render `<LocalWeaknessMap />` without `initialData`, mock `aggregateLocalWeaknesses` to defer, assert `local-weakness-loading` testid present synchronously | M |
| 3A-G8 | Source-grep guard in invariants.test.tsx: read perfInstrumentation.ts, assert `/captureException/` only appears inside comments (use existing `stripJsComments` helper) | S |
| 3A-G9 | Add to perf.test.ts: assert `Object.keys(crumb.data).sort()` equals the documented allowlist for every breadcrumb path (aggregator + uiMount), not just one | S |
| 3A-G10 | Unit test on taxonomy.ts: pass `"definitely_not_a_real_tag"` / `"NOT_AN_AXIS"` / `""` to each of the three describe* functions, assert returns the `FALLBACK` constant verbatim and never throws | S |
| 3A-G11 | Source-grep guard: assert none of the 7 files import from `@/lib/analytics`, `posthog-js`, `react-ga`, `mixpanel-browser`, `@segment/analytics-next`, `@vercel/analytics` | S |
| 3A-G12 | Add `src/lib/stage-3a/perfInstrumentation.ts` to the existing G4 file list in invariants.test.tsx | S |
| 3A-G13 | Runtime spy in invariants.test.tsx: stub `localStorage.setItem` globally, call `aggregateLocalWeaknesses()` directly (not via component render), assert the spy never fires | S |
| 3A-G14 | New "drift guard" test: walk `src/components/stage-3a` and `src/lib/stage-3a` via `fs.readdirSync`, assert every `.ts` / `.tsx` file is in both the G1 and G4 file lists. Forces future contributors to add new files to the guard list when they create them | M |

### 3.2 Stage 3B

| ID | Pattern | Effort |
|---|---|---|
| **Stage 3B `invariants.test.tsx`** | Mirror Stage 3A's six guard families (G1–G6) over the 3B file list: `src/stage-3b/suggestedPractice.ts`, `src/stage-3b/types.ts`, `src/components/stage-3b/SuggestedPracticeList.tsx`, plus the shared `src/pages/WeakAt.tsx` (already in 3A list). Use the same `stripJsComments` helper for the `mercy_user_facts` grep. | **L** — new file, ~250 LoC |
| 3B-G7 | Runtime: `vi.spyOn(globalThis, 'Date', 'get')`, `vi.spyOn(Math, 'random')`. Call `selectSuggestedPractice(state)` 10× with the same input, assert both spies never fire. | M |
| 3B-G8 | Inputs of size 5/5/5 across all three kinds, assert `result.filter(r => r.kind === k).length <= 1` for each k. | S |
| 3B-G9 | Run engine over a fixture covering all three kinds + the FALLBACK path, assert `/^(l1\|placement\|pronunciation):.+$/.test(item.id)` for every item. | S |
| 3B-G10 | Extend the existing taxonomy-resolves test to also assert non-empty `rationale` for every item, across populated + unknown-tag inputs. | S |
| 3B-G11 | Generalize the existing engineer-tag-not-in-copy assertion: pass a fixture where source tags are `vi_l1_3rd_person_s`, `R_L_W_POSITION_CONFUSION`, `inflectional_s_ed_inaudible`; assert `item.{viLabel,enLabel,rationale}.includes(sourceTag) === false` for every item. | S |
| 3B-G12 | Render row, fire click, capture `console.log` calls via `vi.spyOn(console, 'log')`. Assert exactly one call, exactly one argument structure, and that the logged payload contains only `item.id` (which is `${kind}:${sourceTag}` — itself the breadcrumb identity, not a leak per se, but locked here so a future "add `viLabel` to the log" PR fails loudly). | S |
| 3B-G13 | Render `<SuggestedPracticeRow item={{...validItem, kind: 'unknown' as any}} />`, assert no throw (defensive). Alternative: change `kindPresentation` to return a fallback for unknown kind. | M (paired with code change in a follow-up — flag for design) |
| 3B-G14 | Pass `{ topL1Patterns: undefined } as any` / `{ topL1Patterns: null } as any` / `{}` as state, assert `selectSuggestedPractice` returns `[]` rather than throwing on the `state.topL1Patterns[0]` access. | S (requires small code-side hardening: `state.topL1Patterns?.[0]`) — paired follow-up |
| 3B-G15 | Source-grep mirror of 3A-G11 over the 3B files. | S |

### 3.3 Cross-surface

| ID | Pattern | Effort |
|---|---|---|
| 3AB-G1 | The drift-guard test (3A-G14) should walk the union of 3A + 3B subtrees and assert WeakAt.tsx is in both lists. | included in 3A-G14 |
| 3AB-G2 | Snapshot the `data-testid` list under both subtrees (literal regex `data-testid="([^"]+)"`), commit the list to a fixture, assert no removals. New testids OK; removed testids fail (catches accidental rename → broken E2E or marketing-screenshot spec). | M |
| 3AB-G3 | Render `<WeakAt />` with no localStorage seed, assert both `local-weakness-empty` AND `suggested-practice-empty` testids visible. | S |

---

## 4. Risk ranking — how badly does prod break if the gap stays silent?

Ranked highest-risk first. "Risk" = `severity × likelihood-of-silent-regression`.

### Tier 1 — would corrupt the surface or silently leak data

| Rank | Gap | Why it matters |
|---|---|---|
| 1 | **3B-G1, G2, G3, G4** (Stage 3B no-Supabase / no-fetch / no-write / no-mercy_user_facts) — entire file missing | Stage 3B has **no invariants test at all**. A single PR could import the Supabase client into `SuggestedPracticeList` to log a "weak-at viewed" event and ship green. The whole posture of Stage 3 ("local-only, no analytics, no Supabase") leaks here first. |
| 2 | **3A-G14 / 3AB-G2** (file-list drift) | Today's invariants test grep is a hardcoded 7-file list. Every new Stage 3A file is invisible to G1/G4 until someone updates the list. The aggregator perf file is already missing (3A-G12). Next contributor's file will be too. |
| 3 | **3A-G12** (perfInstrumentation missing from G4 grep) | Concrete instance of the above — if perfInstrumentation grew a `mercy_user_facts` reference today, the invariants test would not catch it. |
| 4 | **3A-G11 / 3B-G15** (no analytics import) | The "no analytics" rule is in the prose comments but has no enforcement anywhere. A PR adding `import { trackEvent } from "@/lib/analytics"` to either subtree ships green and silently emits PII to whatever provider the analytics module wraps. |
| 5 | **3A-G9** (breadcrumb payload key allowlist) | If a future contributor adds `tagPreview` or `firstPhoneme` to the aggregator breadcrumb data, the privacy invariant ("counts only, never tag strings") quietly breaks. Sentry breadcrumbs travel with every `captureException` in the app — would leak across all errors, not just Stage 3A. |
| 6 | **3B-G7** (engine purity — no `Date.now()`, no `Math.random()`) | If the engine becomes non-deterministic, the "Suggested practice" list will reshuffle every render, the test that asserts "same input twice returns identical output" will pass (same closure-call timing) and prod will silently jitter. |

### Tier 2 — would degrade UX or break a contracted invariant

| Rank | Gap | Why it matters |
|---|---|---|
| 7 | **3A-G4** (`isEmpty` consistency) | The aggregator's `isEmpty` flag gates both LocalWeaknessMap and SuggestedPracticeList empty cards. If it drifts from the bucket counts, learners would see the populated component shell with no rows, or the empty card while data exists. |
| 8 | **3A-G7** (skeleton loading state) | A regression that turns the skeleton into an instant-empty render would make every cold load look like "you have no weaknesses yet" before the data resolves — directly contradicting the design's "no shame" rule. |
| 9 | **3B-G8** (one-per-kind cap, placement + pronunciation) | The L1 cap is tested; the other two aren't. If a future "promote by signal strength" rewrite loops the placement array, the UI would show 5 placement items + 0 L1 + 0 pronunciation — defeating the "balanced 3 cards" intent. |
| 10 | **3A-G13** (aggregator must not write localStorage) | The aggregator is documented as read-only; today's invariants test only spies during component render. A future change adding "remember which signals we surfaced last" caching to the aggregator would slip through. |
| 11 | **3A-G2** (no-fetch in adapter / aggregator) | The adapter unit tests don't currently fetch-spy. A future "let's call a CDN for the taxonomy" hack would ship. |
| 12 | **3A-G8** (no `captureException` import in perfInstrumentation) | Stage 3A claims it never emits exceptions to Sentry — only breadcrumbs. A subtle regression that calls `captureException(new Error('slow'))` would start firing Sentry alerts on every degraded read. |

### Tier 3 — would surface as visible bugs (caught at QA)

| Rank | Gap | Why it matters |
|---|---|---|
| 13 | **3A-G5** (`formatAgo` boundary behaviour) | A regression here is loud — "NaN phút trước" is visible on every row. QA catches it; learners just see weirdness for a deploy cycle. |
| 14 | **3A-G6** (severity dot `aria-hidden` + no text) | Adding a tooltip / aria-label that says "high severity" would visibly violate the "no shame language" rule but is also a screen-reader accessibility concern. |
| 15 | **3B-G13** (`kindPresentation` runtime totality) | TS catches this for known kinds; only a corrupted-state path could break it, low likelihood. |
| 16 | **3B-G14** (engine tolerates malformed input) | The engine is only called from the well-typed `aggregateLocalWeaknesses` output today; risk is future callers (e.g. an SSR path) passing partial state. |
| 17 | **3A-G10** (taxonomy describe* fallback) | Today's behaviour is correct; a regression would surface raw engineer-tags in the UI — visible immediately, caught at QA. |
| 18 | **3B-G9 / 3B-G10 / 3B-G11** | All "shape of output" guards; loud regressions, not silent leaks. |
| 19 | **3B-G12** (`console.log` payload locked to `item.id`) | Marginal — `console.log` is local-browser-only and the breadcrumb is the engineer-tag composite. Worth locking before someone adds the VI label "for debugging" and ships it. |
| 20 | **3A-G3** (cross-cutting adapter fault tolerance) | Each adapter has its own unit tests covering its own fault classes; the gap is "all three under the same fixture matrix", which is a robustness nicety, not a correctness must-have. |
| 21 | **3AB-G3** (both empty cards on empty state) | Composition test; E2E catches the LocalWeaknessMap half today. |

---

## 5. Follow-up wave shape

If picked up as a single MR, the shape is roughly:

1. **One new test file** — `src/components/stage-3b/__tests__/invariants.test.tsx` mirroring 3A's six guards. Covers gaps **3B-G1 through G6**.
2. **Extensions to `invariants.test.tsx` (3A)** — add `perfInstrumentation.ts` to both file lists, add the analytics-import grep, add the `captureException`-only-in-comments grep, add the file-list drift guard. Covers **3A-G8, G11, G12, G14, 3AB-G1**.
3. **One new test file** — `src/lib/stage-3a/__tests__/contracts.test.ts` for `isEmpty` consistency, `formatAgo` boundaries, taxonomy fallback totality. Covers **3A-G4, G5, G10**.
4. **Extensions to `perf.test.ts`** — payload key allowlist across all breadcrumb paths. Covers **3A-G9**.
5. **Extensions to `suggestedPractice.test.ts`** — engine purity spies, one-per-kind across all three kinds, id-regex, malformed-input tolerance. Covers **3B-G7, G8, G9, G14**.
6. **Extensions to `SuggestedPracticeList.test.tsx`** — severity dot a11y, kindPresentation defensive, console.log payload lock. Covers **3A-G6, 3B-G12, G13**.

Total estimated effort: **~400 LoC across 6 file touches**. Most are
copy-paste from the existing 3A invariants file with the file list
swapped — the long pole is the engine-purity spies and the drift
guard.

Risk note: tier-1 gaps (1–6 above) account for >80% of the value;
landing item 1 + item 2 alone closes them.
