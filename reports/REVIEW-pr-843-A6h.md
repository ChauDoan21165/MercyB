# Review — PR #843 `feat/a18-recompute-entitlement-writer` (A6h)

**Reviewer:** A6 (A6h)
**Worktree:** `/private/tmp/A6h-843-review` (off `origin/main` @ `83dc0ead7`)
**Source:** `git show pr-843:...` on both new files + cross-grep against `src/`, `supabase/`, `scripts/`
**Mode:** read-only

---

## Headline

**APPROVE.** This is the additive-only PR1 as designed: zero call sites in app code, signature matches A18 §3 verbatim, 21 unit tests cover all 7 A18 §8 mandatory invariants plus surface-sanity, explicit `as EntitlementRow` cast on the RPC return (per A8f §procedural #1, since `database.types.ts` is not yet regenerated), and the hard gate (#789 + #832 must be applied to prod before PR2) is documented correctly in the PR body.

PR2 (stripe-webhook rewire) is hard-gated on Chau applying #789 + #832 via SQL Editor — until then this module is dead code in the bundle with zero runtime impact.

---

## 1. Additive-only — verified zero call sites

Ran:

```bash
grep -rln "recomputeEntitlement\|recompute_entitlement\|recompute-entitlement" \
  src/ supabase/ scripts/ | grep -vE "recompute\.(ts|test\.ts)$"
```

Hits outside the new file + its test:

| File | Nature of hit |
|---|---|
| `supabase/migrations/20260519230000_create_entitlements_table.sql` | **Comments only** — references `recomputeEntitlement(userId)` as the future writer of this table (lines 5, 26, 52, 90, 125, 138, 164). No code dependency. |
| `supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql` | **Comments only** — refers to "the future server-side `recomputeEntitlement(userId)`" (line 4) as the intended caller. No code dependency. |

**Zero call sites** in `src/`, `supabase/functions/` (excluding the new file), `scripts/`, or anywhere else. The module is genuinely dead code in the bundle today — exactly the additive-only contract PR1 was scoped to. ✅

---

## 2. Function signature vs A18 §3 + A8f type alignment

### Signature (`recompute.ts:111–115`)

```ts
export async function recomputeEntitlement(
  supabase: SupabaseClientLike,
  userId: string,
  opts: RecomputeOptions,
): Promise<EntitlementRow>
```

### `RecomputeOptions` (`recompute.ts:71–84`)

```ts
interface RecomputeOptions {
  appId?: string;          // defaults to DEFAULT_APP_ID = "mercy_blade"
  now?: Date;              // captured ONCE at entry; tests/backfill pass fixed
  reason: RecomputeReason; // REQUIRED — Sentry tags + B13 downgrade-beacon
}
type RecomputeReason =
  | "stripe-webhook" | "revenuecat-webhook"
  | "redeem-gift-code" | "redeem-access-code"
  | "admin-manual-fix" | "backfill";
```

Matches A18 §3 / §6 exactly: `appId` default, frozen `now`, mandatory `reason` from the 6-value union.

### RPC call site (`recompute.ts:245–252`)

```ts
const rpc = await supabase.rpc("recompute_entitlement_tx", {
  p_user_id:     userId,
  p_app_id:      appId,
  p_status:      derived.status,
  p_source:      derived.source,
  p_expires_at:  derived.expires_at,
  p_computed_at: nowIso,
});
```

Cross-checked against #832's RPC definition (`supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql`):

```sql
create or replace function public.recompute_entitlement_tx(
  p_user_id      uuid,
  p_app_id       text,
  p_status       text,
  p_source       text,
  p_expires_at   timestamptz,
  p_computed_at  timestamptz
) returns public.entitlements
```

**All 6 input args aligned** — name, position, and (modulo Postgres-side widening) type. ✅

### Return shape — explicit cast since types.ts isn't regenerated

`recompute.ts:271`:

```ts
const row = rpc.data as EntitlementRow;
return row;
```

`EntitlementRow` is declared **locally** at `recompute.ts:97–102`:

```ts
export type EntitlementRow = EntitlementSnapshot & {
  user_id: string;
  app_id: string;
  computed_at: string;
  updated_at: string;
};
```

…with a comment block (`:91–96`) explicitly noting this follows A8f §4: "will fold into `supabase/functions/_shared/database.types.ts` after the migrations are applied and types are regenerated. Until then this is the authoritative shape this writer returns."

**A8f §procedural follow-up #1 satisfied** — explicit return-type cast is in place pending types regen. ✅

### `deriveEntitlement` is imported, not redefined

`recompute.ts:53–59`:

```ts
import {
  deriveEntitlement,
  type EntitlementInput,
  type EntitlementSnapshot,
  type EntitlementSource,
  type EntitlementStatus,
} from "../entitlement.ts";
```

Cross-checked: `supabase/functions/_shared/entitlement.ts:321` exports `deriveEntitlement`. The B68 §1 vs A18 §2 / B68 O1 contradiction is correctly resolved per O1 (single derive owner = B13 phase 3). ✅

---

## 3. Unit tests — coverage check

21 test cases (`grep -c '^  it(' recompute.test.ts` = 21), cleanly partitioned across the 7 A18 §8 mandatory invariants plus a "surface / wiring sanity" group:

| A18 §8 case | Test block | What it asserts | Pass |
|---|---|---|---|
| 1. Idempotency | "same rows + same opts.now ⇒ byte-identical EntitlementRow" | Three back-to-back calls return `toEqual`; each emits exactly **one** RPC call; the upsert payloads are byte-identical | ✅ |
| 2. Injected clock | 3 sub-tests | (a) frozen `opts.now` becomes `p_computed_at`; (b) omitting `opts.now` uses a fresh Date; (c) **single-frozen-now invariant** — same `nowIso` used for the gift `.gt()` filter AND the RPC `p_computed_at` | ✅ |
| 3. Monotonic guard | "RPC re-read on stale-rejected upsert" | Writer accepts the RPC's fresher row verbatim; **exactly 1 RPC call** (no JS retry loop) | ✅ |
| 4. Convergence | "two different reasons over same input + frozen now" | Same row returned regardless of `reason` tag value | ✅ |
| 5. Failure paths fail loud | 4 sub-tests | R1/R2/RPC errors each: capture with correct `tags.phase` + throw the original error; happy path emits **zero** captureEdgeError calls | ✅ |
| 6. Gift inconsistency | 4 sub-tests | `is_gift_redemption=false` filtered + warned, null `period_end` filtered + warned, valid gift wins with `source="gift_code"`, subscription beats bad gift while still capturing the bad row | ✅ |
| 7. RPC null-data race | 2 sub-tests | Both `data=null` and `data=undefined` throw with `tags.phase=upsert-entitlements` | ✅ |
| Surface sanity | 5 tests | RPC invoked by literal name `recompute_entitlement_tx` with the 6 documented args; `opts.appId` overrides default; empty/empty inputs ⇒ `status='inactive'`; subscriptions filter by user_id + app_id; gifts filter by user_id + status + is_gift_redemption + current_period_end>now | ✅ |

### Mock posture

- **`captureEdgeError`** mocked via `vi.mock("../../sentry.ts", ...)`. Test asserts (a) which phase was emitted, (b) call count = 0 on happy paths, (c) call count = 1 on failure paths. ✅
- **`supabase.rpc(...)`** mocked by an in-memory fake (`makeFakeClient`) that resolves to a pre-configured `{data, error}`. Default success path constructs the entitlement row from the input args, mirroring what the real RPC would return. ✅
- **No network**, **no Deno runtime**, **no actual Supabase**. The test file is vitest-importable directly — same discipline as `me-entitlement/entitlement.ts`. ✅

### Error paths are non-fatal where documented, fatal where documented

- **R1 (subscriptions read) error** → throw. *Fatal as documented* (Stripe webhook 5xx → provider retry — A18 §7).
- **R2 (gift read) error** → throw. *Fatal as documented* (no silent "no gifts" degradation — B22 silent-failure killer).
- **Gift inconsistency** → warn (`captureEdgeError`) + filter + **continue**. *Non-fatal as documented* (the rest of derive is still correct).
- **RPC error** → throw. *Fatal as documented* (no fallback two-call path; intended fail-loud signal).
- **RPC returned null** → throw. *Fatal as documented* (concurrent profile delete; no projection target).

All five paths are tested, and the dispatch's "RPC failure non-fatal?" question is **no, RPC failure is FATAL by design** — which is the correct contract per A18 §7 / B68 §7. The webhook 5xx → provider retry is the upstream's job, not the writer's.

---

## 4. Explicit return-type assertion (A8f §procedural #1)

Already covered in §2 above. To restate the verification:

| A8f §procedural #1 requirement | This PR |
|---|---|
| Local `EntitlementRow` declaration since `database.types.ts` not yet regenerated | ✅ `recompute.ts:97–102` |
| Explicit cast at the RPC return site | ✅ `recompute.ts:271` (`rpc.data as EntitlementRow`) |
| Doc-comment noting the types-regen follow-up | ✅ `recompute.ts:91–96` |

A8f §procedural #1 satisfied. The cast survives until Chau applies #789 + #832 and regenerates `database.types.ts`, at which point the local `EntitlementRow` folds into the generated `Database["public"]["Tables"]["entitlements"]["Row"]` and the cast becomes redundant.

---

## 5. Hard gate verification

PR body §"Hard gate — applies to PR2, not PR1" claims:

> PR1 ships without runtime-importing #789's table or #832's RPC. The RPC name is referenced only as a string literal inside `supabase.rpc()`. PR2 cannot land until both of these are applied to prod by Chau (Supabase SQL Editor, B48 D6 — there is no unattended SQL path to this Supabase).

Verified:

- `recompute.ts` imports **nothing** from `database.types.ts` (no `import type { Database } from "../database.types.ts"` line). The RPC reference is the literal string `"recompute_entitlement_tx"` at `recompute.ts:245`. No build-time dependency on the migrations being applied. ✅
- At runtime, calling `recomputeEntitlement()` against a prod where #832's RPC isn't applied → PostgREST returns `"function public.recompute_entitlement_tx does not exist"`, which (a) returns via `rpc.error`, (b) is captured with `tags.phase=upsert-entitlements`, (c) throws. **Intended fail-loud signal** per A18 §7.
- No fallback two-call write path (separate `entitlements` upsert + separate `profiles.premium_*` update) exists anywhere in the module. The whole module routes through `supabase.rpc("recompute_entitlement_tx", ...)`. B68 §7 row 5 ("two-edge-write drift class") is structurally precluded. ✅
- The PR body's table linking #789 + #832 with their "Chau-apply via SQL Editor" status matches the constraint from memory `project_agent_infra_access` ("no unattended SQL path to this Supabase; RLS migrations via SQL Editor not db push"). Correctly stated. ✅

The dispatch question "does the PR body correctly state the hard gate?" — **yes, exactly correctly**.

---

## 6. Non-blocking observations

These are quality notes, not change requests. None affect the APPROVE.

a. **`SupabaseClientLike` uses `any` for chain returns** (`recompute.ts:107–112`). Necessary for structural typing without pulling `@supabase/supabase-js` into the test build. Mitigated by: (a) production callers pass a real typed `SupabaseClient<Database>`; (b) the 21-test suite exercises every method on the chain; (c) the `// deno-lint-ignore no-explicit-any` is intentional and commented. Acceptable per the documented esm.sh-free / vitest-importable discipline.

b. **Doc-comments in `recompute.ts` are exceptionally thorough.** Future maintainers can understand the module without reading #843's PR body — the "Contradictions Resolved" block (lines 36–48) inline-cites B68 §1 vs A18 §2, A18 §10 vs current dispatch, and B68 §6 vs A18 §6 D-G3 with their resolutions. This is the right place for those notes; PR bodies rot, source comments don't.

c. **The "single frozen clock" invariant test** (case 2c, "uses the SAME nowIso for the gift `gt` filter and the RPC `p_computed_at`") is the kind of regression lock that catches a future maintainer who refactors and accidentally re-calls `new Date()` inside the gift-read block. That's the strongest test in the suite — explicit invariant on a non-obvious bug class.

d. **Test 6 sub-test 4** ("subscription row + bad gift row ⇒ subscription still wins, bad row captured") — good belt-and-braces. Confirms that the gift-inconsistency capture does NOT mask the (correct) subscription-wins outcome.

e. **No call-site change in `stripe-webhook/billing.ts:542`** — verified independently. The seed `recomputeAndPersistEntitlement` remains; its rewire is correctly deferred to PR2 per the narrowed dispatch.

---

## Final verdict

**APPROVE.**

| Dispatch check | Result |
|---|---|
| 1. Additive-only — zero call sites outside new file | ✅ Verified by grep; the two migration-file hits are comments documenting the future writer, not callers |
| 2. Signature matches A18 §3 + A8f type alignment | ✅ Inputs, RPC name + 6 args, return shape all match #832's RPC definition + A18 §3 contract |
| 3. Unit tests (RPC mocked, all input shapes, monotonic guard, error paths) | ✅ 21 cases covering all 7 A18 §8 mandatory invariants + 5 surface-sanity tests |
| 4. Explicit return-type assertion per A8f §procedural #1 | ✅ `as EntitlementRow` cast at line 271 + local declaration at lines 97–102 |
| 5. Captures via real `captureEdgeError` signature with correct phase tags | ✅ 5 phases (`read-subscriptions`, `read-gifts`, `gift-inconsistency`, `upsert-entitlements` × 2 causes); happy path emits 0 captures |
| 6. PR body states the hard gate correctly | ✅ #789 + #832 must be applied to prod via SQL Editor before PR2 lands; no fallback path; intended fail-loud signal |
| 7. Single-RPC atomic write (no two-edge-write drift class) | ✅ The whole module routes through one `supabase.rpc("recompute_entitlement_tx", ...)`; structurally precludes B68 §7 row 5 |

### Cross-references

- PR #843 (this review's target) — `feat/a18-recompute-entitlement-writer`
- PR #789 — `entitlements` table (Chau-apply via SQL Editor; gates PR2)
- PR #832 — `recompute_entitlement_tx` RPC (Chau-apply via SQL Editor; gates PR2)
- PR #802 (B13 ph3 read consolidation) — owner of the imported `deriveEntitlement`
- PR #826 (B13 ph3 write consolidation)
- A18 brief: `reports/RECON-recompute-entitlement-impl-brief-A18.md` on branch `origin/a18/recompute-impl-brief`
- A8f type alignment: `reports/BILLING-rpc-type-verify-A8f.md` on branch `origin/docs/rpc-type-verify-a8f`

### Suggested PR2 sequencing (informational — not part of this approval)

The PR2 work (`stripe-webhook/finalizeSubscriptionProcessing` rewire) is correctly gated on:
1. Chau applies #789 to prod via SQL Editor.
2. Chau applies #832 to prod via SQL Editor.
3. Chau regenerates `supabase/functions/_shared/database.types.ts` (`supabase gen types typescript --linked > ...`).
4. The local `EntitlementRow` in `recompute.ts:97–102` is then redundant and can be folded into the generated types in a small cleanup PR (or as part of PR2 itself).
5. **Only then** does PR2 land — its single tripwire is "can prod actually find the RPC?" and answers it positively before any caller switches over.

This sequencing is correctly described in #843's PR body and matches A18 §6.
