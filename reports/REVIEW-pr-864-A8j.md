# PR #864 Review — A18 PR1.5 Downgrade Beacon (A8j)

**Agent:** A8j (billing-logic review of the beacon implementation)
**Branch:** `review/864-downgrade-beacon`
**Subject:** PR #864 `feat/a18-recompute-downgrade-beacon` — `feat(billing): A18 PR1.5 — downgrade beacon for recomputeEntitlement (A18 §7 row 6)`
**Files reviewed:**
- `supabase/functions/_shared/sentry.ts` (+36 lines)
- `supabase/functions/_shared/entitlement/recompute.ts` (347 lines total; +57 vs #843)
- `supabase/functions/_shared/entitlement/__tests__/recompute.test.ts` (739 lines total; +159 vs #843)

**Labels:** money-path, review, billing-logic, observability

---

## Verdict — APPROVE

**All 6 dispatch invariants pass.** The beacon is implemented exactly the way A8i's review of #843 recommended (Option A — read-before-RPC), with thorough mocking, the full mandated transition coverage, and zero new call sites. One small observation (an extra test case for symmetry) and one merge-strategy note about #864 vs #843 — both in §7. Neither is a merge blocker.

---

## 0. Branch / scope correction up front

The dispatch said #864 is "stacked on #843's tip." It is **not** — `gh pr view 864 --json baseRefName` returns `main`, not `feat/a18-recompute-entitlement-writer`. #864's diff against `origin/main` includes **the full #843** (290 lines of `recompute.ts`) **plus the beacon additions** (+57 lines on `recompute.ts`, +159 lines on tests, +36 lines on `_shared/sentry.ts`). #864 therefore **supersedes** #843 rather than building on it; merging both would conflict.

Flag for §7.B — this is a merge-strategy question for Chau, not a review defect.

---

## 1. Check — Prior-state SELECT fires BEFORE the RPC call ✅ CORRECT

Lines 244-262 (the R3 block):

```ts
let priorIsPremium: boolean | null = null;
const r3 = await supabase
  .from("entitlements")
  .select("is_premium")
  .eq("user_id", userId)
  .eq("app_id", appId)
  .maybeSingle();

if (r3.error) {
  await captureEdgeError(r3.error, { /* … phase: "read-prior-entitlement" … */ });
  // Do NOT throw — proceed without prior-state knowledge.
} else if (r3.data) {
  priorIsPremium = (r3.data as { is_premium?: unknown }).is_premium === true;
}
```

Sequencing verified against `/tmp/864-recompute.ts`:

| Step | File line | Phase |
|---|---|---|
| R1 read (subscriptions) | 138-152 | reads |
| R2 read (user_subscriptions gift fallback) | 176-194 | reads |
| **R3 read (prior entitlement)** | **245-262** | **prior-state** |
| derive | 266-269 | logic |
| RPC `recompute_entitlement_tx` | 273-307 | write |
| beacon emission | 320-337 | observability |

**R3 fires at line 245, RPC fires at line 273.** Strict ordering confirmed. The writer cannot know the post-write `priorIsPremium` after the RPC because the RPC overwrites the row in the same call; reading it after would always return the *new* state, defeating the beacon. Read-before-write is the only correct shape and is what shipped.

Also of note: the writer uses `.maybeSingle()` (not `.single()`), which returns `data === null` for the "no prior row" case instead of throwing a not-found error. That's the right tolerance for the first-ever recompute of a user — verified in test case 8.4 (§4 below).

---

## 2. Check — Beacon fires only on true→false ✅ STRICT

Line 320:

```ts
if (priorIsPremium === true && row.is_premium === false) {
  await addEdgeBreadcrumb({ /* category: "billing.downgrade", … */ });
  console.info(JSON.stringify({ /* event: "downgrade-beacon", … */ }));
}
```

The condition uses **strict equality** on both sides. The exhaustive transition table:

| prior | new | Fires? | Why |
|---|---|---|---|
| `true` | `true` | NO | `row.is_premium === false` fails (`true === false` is false) |
| `true` | `false` | **YES** | both sides true ✅ |
| `false` | `true` | NO | `priorIsPremium === true` fails (`false === true` is false) |
| `false` | `false` | NO | `priorIsPremium === true` fails |
| `null` | `true` | NO | `priorIsPremium === true` fails (`null === true` is false) |
| `null` | `false` | NO | same — null is not true |

Only the `true → false` transition fires the beacon. **No false-positive on first write** (priorIsPremium starts `null`; cannot become `true` unless the SELECT returned `is_premium === true`). **No false-positive on R3 error** (priorIsPremium stays `null`; cannot fire). **No false-positive on upgrade** (`false → true` fails the first conjunct).

The strict-equality discipline is correct here. `priorIsPremium == true` (loose) would coerce `1` and `"true"` into `true` — but the assignment at line 261 (`is_premium === true`) is already strict, so this is defense-in-depth, not necessary. Accept.

**Beacon is pure observability — never throws.** Lines 320-337 contain no `throw` and no `try { … } catch`. The two emitter calls are:
- `await addEdgeBreadcrumb({…})` — the `try/catch` in `addEdgeBreadcrumb` (sentry.ts:175-184) swallows errors. Cannot propagate.
- `console.info(…)` — synchronous, cannot throw on a well-formed `JSON.stringify` of plain values.

So a malformed Sentry SDK can never break a recompute. ✅

---

## 3. Check — Sentry import mocked in tests ✅ FULLY MOCKED

Test setup lines 54-71:

```ts
const captureEdgeErrorMock = vi.fn().mockResolvedValue(undefined);
const addEdgeBreadcrumbMock = vi.fn().mockResolvedValue(undefined);
vi.mock("../../sentry.ts", () => ({
  captureEdgeError: (...args: unknown[]) => captureEdgeErrorMock(...args),
  addEdgeBreadcrumb: (...args: unknown[]) => addEdgeBreadcrumbMock(...args),
}));
// …
beforeEach(() => {
  captureEdgeErrorMock.mockClear();
  addEdgeBreadcrumbMock.mockClear();
});
```

- `vi.mock("../../sentry.ts")` replaces **the entire module** with the two-spy stub — neither `captureEdgeError` nor `addEdgeBreadcrumb` reaches the real Sentry SDK in any test.
- Both spies are `mockResolvedValue(undefined)` so awaiting them is safe in the writer.
- `beforeEach` clears mock calls — no test bleeds state into the next.

No real Sentry calls are possible in this test suite. ✅

Bonus: tests that assert the structured `console.info` log also use `vi.spyOn(console, "info").mockImplementation(() => {})` (line 573, 609, 624, 642) — so the log doesn't pollute test stdout. Cleaned up via `consoleInfoSpy.mockRestore()` at end of each test.

---

## 4. Check — 5 mandatory transitions covered in tests ✅ ALL FIVE PRESENT

Test block `describe("recomputeEntitlement — downgrade beacon (case 8 / PR1.5)")` at lines 571-683 contains exactly the 5 cases the dispatch mandated:

| # | Test (line) | Transition | Assertions |
|---|---|---|---|
| 1 | "active→inactive: emits Sentry breadcrumb + structured console.info log" (572) | `true → false` | `addEdgeBreadcrumb` called **once**; crumb.category = `"billing.downgrade"`; crumb.message matches `entitlement downgraded: ${USER_ID} (stripe-webhook)`; crumb.level = `"warning"`; crumb.data shape strict; `console.info` called once with structured JSON; `logged.event = "downgrade-beacon"` |
| 2 | "inactive→inactive: NO beacon (downgrade did not happen)" (608) | `false → false` | `addEdgeBreadcrumb` NOT called; `console.info` NOT called |
| 3 | "active→active: NO beacon (steady-state recompute)" (623) | `true → true` (active sub kept) | `addEdgeBreadcrumb` NOT called; `console.info` NOT called; new `result.is_premium === true` |
| 4 | "no prior row (first write): NO beacon" (641) | `null → either` | priorEntitlement default `{ data: null, error: null }`; `addEdgeBreadcrumb` NOT called; `console.info` NOT called |
| 5 | "R3 (prior-state read) error: warning captured, recompute proceeds, NO beacon" (656) | `error → ?` | recompute returns a row (no throw); `captureEdgeError` called with `tags.phase = "read-prior-entitlement"` and `tags.reason = "admin-manual-fix"`; `addEdgeBreadcrumb` NOT called |

All five transitions the dispatch named are covered. Cases 2-5 each separately spy on `console.info` and assert it was NOT called — defensive (the JSON log is the standalone-observability path; a missing `addEdgeBreadcrumb` assertion alone would not catch a regression where the log fires without the breadcrumb).

**Mock-call assertions per case:**

- Case 1: `addEdgeBreadcrumbMock.mock.calls[0]` destructured to inspect the first arg's `.category`, `.message`, `.level`, `.data`. Tight assertions; a refactor that changed any field shape would fail this test.
- Case 5: `captureEdgeErrorMock.mock.calls[0]` destructured to verify the captured error is the *exact* `r3err` reference (not a re-wrapped error), and that `tags.phase` and `tags.reason` are present. Confirms the prior-state error becomes a warning at the right phase.

---

## 5. Check — No call sites added (still zero importers) ✅ CONFIRMED

`git grep` against `origin/feat/a18-recompute-downgrade-beacon`:

```bash
git grep -n 'recomputeEntitlement\|from.*entitlement/recompute' \
  origin/feat/a18-recompute-downgrade-beacon \
  -- 'src/' 'supabase/functions/' \
  | grep -v '_shared/entitlement/recompute\|__tests__'
# → (no output)
```

Also verified the new `addEdgeBreadcrumb` export has no callers outside the new code:

```bash
git grep -n 'addEdgeBreadcrumb' \
  origin/feat/a18-recompute-downgrade-beacon \
  -- 'src/' 'supabase/functions/' \
  | grep -v 'test\|sentry.ts\|_shared/entitlement/recompute.ts'
# → (no output)
```

PR remains additive. The new `_shared/sentry.ts` `addEdgeBreadcrumb` export does not refactor any existing Sentry call — it ships alongside `captureEdgeError`, available for future use, with `recompute.ts` as its sole current consumer.

`sentry.ts` diff (+36 lines): a new `BreadcrumbOptions` interface, a new `addEdgeBreadcrumb` function with try/catch swallowing inside (line 156-184), and a new field on the `SentryShape` type union (line 40-46) describing the Sentry SDK's own `addBreadcrumb`. All purely additive. No existing exports renamed; no behavior of `captureEdgeError` altered.

---

## 6. Cross-PR sanity vs #843 ✅ ALL #843 INVARIANTS PRESERVED

I rechecked all 6 invariants from my own A8i (#860) verdict against the #864 writer:

| A8i Check | #843 verdict | #864 verdict |
|---|---|---|
| 1. RPC 6-arg signature match | ✅ MATCH | ✅ MATCH (unchanged from #843; lines 273-280) |
| 2. Derives from subscriptions + gifts only | ✅ CLEAN | ✅ CLEAN (R3 reads `entitlements.is_premium` but **does not feed it to derive** — used only for beacon comparison) |
| 3. `computed_at = opts.now ?? new Date()`, frozen once | ✅ CORRECT | ✅ CORRECT (line 134, 174; unchanged) |
| 4. Monotonic-guard + null-data cascade-race | ✅ CORRECT | ✅ CORRECT (lines 282-307; unchanged from #843) |
| 5. Single derive owner | ✅ PRESERVED | ✅ PRESERVED (line 266-269; one call site only; R3's prior-state read is NOT a derive, it reads `is_premium` directly off the persisted row) |
| 6. Zero call sites | ✅ CONFIRMED | ✅ CONFIRMED (§5 above) |

**#864 is a strict superset of #843** — every billing-logic invariant I approved in A8i still holds, plus the beacon now satisfies A18 §7 row 6.

---

## 7. Observations (non-blocking)

### 7.A — Untested transitions

The 5 mandatory transitions are covered. Two transitions are **not** directly tested but are structurally excluded by the strict-equality condition:

1. **`false → true` (upgrade)** — the beacon must not fire on an upgrade. Implicit per the `priorIsPremium === true` first conjunct; `false === true` is `false`.
2. **`null → true` (first-write activation)** — also covered implicitly by the same first conjunct.

Both could be added as a single extra test for symmetry — costs ~12 lines, makes the beacon's *asymmetry* explicit. I do **not** consider this required for merge; the strict condition is self-evidently asymmetric and case 8.4 already exercises the `priorIsPremium === null` branch.

Suggested wording for the optional follow-up test:
```ts
it("inactive→active (upgrade): NO beacon — beacon is asymmetric by design", async () => {
  // false → true: prior was inactive, new is active. The beacon must
  // NOT fire — upgrades are not downgrades. This guards the strict-
  // equality shape against a future "fire on any flip" refactor.
});
```

### 7.B — Merge strategy: #864 supersedes #843

Per §0, #864 is **not** stacked on #843; it includes the full #843 plus the beacon. Merging both PRs would conflict. The clean resolution:

1. **Recommended:** close #843 in favor of #864. #864 is a strict superset that is more complete (adds the brief-mandated observability hook that #843's narrowed dispatch deferred). The minor structural-angle work A6h did against #843 transfers directly to #864 since the original 290 lines are byte-identical.
2. Alternative: merge #843 first, then rebase #864 onto main and re-review. More PRs, no functional difference. Slower.

I do not have authority to close PRs; flagging for Chau's decision.

### 7.C — Beacon `level: "warning"` choice

The beacon's Sentry level is `"warning"` (line 324). A downgrade is **not an error** (correct — the brief explicitly calls it "NOT a failure"); using `"info"` would also be defensible. `"warning"` makes it more dashboard-visible without producing a paging event. Accept.

### 7.D — Structured `console.info` log key shape

The structured log keys are `scope/level/event/userId/appId/reason`. Three observations:

1. `scope = "recomputeEntitlement"` matches the `functionName` convention used in `captureEdgeError` calls in the same file. Consistent. ✅
2. `level = "warning"` matches the breadcrumb level. ✅
3. No `timestamp` field — `console.info` already attaches an edge-runtime timestamp to the line. ✅

The log line is JSON-parseable (test case 8.1 line 598 does `JSON.parse(consoleInfoSpy.mock.calls[0][0] as string)`). Compatible with any line-based log scraper (Vector / Vercel logs / Sentry log integration). Accept.

### 7.E — R3 reads `entitlements.is_premium` which is GENERATED

`is_premium` is `GENERATED ALWAYS … STORED` per #789 lines 85-88. Selecting it returns the materialized boolean — no JS-side derivation, no chance of disagreeing with the source `status`. The R3 read is therefore the **cleanest** way to know "was this user previously entitled?" — equivalent to recomputing the predicate but using the database's own stored truth. ✅

---

## 8. Out of scope for this review (defer if/when needed)

- Whether `sentry.ts` already conforms to repo's TS lint config after the +36 lines (structural angle).
- Whether vitest's `vi.mock(…)` factory-form is compatible with the edge-fn test runner config.
- Whether the test file's narrative `describe(…)` ordering matches the convention used elsewhere in `supabase/functions/_shared/__tests__/`.
- TypeScript compilation under the edge tsconfig path.
- Whether `npm run typecheck:ci` and `npm test` pass green on this branch (CI status check — outside review's hand-analysis scope).

---

## 9. Cross-refs

- PR #864 — subject under review
- PR #860 (A8i) — #843 review; verdict APPROVE-with-deferred-observation (the observation #864 addresses)
- PR #843 — A18 PR1 (predecessor; **superseded** by #864 per §0 / §7.B)
- PR #832 (A8e) — `recompute_entitlement_tx` RPC; this writer's sole RPC consumer
- PR #802 — `_shared/entitlement.ts` (deriveEntitlement / EntitlementInput / EntitlementSnapshot)
- PR #789 — entitlements table; provides the `is_premium` column R3 reads
- `reports/RECON-recompute-entitlement-impl-brief-A18.md` §7 row 6, §8 case 7 on `origin/a18/recompute-impl-brief`

---

## 10. Verdict summary

| # | Check | Verdict |
|---|---|---|
| 1 | Prior-state SELECT fires BEFORE RPC | ✅ CORRECT |
| 2 | Beacon fires only on `true → false` | ✅ STRICT |
| 3 | Sentry import mocked in tests | ✅ FULLY MOCKED |
| 4 | 5 mandatory transitions covered | ✅ ALL FIVE PRESENT |
| 5 | No call sites added | ✅ CONFIRMED |
| (bonus) | All A8i / #843 invariants preserved | ✅ STRICT SUPERSET |

**APPROVE.** Two non-blocking observations (§7.A optional symmetric test; §7.B #864-supersedes-#843 merge strategy) flagged for Chau.

---

## Status

- **No code touched.** No `recompute.ts`, no test file, no `sentry.ts` edited.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR.

*A8j — billing-logic review of the downgrade beacon. APPROVE.*
