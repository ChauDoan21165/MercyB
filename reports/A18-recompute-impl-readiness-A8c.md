> ⚠️ **PARTIAL** — G2 RED→GREEN (#802 merged), G4 RED→GREEN (#774 merged), G1 still RED (#789 open). See A8d (#820), A8e (#832), A8f for current state. R1–R4 repointed by #826.
>
> **See also:** `reports/SQL-789-migration-verify-A8d.md` (PR #820) for the #789 migration verify-side companion.

# A18 Recompute Impl — Readiness Audit Post-2026-05-19 Wave (A8c)

**Agent:** A8c (brief-refresh only) · **Branch:** `docs/a18-recompute-impl-prep`
**Source brief:** `reports/RECON-recompute-entitlement-impl-brief-A18.md` on `origin/a18/recompute-impl-brief` @ `c56663e7d`
**Snapshot:** `origin/main` @ `cff975a54` (2026-05-19, post #774 + #787 + #802)
**Labels:** money-path, silent-failure, readiness-audit
**Verdict (one line):** **WAIT-FOR-X** — where X = `#789 merged AND A17 entitlements migration + recompute_entitlement_tx RPC applied to prod by Chau (D6)`. Authoring of `recompute.ts` + its unit suite is *technically* unblocked NOW; integration/backfill is hard-blocked by G1.

> **Purpose.** Re-validate every gate, file anchor, type name, dead-writer
> mechanism, and contradiction in A18's original brief against `origin/main`
> as it stands tonight (post #802 / #774 / #787). Future A18 dispatch reads
> this **alongside** the original brief; this file only enumerates deltas.
> The original brief stays canonical for unchanged sections.

---

## 1. Tonight's wave — what landed and what's still open

Direct cross-check, with merge-state queried via `gh pr view` against the
current main:

| PR | Title (abbrev) | State @ now | Brief impact |
|---|---|---|---|
| #774 | `B17 PR1` — premium gates read entitlement not `profiles.tier` | **MERGED** (in `origin/main`) | **G4 flips RED → GREEN.** Brief §1 G4 "soft, do not flip reads until green" is no longer a future condition. |
| #802 | `B13ph3 PR-A` — `_shared/entitlement.ts` additive | **MERGED** (in `origin/main`) | **G2 flips RED → GREEN.** The file now exists with `deriveEntitlement`, `isEntitled`, `normalizeStatus`, `normalizeSource`, `getExpiresAt`, `compareRows`, `statusRank`. Brief §1 G2 "NOT present" is stale. Type-name deltas — §3 below. |
| #787 | `B22 narrow` — redeem-gift-code honest errors | **MERGED** | **Partially supersedes brief §7/§9.** Gift-redemption write path no longer silent (`ok:true` on dropped row is closed). Recompute's gift-inconsistency *read-side* hygiene still novel; "B22 fix rides on PR3" softens to "B22 closed at the write side; recompute adds read-side surfacing." |
| #789 | A5 entitlements table (D1=table) | **OPEN** | **G1 still RED.** No `entitlements` table in `supabase/migrations/`; grep of `migrations/` finds only `entitlement_events` and the unified pre-existing `20260315211233_unified_entitlements_and_subscriptions.sql` (which is **not** the A5 schema). |
| #766 | A91 monotonic CAS retry + backoff/jitter | **OPEN** | **G3 still RED.** No reusable `casRetry` export; `MAX_MONOTONIC_RETRIES=8` inline loop still at `stripe-webhook/billing.ts:32` + `:629` exactly as the brief reported. Brief §6 decision D-G3 ("preferred: hard-gate; fallback: extract within A18 PR1") still binding. |
| #792 | A11 retire dormant T2 trigger + dead RPC | **OPEN** | **Direct overlap with brief §10 items #5 + #6.** Migration `20260519240000_retire_t2_trigger_and_dead_rpc.sql` is in this PR and is Chau-SQL-Editor-applied (D6). If #792 merges-and-is-applied before A18 PR1 ships, items #5 + #6 vanish from A18's handoff list — see §4 below. |
| #798 | A8 D4 bridge — price-map INSERT + raw_payload feasibility | **OPEN** (P0, sibling) | **No impact on A18.** Bridge is on `billing_price_map`, not `entitlements`. Listed only to rule out accidental coupling. |
| #804 | A8b D4 feasibility template + decision tree | **OPEN** (sibling) | **No impact on A18.** D4 is the `billing_price_map` retirement gate; orthogonal to entitlement persistence. |
| **PR-B (B13ph3)** | Repoint 4 expiry-blind readers at `_shared/entitlement.ts` | **NOT YET OPENED** (searched open PRs) | Sequencing call — see §5. **Not** a hard A18 blocker; the two workstreams share `deriveEntitlement` but read/write different surfaces. |

---

## 2. Gate-table refresh — A18 brief §1, line by line

Re-stating the brief's gate table with tonight's verdicts:

| Gate | Brief verdict (2026-05-19 morning) | A8c verdict (2026-05-19 evening) | Justification |
|---|---|---|---|
| G1 | **BLOCKER** — no entitlements table | **STILL BLOCKER** | #789 OPEN; `supabase/migrations/` grep returns no entitlements DDL. No unattended SQL path to this Supabase (D6 / memory: `db-schema-drift-audit`). |
| G2 | **BLOCKER** — `_shared/entitlement.ts` absent | **GREEN** | `supabase/functions/_shared/entitlement.ts` present @ `cff975a54` (PR #802 merged). Exports verified: `deriveEntitlement(rows, now): EntitlementSnapshot`, plus `isEntitled`/`normalizeStatus`/`normalizeSource`/`getExpiresAt`/`compareRows`/`statusRank`. **No `loadEntitlement` export** — brief §1 G2 mentioned it parenthetically; PR-A scoped that out per #802 body ("readers repointed in PR-B"). **Do not know yet** whether `loadEntitlement` ships in PR-B or stays caller-local. |
| G3 | conditional (D-G3 fallback) | **STILL conditional** | #766 OPEN. `MAX_MONOTONIC_RETRIES=8` inline at `billing.ts:32`+`:629` verbatim. Brief §6 D-G3 fallback (extract within A18 PR1) is unchanged. |
| G4 | soft — #774 OPEN | **GREEN** | #774 merged (`6b7d07490`). Profiles-tier reads are out of the gating path; brief's "do not flip reads until green" instruction is moot. |
| G5 | inherited via G2 | **inherited via G2 (now green)** | If G2 green, G5 is by construction (B13 ph3 is what gates G5). |
| G6 | strategic — D1=table | **CONFIRMED still** | #789 title literally reads "entitlements table per A5 spec (D1=table)". A5's strategic call has not been reversed. |

**Net:** gate dependency now collapses to **G1 + (G3 path picked)**. Everything else is green or behind G1. The original brief's "G1 ∧ G2 true; G3 resolved per §6; G6 still = materialised" start condition reduces to **"G1 true; G3 path picked"**.

---

## 3. Brief claims that need text rewrites — verified deltas against `_shared/entitlement.ts`

I read `supabase/functions/_shared/entitlement.ts` @ `cff975a54` end-to-end. The brief was written before #802 published the real types. The brief's *intent* is correct; the **type names and the gift-fallback input shape** must be updated when the implementing agent writes `recompute.ts`. This is the only material rewrite the brief needs.

| Brief location | Brief wording (paraphrased) | Reality on main | Status |
|---|---|---|---|
| §3 (signature) | `import { deriveEntitlement } from "../entitlement.ts"` returning `EntitlementInputRow[]`/`DerivedEntitlement` | Real exports: `deriveEntitlement(rows: readonly EntitlementInput[], now: Date \| number): EntitlementSnapshot`. Type names: **`EntitlementInput`** (not `EntitlementInputRow`), **`EntitlementSnapshot`** (not `DerivedEntitlement`). | **needs-rewrite** — type-name swap, no logic change. Rename in the new `recompute.ts` to match #802 exports. |
| §3 (`now` shape) | `now?: Date` injected to derive | Real signature accepts `Date \| number`. | **still valid** — passing `Date` is correct, the `number` overload is for callers that prefer ms. No code change needed; brief language stays. |
| §3 close ("deriveEntitlement's pure output adds only `is_premium`") | derive output is "+ is_premium" only | `EntitlementSnapshot = { is_premium, status, source, expires_at }` — all four. derive returns the full snapshot. | **needs-rewrite (cosmetic)** — derive returns the complete snapshot; the writer just *forwards* status/source/expires_at into the UPSERT and *ignores* the returned `is_premium` (table column is GENERATED). Brief §6 "Do NOT write `is_premium`" remains correct. |
| §4 R2 row-mapper | gift row → `EntitlementInputRow{ kind:"gift", period_end, source:"gift_code", status:"active" }` | `EntitlementInput` has **no `kind`** field. Its accepted shape is `{ status?, current_period_end?/period_end?/expires_at?, source?/provider?/platform?/store?, ... }`. | **needs-rewrite** — map gift fallback row to `{ status: "active", current_period_end: <iso>, source: "gift_code" }`. Same data, real type names. |
| §5 derive call | `deriveEntitlement(rows, now)` with rows = `[...r1Rows, ...r2GiftRows]` | Exactly matches real signature (after the §4 mapping rewrite). | **still valid** |
| §6 (RPC) | `recompute_entitlement_tx(...)` RPC mandated; "part of A17's Chau-applied SQL-Editor scope" | #789 title is **table only** ("entitlements table per A5 spec"). RPC is **not** confirmed in #789's scope from the title alone. | **do-not-know-yet** — see §7 honest-flag #1. The implementing agent must verify #789's body/file list before assuming the RPC ships with the table. If not, A18 PR1 must either (a) hard-block on a separate RPC migration or (b) accept brief §6's stated trap and still ship the writer with the RPC missing as a hard runtime fail (NOT fall back to two writes). |
| §7 captureEdgeError signature | `{ functionName, userId, extra, tags }` | Verbatim match in `_shared/sentry.ts:107` `CaptureOptions`. Brief §7 even pre-corrected B68's `{tags, extra}` shorthand. | **still valid** — no change. |
| §7 swallow location | "`billing.ts:587` `console.warn`" + "`billing.ts:583-589` try/catch in `finalizeSubscriptionProcessing`" | **Verified** — `await recomputeAndPersistEntitlement(params.supabase, params.userId)` is at line 585, the `console.warn("stripe-webhook entitlement recompute skipped", error)` at 587, enclosing try/catch in `finalizeSubscriptionProcessing` 583-589 unchanged. | **still valid** — line anchors hold post-#774/#787/#802. |
| §10 #1 (`src/billing/recomputeAndPersistEntitlement.ts`) | 0 prod importers | `grep -rn 'recomputeAndPersistEntitlement' src/ supabase/` → only own test imports it; `azure-phoneme/core.ts:157` and `_shared/premiumEntitlement.ts:7` are **comments**, not imports; `stripe-webhook/billing.ts:542/585` is the seed itself. | **still valid** — safe to DELETE in PR1 as planned. |
| §10 #5 (dead RPC `sync_profile_tier_from_latest_payment`) + §10 #6 (dormant trigger) | Chau SQL-Editor DROPs (D6), out of A18 PR scope | **#792 is OPEN** and contains a migration `20260519240000_retire_t2_trigger_and_dead_rpc.sql` that drops both (Chau-SQL-Editor-applied per its body). | **superseded** — if #792 merges + is applied before A18 PR1, items #5 + #6 are already gone; brief's "DROP handoff" language becomes "verify #792 applied; if not, hand off". See §4 below. |
| §9 PR3 (B22 fix "rides here") | redeem-gift-code's `ok:true` silent loss closed by recompute's gift-inconsistency surface | #787 already closed the `ok:true` silent loss at the **write side** (gift redemption fails loud now). | **partially superseded** — recompute's read-side gift-inconsistency surfacing is still novel and still belongs in PR3, but is now defense-in-depth, not the primary B22 fix. PR3's framing softens. |

**No other section needs rewriting.** §1 G1/G3 still binding, §2 file layout unchanged, §6 monotonic guard SQL unchanged, §8 test suite unchanged, §11 sequencing unchanged, §12 PR-size estimate unchanged.

---

## 4. Dead-writer list — refreshed table

| # | Dead writer | Brief mechanism | Post-tonight reality | Refreshed mechanism |
|---|---|---|---|---|
| 1 | `src/billing/recomputeAndPersistEntitlement.ts` | DELETE in PR1 | unchanged (0 importers, confirmed) | **DELETE in PR1** |
| 2 | `src/billing/recomputeAndPersistEntitlement.test.ts` | DELETE in PR1 | unchanged | **DELETE in PR1** |
| 3 | `stripe-webhook/billing.ts:542` seed fn | DELETE in PR1 | line anchor unchanged | **DELETE in PR1** |
| 4 | `stripe-webhook/billing.ts:583-589` swallow try/catch | DELETE in PR1 | line anchor unchanged | **DELETE in PR1** |
| 5 | `sync_profile_tier_from_latest_payment(uuid)` RPC | Chau SQL-Editor DROP (D6) | **#792 OPEN** contains the DROP | **Verify-before-handoff.** If #792 merged + applied → no-op for A18; if still open → original brief stands. |
| 6 | `trg_sync_profile_tier_from_payment` T2 trigger | OUT OF B68 SCOPE per A6 | **#792 OPEN** contains the DROP via A11's spec (separate workstream) | **No A18 action either way.** A11 owns it; A18 brief was correct to scope it out. |

**Implementing-agent instruction:** before writing the PR body, `gh pr view 792 --json mergedAt` + ask Chau "applied?" — if both true, the brief's "Chau SQL-Editor DROP block" handoff for #5 simply drops out of PR1's report-back.

---

## 5. Sequencing — A18 relative to PR-B and the post-merge backfill

The brief's §11 sequence stays:
```
G2 (B13 ph3 derive: DONE via #802)
   ──► A17 migration + RPC applied (G1, BLOCKER on #789 + Chau D6)
   ──► A18 PR1 (writer + tests + 4 deletions + stripe-webhook rewire)
   ──► one-time post-merge backfill (Chau, idempotent, A5 §8)
   ──► flip loadEntitlement reads to the table (additional gate: G4 — already GREEN via #774)
```

**Tonight's primer asked: does A18 dispatch *immediately after PR-B merges*, or wait for the one-time post-merge recompute to land first?**

The honest answer is **neither — A18 is not strictly downstream of PR-B**, and the post-merge recompute *follows* A18 PR1, not precedes it:

- **PR-B repoints readers** (R1–R4 in #802's body) at `_shared/entitlement.ts`. It is a **read-side** behavior fix (rule 3: strict expiry). It changes nothing about the *writer* surface A18 builds.
- **A18 writes** to a *new* persistence target (`entitlements` table). It depends on G2 (derive function = #802 ✓) and G1 (the table = #789 ✗), **not** on PR-B's readers.
- **The post-merge backfill** is A18 PR1's *follow-up* (A5 §8), not its precondition.

Therefore A18 PR1 can be dispatched the moment G1 turns green (A17 migration + RPC applied), independently of whether PR-B has merged. **Three sequencing scenarios** the implementing agent should be prepared for:

1. **G1 lands first, PR-B not yet open.** Dispatch A18 PR1 normally. Readers still point at their forked derives; that's fine — A18 only writes. The eventual PR-B repoint will land on top later.
2. **PR-B lands first, G1 still RED.** Do NOT dispatch A18 PR1 — no table to UPSERT into; only unit tests would land, which split the work pointlessly and would be reverted if the writer signature ever shifts (project memory: small safe diffs).
3. **G1 and PR-B both green.** Dispatch A18 PR1; the readers PR-B installed will pick up the persisted entitlements automatically on the next read after the post-merge backfill completes. This is the cleanest order.

The "one-time post-merge recompute" mentioned in the primer is the **A5 §8 backfill**, which is **after** A18 PR1 merges, not before. A18 dispatches **before** the backfill.

---

## 6. Refreshed implementation checklist — exact deliverable for the future A18 dispatch

A re-statement of the brief's §2/§3/§4/§7/§10 made executable against post-tonight main. The implementing agent should run this top-to-bottom.

### 6.1 Files

```
CREATE  supabase/functions/_shared/entitlement/recompute.ts
CREATE  supabase/functions/_shared/entitlement/__tests__/recompute.test.ts
EDIT    supabase/functions/stripe-webhook/billing.ts
          - delete lines 542-573 (private recomputeAndPersistEntitlement)
          - delete lines 583-589 try/catch+console.warn swallow inside
            finalizeSubscriptionProcessing
          - replace the inner call with:
              await recomputeEntitlement(
                params.supabase,
                params.userId,
                { reason: "stripe-webhook" }
              );
            (let it throw → webhook 5xx → Stripe retry)
          - delete the now-unused `deriveEntitlementFromSubscriptions`
            import on line 6 IFF no other call site in this file uses it
            (grep the file before deleting)
DELETE  src/billing/recomputeAndPersistEntitlement.ts
DELETE  src/billing/recomputeAndPersistEntitlement.test.ts
```

### 6.2 Imports (post-#802 reality)

```ts
import {
  deriveEntitlement,
  type EntitlementInput,
  type EntitlementSnapshot,
} from "../entitlement.ts";
import { captureEdgeError } from "../sentry.ts";
// CAS helper: §6.5 below
```

### 6.3 Reads — verified anchors hold

- **R1:** `subscriptions` for `status,current_period_end,provider` — same shape as `billing.ts:546-549` (verified at `cff975a54`).
- **R2:** `user_subscriptions` gift fallback — port from `me-entitlement/index.ts:42-63` (verified; `fetchActiveGiftSubscription` body unchanged from brief).
- Wrap R2 + mapper in `// --- gift fallback (delete on D3) ---` block (brief §4 unchanged).
- **Gift-row mapping (new wording):**
  ```ts
  const r2GiftRows: EntitlementInput[] = giftRow
    ? [{ status: "active",
         current_period_end: giftRow.current_period_end,
         source: "gift_code" }]
    : [];
  ```

### 6.4 Derive call

```ts
const now = opts.now ?? new Date();
const rows: EntitlementInput[] = [...r1Rows, ...r2GiftRows];
const derived: EntitlementSnapshot = deriveEntitlement(rows, now);
```

### 6.5 Write

- One `recompute_entitlement_tx` RPC call (atomic entitlements UPSERT + profiles projection).
- Brief §6 SQL block unchanged — do NOT write `is_premium` (GENERATED) or `updated_at` (trigger-owned). `computed_at` = `opts.now ISO`.
- **Monotonic guard:** `WHERE excluded.computed_at >= entitlements.computed_at`.
- **CAS path:** if #766 merged before this PR → import its `casRetry` from `_shared/` and call it; else extract `casRetry` from `stripe-webhook/billing.ts:629` inline loop *in this PR* and re-call the existing inline site through it (single owner). Cite which path was chosen in PR body.

### 6.6 Failure matrix

Use the verified `CaptureOptions` shape (`{functionName, userId, extra, tags}`) verbatim from `_shared/sentry.ts:107`. Six rows of brief §7 stand unchanged (R1/R2/gift-inconsistency/upsert/projection/downgrade-beacon). Delete the swallow at `billing.ts:587` and its enclosing try/catch at 583-589 (anchors verified).

### 6.7 Tests — seven mandatory case-groups (brief §8 unchanged)

1. Idempotency · 2. Injected clock · 3. Monotonic guard · 4. Convergence · 5. Failure paths fail loud · 6. Gift-inconsistency · 7. Downgrade beacon.

**Run gates in an isolated worktree** (memory: `worktree_gates_node_modules`, `stale_shared_node_modules_false_RED`):
`npm ci` in-worktree (not symlinked), then `npm run typecheck:ci` + `npm run lint` + `npx vitest run …recompute.test.ts`.

### 6.8 Rollback plan

A18 PR1 is **atomic** — one PR, one stripe-webhook rewire, four deletions, one new writer. Rollback = `git revert` the merge commit; this restores:
- the seed `recomputeAndPersistEntitlement` private fn in `billing.ts`,
- the `console.warn` swallow at line 587 (acceptable temporary regression — back to today's known silent-skip),
- the deleted `src/billing/recomputeAndPersistEntitlement.{ts,test.ts}`,
- and removes the new `recompute.ts` + tests.

**No DB rollback needed** — the writer's UPSERT is monotonic-keyed; rolling back the *code* simply stops new UPSERTs. The `entitlements` rows it wrote stay valid (they reflect a real point-in-time derive). If the GENERATED `is_premium` ever produces a wrong value because derive itself is wrong, that is a B13-ph3 bug to fix in `_shared/entitlement.ts`, not a revert target here.

If only the stripe-webhook rewire breaks (the riskiest hunk): a targeted revert of just that hunk (re-instating the `try/catch+console.warn`) is acceptable while keeping `recompute.ts` + its tests landed (they have zero importers without the rewire — same shape as #802's additive-only land).

---

## 7. Honest "do not know yet" flags (per PRINCIPLES §7)

The repo alone cannot answer these — they require Chau or an upstream dispatch:

1. **Does #789 include the `recompute_entitlement_tx` RPC, or is it table-only?** The PR title says "table per A5 spec." Brief §6 *mandates* the RPC for the atomic entitlements-+-profiles write. If #789 is table-only, the RPC needs a *separate* migration before A18 PR1 can dispatch (G1 grows to "G1a table + G1b RPC"). **Verification action:** read `#789` body or `gh pr view 789 --files`.
2. **What is the planned shape of PR-B?** #802's body says "PR-B will repoint the four expiry-blind readers." It does not state whether PR-B will *also* introduce a `loadEntitlement` export in `_shared/entitlement.ts` (brief §1 G2 mentioned it parenthetically) or whether each reader will define its own. This affects whether A18 PR1's writer should `import { loadEntitlement }` or write its own read helper. **Default assumption:** A18 PR1 does its own R1/R2 reads inline (brief §4) — `loadEntitlement` is *read-side* infrastructure; A18 is *write-side*. Independent.
3. **Is A17's migration timestamp band (`20260519230000` per #792's body) the agreed slot?** #792's body cites `feat/entitlements-table-migration`'s file as `20260519230000_create_entitlements_table.sql`. The A18 brief calls G1 "A17's migration"; if the actual migration file ships under a different timestamp/branch, the implementing agent should verify the file name before its post-merge backfill plan references it.
4. **Is the one-time backfill expected to be a Deno script, an Edge Function, or a Chau-pasted SQL block?** A5 §8 calls it `recomputeEntitlement` over all profiles. A18 brief §11 references it without committing to a runner. **Default assumption:** an admin-only edge function `admin-recompute-entitlement` covering one user at a time, with a small `for` loop over `profiles` invoked once by Chau. This stays inside D6 (Chau pasted, idempotent, monitored).
5. **Has anyone validated that `_shared/entitlement.ts`'s `deriveEntitlement` matches B68 §3's expiry table?** PR-A landed it as "additive, zero importers." Its expiry rule is explicitly stated in the file header. But B68 §3 had its own derive contract; A18's brief said "if B13 ph3's export does not match B68 §3, report it." **Parity has not been independently verified tonight.** The implementing agent should diff the two before importing — a mismatch is a B13-ph3 defect, not an A18 workaround target.

---

## 8. Verdict

**WAIT-FOR-X** — where X is the conjunction:
- **X.1** #789 merged AND A17 migration applied to prod by Chau (D6).
- **X.2** Verify #789 contains the `recompute_entitlement_tx` RPC; if not, a separate RPC migration applied before A18 PR1 is hard-blocking.
- **X.3** G3 path selected (#766 if merged, else extract within A18 PR1 — brief §6 D-G3 fallback is acceptable).

PR-B is **not** part of X. PR-B and A18 PR1 are parallel; either can land first. The post-merge backfill is **after** A18 PR1 ships, not before.

**Unit-test authoring is technically unblocked right now** (mock client, no real table needed) but should not ship as a standalone PR (memory: small safe diffs; landing tests without the writer they test creates a split-state nobody asked for).

---

## 9. Sources

- `reports/RECON-recompute-entitlement-impl-brief-A18.md` on `origin/a18/recompute-impl-brief` (the brief itself).
- `supabase/functions/_shared/entitlement.ts` on `origin/main` @ `cff975a54` (PR-A's additive landing — type names + exports verified).
- `supabase/functions/_shared/sentry.ts:107` `CaptureOptions` (signature verified).
- `supabase/functions/stripe-webhook/billing.ts` lines 32, 542-589, 629 (anchors verified).
- `supabase/functions/me-entitlement/index.ts:42-63` `fetchActiveGiftSubscription` (anchor verified).
- `gh pr view 766 / 789 / 787 / 792` for merge-state.
- `gh pr list --state open --limit 20` for PR-B / sibling check.

---

## Status

- **No code touched.** No `src/`, no `supabase/functions/`, no `_shared/entitlement.ts`, no `a18/*` branch.
- **No SQL executed.**
- **No prod data touched.**
- Pure documentation PR.

*A8c — brief-refresh-only. Original A18 brief on `origin/a18/recompute-impl-brief` remains canonical for unchanged sections.*
