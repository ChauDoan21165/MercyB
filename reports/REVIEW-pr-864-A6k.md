# Review — PR #864 `feat/a18-recompute-downgrade-beacon` (A6k)

**Reviewer:** A6 (A6k — structural angle, complementary to A8j's billing-logic angle)
**Worktree:** `/private/tmp/A6k-864-review` (off `origin/main` @ `cc4f03a02`)
**Sources:** `git diff pr-843..pr-864` (the true additive delta), `gh pr view 864`, `git show pr-864:...`
**Mode:** read-only

---

## Headline

**APPROVE.** PR1.5 closes A18 §7 row 6 (downgrade beacon) as a clean additive layer on top of #843 (PR1). The true delta over #843's tip is **+253/−1** across 3 files: one new export in `sentry.ts`, a SELECT-then-emit block inside `recomputeEntitlement`, and 5 new tests (4 mandated transitions + 1 R3-error). Additive-only verified, prior-state SELECT correctly placed, Sentry fully mocked in tests, and **no `SupabaseClientLike` duplication** — the type is imported (not redeclared), so post-#843-squash rebase produces a clean diff.

---

## 1. True additive delta over #843

`gh pr view 864` correctly states the diff against `main` includes #843's content because `recompute.ts` doesn't exist on main yet. The **true new work** is the diff against #843's tip:

```
git diff pr-843..pr-864 --stat
 supabase/functions/_shared/entitlement/__tests__/recompute.test.ts  | 159 +++++++++++++++++++++
 supabase/functions/_shared/entitlement/recompute.ts                 |  59 +++++++-
 supabase/functions/_shared/sentry.ts                                |  36 +++++
 3 files changed, 253 insertions(+), 1 deletion(-)
```

That's the layer to review. **3 files, no deletions other than the one-line import expansion.**

The PR body honestly acknowledges the dispatch said "NOT stacked on #843" but the author had to branch off #843's tip because `recompute.ts` doesn't exist on main yet. The squash-orphan risk is correctly flagged per memory `feedback_stacked_pr_squash_orphan`. Acceptable — when #843 squash-merges, the author needs to rebase #864 onto the new main and verify the diff cleans down to +253/−1. Reviewable today.

---

## 2. Additive-only — zero new call sites outside the test file

Independent verification — grepped all of `supabase/functions/` against #864's tree:

```
grep -rln "addEdgeBreadcrumb" supabase/functions/
  supabase/functions/_shared/sentry.ts                                          ← declaration
  supabase/functions/_shared/entitlement/recompute.ts                           ← single caller (inside recomputeEntitlement)
  supabase/functions/_shared/entitlement/__tests__/recompute.test.ts            ← vi.mock + assertions
```

3 hits, all expected:
- **sentry.ts** declares `addEdgeBreadcrumb` (new export). No prior export, so nothing displaced.
- **recompute.ts** is the single caller — inside `recomputeEntitlement`. Since #843 confirmed `recomputeEntitlement` itself has **zero external call sites** in app code (A6h §1), the beacon code is downstream of dead-code-in-bundle today. Until PR2 wires the first caller, it can never fire in prod.
- **recompute.test.ts** mocks it via `vi.mock`.

No production code outside `recompute.ts` invokes the beacon. ✅ **Additive-only confirmed.**

---

## 3. Prior-state SELECT placed BEFORE the RPC

The R3 block in the diff:

```ts
/* ── R3: prior entitlement state (for downgrade beacon detection) ─ */
let priorIsPremium: boolean | null = null;
const r3 = await supabase
  .from("entitlements")
  .select("is_premium")
  .eq("user_id", userId)
  .eq("app_id", appId)
  .maybeSingle();
```

…is inserted between the "end gift fallback" comment and the existing `deriveEntitlement` call. That places it:

1. **After** R1 (subscriptions) + R2 (gift fallback) reads
2. **Before** `deriveEntitlement(...)`
3. **Before** the `supabase.rpc("recompute_entitlement_tx", ...)` write

Since the RPC's atomic UPDATE rewrites the row's `is_premium`, R3 must read the existing value **before** that UPDATE — which is exactly where the diff places it. ✅

**Race-window note (correctly handled):** between R3 and the RPC, another writer could in principle update the same row. The PR body explicitly acknowledges "the race window is bounded by SELECT→RPC latency (acceptable for an observability beacon, not for correctness)." For an observability layer this is the correct tolerance — the worst case is one missed downgrade beacon or one false-positive on a concurrent-write race, neither of which is correctness-affecting. The RPC's own monotonic-on-`computed_at` guard (per #832) means correctness still holds.

`maybeSingle()` correctly handles the first-write case (returns `{data: null, error: null}` when no row exists) — the diff's `else if (r3.data)` guard yields `priorIsPremium = null` for that case, which the beacon code interprets as "no prior state ⇒ no beacon possible." ✅

---

## 4. Sentry mock in tests

The test file's import diff:

```ts
const captureEdgeErrorMock = vi.fn().mockResolvedValue(undefined);
const addEdgeBreadcrumbMock = vi.fn().mockResolvedValue(undefined);
vi.mock("../../sentry.ts", () => ({
  captureEdgeError: (...args: unknown[]) => captureEdgeErrorMock(...args),
  addEdgeBreadcrumb: (...args: unknown[]) => addEdgeBreadcrumbMock(...args),
}));
```

- Both `captureEdgeError` (pre-existing from #843) AND new `addEdgeBreadcrumb` are mocked via `vi.mock("../../sentry.ts", ...)`.
- `beforeEach` resets both mocks (`captureEdgeErrorMock.mockClear()` + `addEdgeBreadcrumbMock.mockClear()`).
- `console.info` is spied per-test with `vi.spyOn(console, "info").mockImplementation(() => {})` and restored via `mockRestore()` after each beacon test.

**No real Sentry SDK is loaded, no DSN read, no network call.** ✅ Pattern matches #843's existing test discipline (esm.sh-free, vitest-importable).

---

## 5. Five test cases cover all mandatory transitions

| # | Case | Expected | Asserts |
|---|---|---|---|
| 8a | active→inactive | beacon fires (breadcrumb + console.info) | `addEdgeBreadcrumbMock` called 1× with **exact** payload (`category: "billing.downgrade"`, `message: "entitlement downgraded: <userId> (<reason>)"`, `level: "warning"`, `data: {userId, appId, reason}`); `consoleInfoSpy` called 1× with `{scope: "recomputeEntitlement", level: "warning", event: "downgrade-beacon", userId, appId, reason}` |
| 8b | inactive→inactive | no beacon | both mocks not called |
| 8c | active→active (steady state) | no beacon | result `is_premium=true`; both mocks not called |
| 8d | no prior row (first write) | no beacon | `priorEntitlement` omitted → fake client returns `{data: null}` → `priorIsPremium = null` → beacon path skipped |
| 8e | R3 read error | warning captured, recompute proceeds, NO beacon | `captureEdgeErrorMock` called 1× with `tags.phase = "read-prior-entitlement"` + `tags.reason = "admin-manual-fix"`; `result` defined (no throw); `addEdgeBreadcrumbMock` not called |

All 4 mandated transitions covered. The bonus case 8e is the **right** addition — it locks the "observability is not correctness" contract (R3 fails → recompute still succeeds → no false-positive beacon). Without this test, a future maintainer could break the fail-soft contract and the suite wouldn't catch it.

**Test 8a's exact-payload assertion** is particularly strong: it locks the breadcrumb's `category`, `message` format string, and `level` against future refactors. A reviewer asked to verify "does the dispatch's literal spec match the implementation?" can read this test as the ground-truth contract.

---

## 6. `SupabaseClientLike` duplication check

The dispatch's key structural concern. Verified:

- **#843** declares `SupabaseClientLike` in `recompute.ts` (lines 107–112).
- **#864**'s `recompute.ts` diff does **not** redeclare it (the import line at the top is unchanged on the SupabaseClientLike side; only `addEdgeBreadcrumb` is added to the sentry import).
- **#864**'s `recompute.test.ts` imports `SupabaseClientLike` from `../recompute` (unchanged from #843).

Post-#843-squash rebase: `recompute.ts` lands on main with #843's `SupabaseClientLike` declaration. #864 then rebases onto that main, and its delta is purely the R3 block + beacon block + the import-line expansion (`captureEdgeError` → `addEdgeBreadcrumb, captureEdgeError`). The `SupabaseClientLike` declaration stays exactly where #843 put it.

**No duplication, no typecheck conflict.** ✅

(Defensive cross-check: `git diff pr-843..pr-864 -- supabase/functions/_shared/entitlement/recompute.ts | grep "SupabaseClientLike"` returns zero hits in the diff. The type is untouched between the two PRs.)

---

## 7. `sentry.ts` changes — surface review

`addEdgeBreadcrumb` is a new export. Two changes to existing types:

1. `SentryShape` (internal) gets a new `addBreadcrumb` field (5 enum levels: fatal/error/warning/info/debug). Matches Sentry's SDK shape for `Sentry.addBreadcrumb()`.
2. New `BreadcrumbOptions` interface (public-facing). Required: `category`, `message`. Optional: `level`, `data`. Sensible defaults (level → `'info'`).

**Fail-soft on Sentry error:** the helper wraps `sdk.addBreadcrumb(...)` in try/catch and logs `console.warn('[sentry-edge] breadcrumb failed', err)` on failure. So even if Sentry is fully down (DSN unset → `ensureInit()` returns null → early `return`; OR `sdk.addBreadcrumb` throws → swallowed), the helper itself never throws. The standalone `console.info` JSON log in `recompute.ts` provides observability that survives Sentry being down — exactly what A18 §7 row 6 mandates ("MUST log to console.info even when Sentry breadcrumb fails").

No regression risk on existing `captureEdgeError` callers — `SentryShape.addBreadcrumb` is purely additive.

---

## 8. Minor non-blocking observations

a. **`level: "warning"` is the right call.** A downgrade is a routine, reversible event in a paid product (cancel, trial expiry, gift expiry, refund). It's worth Sentry attention but it's not an `error` (no bug). Matches A18 §7 row 6's "warning" level.

b. **The breadcrumb's `message` interpolates `userId` literally.** Sentry breadcrumb messages are searchable; embedding the user ID lets ops grep for a specific downgrade by user. (`category: "billing.downgrade"` provides the dashboard facet.) The breadcrumb's `data` object also separately carries `userId` for programmatic access. Reasonable.

c. **`console.info` JSON-encodes the payload via `JSON.stringify`.** Edge function logs land in Supabase's structured logger, which can ingest the JSON. Future ops dashboards / log-pipeline queries can grep on `event:"downgrade-beacon"`. Sound choice.

d. **R3 doesn't filter by `provider` or `source` like R1 does.** That's correct — the prior `is_premium` is a derived boolean, agnostic to source. We only need to know "was the user premium yesterday?" to detect a flip.

e. **Beacon error swallow in `addEdgeBreadcrumb`** (`catch (err) { console.warn(...) }`) means the structured `console.info` log **still fires** even if Sentry fails. Verified by reading the order: in `recompute.ts:316–325` the `await addEdgeBreadcrumb(...)` resolves regardless (no throw), then `console.info(JSON.stringify({...}))` fires unconditionally. Belt-and-braces observability — exactly what the brief mandates.

---

## Final verdict

**APPROVE.**

| Dispatch check | Result |
|---|---|
| 1. Diff read | ✅ True additive delta over #843 is +253/−1 across 3 files |
| 2. Additive-only — zero new call sites | ✅ `addEdgeBreadcrumb` invoked only inside `recomputeEntitlement` (which itself has zero external call sites per #843/A6h) |
| 3. Prior-state SELECT BEFORE the RPC | ✅ R3 block sits between gift fallback and `deriveEntitlement`, both of which precede the RPC write; `maybeSingle()` correctly handles first-write case |
| 4. Sentry mocked in tests | ✅ `vi.mock("../../sentry.ts", ...)` covers both `captureEdgeError` (existing) and `addEdgeBreadcrumb` (new); `console.info` spied per-test |
| 5. 5 test cases cover all mandatory transitions | ✅ Cases 8a/8b/8c/8d cover the 4 mandated; 8e (R3 error) is the right bonus — locks the "observability is not correctness" contract |
| 6. No `SupabaseClientLike` duplication | ✅ Type unchanged between #843 and #864; imported (not redeclared) by tests |
| 7. `sentry.ts` surface review | ✅ Additive — new export + extended `SentryShape`; fail-soft on Sentry-down |

### Sequencing note for the dispatcher

If #843 squash-merges first, #864 needs a rebase onto the new main. The author should verify post-rebase that the diff cleans to +253/−1 across the same 3 files. The squash-orphan risk is acknowledged in the PR body and aligns with the memory rule.

If both PRs land via merge-commit instead of squash (preserving each commit), no rebase is needed. Either way is safe per the additive-only structure.

### Cross-references

- PR #864 (this review's target) — `feat/a18-recompute-downgrade-beacon`
- PR #843 — `feat/a18-recompute-entitlement-writer` (PR1; #864's true base)
- PR #789 — `entitlements` table (Chau-apply via SQL Editor; gates runtime)
- PR #832 — `recompute_entitlement_tx` RPC (Chau-apply via SQL Editor; gates runtime)
- A18 §7 row 6 — the mandate this PR implements
- A18 §8 case 7 — the test-coverage requirement this PR satisfies
- A6h review of #843 — `reports/REVIEW-pr-843-A6h.md` (PR #855; structural angle on PR1)
- A8i review of #843 (billing-logic angle, peer to A6h)
- A8j review of #864 (billing-logic angle, peer to this report)
