# PR #843 Review — Billing-Logic Angle (A8i)

**Agent:** A8i (billing-logic review; **A6h owns structural/additive angle in parallel — no file overlap**)
**Branch:** `review/843-a18-pr1-a8`
**Subject:** PR #843 `feat/a18-recompute-entitlement-writer` @ `f01abbbe8` — `feat(billing): A18 PR1 — recomputeEntitlement single writer (additive, zero call sites)`
**Files reviewed:**
- `supabase/functions/_shared/entitlement/recompute.ts` (290 lines, added)
- `supabase/functions/_shared/entitlement/__tests__/recompute.test.ts` (580 lines, added)

**Labels:** money-path, review, billing-logic

---

## Verdict — APPROVE (with one mandated-but-deferred follow-up flagged)

**6 of the 6 brief-§6 billing-logic invariants pass.** All RPC arg names, all derive contracts, all monotonic-guard handling, all single-derive ownership, all fail-loud routing, and the zero-call-sites property check out against `feat/recompute-entitlement-tx-rpc` (PR #832), `_shared/entitlement.ts` (PR #802), and the dispatch's additive-only narrowing.

**One observability omission** — A18 brief §7's "downgrade beacon" (`tags.phase = "downgrade-beacon"`) is not implemented. Severity = observability, not correctness; **PR1 has zero callers so the beacon could not fire in production anyway**; properly implementing it needs a minor design decision the brief didn't pin (how the writer learns the prior `is_premium` to detect a flip). I do **not** consider this a merge blocker for PR1 — it should ride a small follow-up PR before PR2 wires the first live caller (stripe-webhook). Details in §7.

---

## 1. Check — RPC called with the correct 6-arg signature ✅ MATCH

Lines 244-251:

```ts
const rpc = await supabase.rpc("recompute_entitlement_tx", {
  p_user_id: userId,
  p_app_id: appId,
  p_status: derived.status,
  p_source: derived.source,
  p_expires_at: derived.expires_at,
  p_computed_at: nowIso,
});
```

Cross-checked against #832's published signature (`supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql`):

| RPC arg (SQL) | Call site (TS) | Match |
|---|---|---|
| `p_user_id uuid` | `p_user_id: userId` | ✅ |
| `p_app_id text` | `p_app_id: appId` | ✅ |
| `p_status text` (CHECK in 8 values) | `p_status: derived.status` (TS literal union, 8 values, verbatim) | ✅ |
| `p_source text` NULL (CHECK in 4 values + null) | `p_source: derived.source` (TS `EntitlementSource = 4 strings \| null`) | ✅ |
| `p_expires_at timestamptz` | `p_expires_at: derived.expires_at` (`string \| null`) | ✅ |
| `p_computed_at timestamptz` | `p_computed_at: nowIso` (ISO 8601 string) | ✅ |

This is identical to the wiring snippet A8f (PR #836) §6 published as the reference shape. No `as any` cast slipped in — the writer uses the local `EntitlementRow` declared at lines 94-99, matching A8f §4's recommendation.

---

## 2. Check — Derive sources are correct (NOT profiles.tier) ✅ CLEAN

The writer reads only:

- **R1** (`subscriptions`, lines 138-156): `select status, current_period_end, provider, id where user_id = $userId AND app_id = $appId`. Matches A18 brief §4 R1 verbatim; the optional `id` column is harmless (used by `EntitlementInput.id` for downstream debug logging; not the sort key).
- **R2** (`user_subscriptions` gift fallback, lines 176-184): `select id, status, is_gift_redemption, current_period_end, source where status='active' AND is_gift_redemption=true AND current_period_end > nowIso`. Matches A18 brief §4 R2 / `me-entitlement/index.ts:42-63` `fetchActiveGiftSubscription`.

**Critical:** the writer does **NOT** read `profiles` anywhere. `profiles.tier` and `profiles.premium_*` are never sources of derivation — they are sinks for the RPC's projection step. This is the entire B17 / #774 thesis: gates read entitlement, not stale profile tier. PR1 honors it.

Both reads use `.eq("app_id", appId)` / `.eq("user_id", userId)` chains — no row-scope escape. (Structural / RLS angle = A6h's territory; flagging here only to confirm billing-logic correctness.)

---

## 3. Check — `computed_at` is `opts.now ?? new Date()`, frozen once ✅ CORRECT

Line 134: `const now = opts.now ?? new Date();`
Line 174: `const nowIso = now.toISOString();`

That same `nowIso` is used at:
- Line 182: the R2 `gt("current_period_end", nowIso)` filter (gifts expired before "now" are filtered at the DB layer too — defense-in-depth with derive's expiry rule)
- Line 250: the RPC's `p_computed_at` parameter

**Idempotency property:** two consecutive calls with the same `opts.now` produce identical `nowIso`, identical R2 filter cutoffs, identical derive inputs, identical RPC args, and therefore (via #832's monotonic guard `WHERE excluded.computed_at >= entitlements.computed_at`) a no-op SQL UPDATE that returns the same row.

Test case 1 (`recomputeEntitlement — idempotency`, line 192-223) asserts this.

---

## 4. Check — Monotonic guard handling ✅ CORRECT (with subtlety in the null-data branch)

A18 brief §6 and #832 §2 specify: when a stale recompute loses the monotonic race, #832's RPC re-reads the existing entitlements row and projects from that authoritative version. The RPC therefore **always returns the persisted row** unless a concurrent profile delete CASCADEd the entitlement between the conflict-check and the re-read (which is the §832 §(2.cascade) race).

PR #843 implements this correctly:

- Lines 253-261: on `rpc.error`, capture + throw. This covers RPC-level failures (CHECK violation, FK violation from cascade-delete pre-INSERT, etc).
- Lines 263-278: on `rpc.data === null || undefined`, the writer **fails loud** with `"RPC returned null — entitlements row absent post-upsert"`. This is exactly the cascade-race scenario #832 documented; throwing is correct (B68 §7 "never swallow"). Tests case 7 (lines 499-528) cover both `null` and `undefined`.
- Lines 280-282: on `rpc.data === row`, returns it without further logic. **The writer accepts the converged truth** — i.e., if the RPC returned a *fresher* row than what we computed, we take it. This is the "natural convergence is the self-heal" pattern A18 §6 mandates.

Test case 3 (`recomputeEntitlement — monotonic guard`, line 263-300) directly asserts the stale-rejected path: writer accepts the fresher row as truth. ✅

**No JS-side retry loop.** Per the writer's own header comment (lines 46-51): the monotonic-on-computed_at WHERE clause lives in the RPC, and the lost-race path becomes a no-op + converged read. The decision to skip the #766 `casRetry` import is correct given this architecture and is cited in the file header — matches my A8c §6 D-G3 "preferred path" verdict.

---

## 5. Check — No two-derivation bug (B13 class) ✅ SINGLE OWNER PRESERVED

The writer makes **exactly one** call to `deriveEntitlement`:

- Line 237-240:
  ```ts
  const derived: EntitlementSnapshot = deriveEntitlement(
    [...subscriptionRows, ...r2GiftRows],
    now,
  );
  ```

`deriveEntitlement` is imported from `../entitlement.ts` (B13 ph3 / PR #802), not re-defined or re-imported anywhere else in the writer or in #832's SQL. The RPC body (verified in A8e + A8f) is also derive-free — it takes the *output* of `deriveEntitlement` as input parameters and performs only the atomic two-table write.

**Net:** the entire money path has exactly one `deriveEntitlement` owner. B13's two-derivation bug class is structurally extinguished for this writer.

The contradiction A18 §2 originally flagged ("B68 §1 colocated derive inside `recompute.ts`") is resolved per the writer's own header lines 36-39 ("Resolved per O1 — imported"). Correct call.

---

## 6. Check — Zero call sites in this PR ✅ CONFIRMED

`git grep` against `origin/feat/a18-recompute-entitlement-writer` for any importer of the new module **outside its own test file**:

```bash
git grep -n 'recomputeEntitlement\|from.*entitlement/recompute' \
  origin/feat/a18-recompute-entitlement-writer \
  -- 'src/' 'supabase/functions/' \
  | grep -v '_shared/entitlement/recompute\|__tests__'
# → (no output)
```

Only the file itself + its test suite mention `recomputeEntitlement`. No `import` of the new function from anywhere in `src/` or any other `supabase/functions/*` module. The PR is **strictly additive at the call-site level**.

This honors the dispatch's narrowing of A18 brief §10's "rewire stripe-webhook in the same PR" — the rewire and the four code-deletable writers move to PR2 per the writer's own header lines 40-44.

---

## 7. Observation — Downgrade beacon NOT implemented (A18 §7, B13 §phase-3 defense 5)

A18 brief §7 mandates a sixth row in the failure matrix that is *not* a failure:

> | active→inactive transition (a downgrade) | `downgrade-beacon` | **NOT a failure** — emit the B13 downgrade beacon (Sentry breadcrumb + structured log, tags `reason`,`userId`) on every flip. Mandatory observability for a reversible rollout (B13 §phase-3 defense 5) |

Brief §8 also listed case 7 as `Downgrade beacon — prior is_premium=true → new false emits the beacon with reason, userId; no beacon on no-op.`

**The writer in #843 does not emit this beacon.** Lines 253-282 only emit `captureEdgeError` on error paths (read fail, RPC fail, RPC-null race). No success-path observability for the `is_premium: true → false` flip.

**Why this is an observation, not a blocker:**

1. **PR1 has zero callers.** The beacon could not fire in production from this PR alone — it only becomes operationally relevant the moment PR2 wires `stripe-webhook/finalizeSubscriptionProcessing` to call this writer.
2. **Implementing it requires a small design decision** the brief did not pin: the writer must learn the *prior* `is_premium` to detect a flip. Three options, none of which are obviously right:
   - **Option A** — Read the existing entitlements row before the RPC. Adds a third DB roundtrip on every recompute. Cleanest but most expensive.
   - **Option B** — Have the RPC `RETURNS public.entitlements` also return the *prior* row (e.g., `RETURNS TABLE(prior public.entitlements, new public.entitlements)`). Requires a #832 follow-up migration. Single-roundtrip but couples write and read.
   - **Option C** — Caller-supplied `opts.priorIsPremium?: boolean`. Cheapest but pushes responsibility to PR2-4 callers (who'd need to fetch it themselves). Splits the observability owner.
3. **Test case 7 in #843's suite covers RPC null-data race, not downgrade beacon.** So adding the beacon is also one new mandatory test case, not a refactor of existing ones. A small additive PR.

**My recommendation (billing-logic angle):** APPROVE #843 as-is; open a small follow-up PR titled something like `feat(billing): downgrade beacon on entitlement flip (A18 §7 row 6)` BEFORE PR2's stripe-webhook rewire so the beacon is operational the moment the first caller goes live. Pick Option A (read-before-RPC) — adding one short SELECT to the writer is the smallest safe diff and avoids coupling the RPC.

If Chau decides the beacon is in-scope for #843 and blocks merge until added, that's also defensible — the dispatch's "additive-only" narrowing was about call-sites/deletions, not about observability hooks. Either ruling is correct; I default to APPROVE because the rollout safety the beacon enables is bound to PR2, not PR1.

---

## 8. Minor observations (not blockers; not material to verdict)

- **Header comment quality (lines 1-52).** The file documents reads (R1/R2), derive ownership, write path, additive-only scope, hard gates (#789 + #832), and three explicit contradictions resolved with citations. This is the kind of source-level documentation that prevents future agents from re-litigating the design. No suggested change — flagging as a positive.
- **`SupabaseClientLike` structural type (lines 109-114).** The `// deno-lint-ignore no-explicit-any` is acceptable for a minimal-surface test seam; the alternative (importing `SupabaseClient<Database>` from `@supabase/supabase-js`) couples this module to esm.sh and breaks vitest direct-import (the writer's own header lines 102-108 cite this). Accept.
- **R2 gift filter overlap with derive's expiry rule.** The DB query at line 182 (`gt("current_period_end", nowIso)`) already excludes expired gifts; `deriveEntitlement` re-checks expiry in JS. Belt-and-suspenders, no harm, slight efficiency win (avoids materializing expired rows). Accept.
- **`r2.limit(1)` (line 184).** Only the latest-expiring gift is fetched. If a user has multiple stacked gift redemptions with different period-ends, only the newest is fed to derive. This matches `me-entitlement`'s pattern and the brief §4 R2 wording ("order by current_period_end desc limit 1"). Accept — but if D3 fold-in changes the gift surface to subscription rows, this `limit(1)` will become unnecessary and should be dropped to let `compareRows` pick the winner across all rows uniformly. Track as a D3 follow-up note (not for #843).
- **Line 229's `id: typeof giftRow.id === "string" ? giftRow.id : undefined`.** Defensive type guard for a `string | unknown` input shape. Accept.
- **No `result` cast variable inspection beyond `rpc.data as EntitlementRow`.** Once the types-regen runbook (A8g) is applied + #832 lands, this `as` is removable per A8f §5 follow-up. **Not a defect — already the documented intended landing shape and the documented removal path.**

---

## 9. Out of scope for this review (A6h territory)

These are structural / additive-correctness concerns my review intentionally did **not** evaluate, to avoid overlap with A6h:

- Whether the test file's mocks fully exercise the supabase-js `.from()....eq()` chain semantics correctly.
- Whether `supabase/functions/_shared/entitlement/recompute.ts`'s placement inside a new `entitlement/` subdir (sibling to `entitlement.ts`) is the right module layout per B68 §1.
- Whether the new test file follows the repo's vitest conventions / coverage thresholds.
- Whether the `// deno-lint-ignore` annotations comply with the edge-fn lint config.
- Whether the file's exports (re-export block lines 290) duplicate `_shared/entitlement.ts`'s exports in a way that confuses tree-shaking.
- TypeScript compilation under the edge tsconfig path.

Defer to A6h's report for these.

---

## 10. Cross-refs

- A8c (PR #815) — A18 readiness audit. `WAIT-FOR-X` resolved by #789 + #832 applied; this PR (#843) is the "X-then-A18" deliverable.
- A8d (PR #820) — #789 migration verify; relied upon as the table this writer UPSERTs into.
- A8e (PR #832) — RPC migration; this writer's sole RPC consumer.
- A8f (PR #836) — type-alignment verify; the wiring snippet here matches A8f §6 verbatim.
- A8g (PR #849) — types-regen runbook; the documented path to remove the `as EntitlementRow` cast.
- A8h (PR #854) — fixed `regenerate-db-types.sh`; the operational handle the cast-removal follow-up depends on.
- A18 brief — `reports/RECON-recompute-entitlement-impl-brief-A18.md` on `origin/a18/recompute-impl-brief` §3, §4, §6, §7, §8.
- #802 — `_shared/entitlement.ts` `deriveEntitlement`, `EntitlementInput`, `EntitlementSnapshot`.
- A6h — parallel review covering structural / additive angle (no file overlap).

---

## Status

- **No code touched.** No `recompute.ts` edited; no test file edited; no other source file edited.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR.

*A8i — billing-logic review only. **APPROVE** with one observability observation (downgrade beacon) deferred to a small follow-up PR before PR2's stripe-webhook rewire.*
