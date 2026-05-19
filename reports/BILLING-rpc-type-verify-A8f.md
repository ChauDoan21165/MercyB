# RPC ↔ TS Type Alignment — `recompute_entitlement_tx` vs `_shared/entitlement.ts` (A8f)

**Agent:** A8f (read-only type-alignment verify) · **Branch:** `docs/rpc-type-verify-a8f`
**Subjects:**
- RPC: `supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql` on `origin/feat/recompute-entitlement-tx-rpc` (PR #832) @ `eeaa4a08e`
- TS: `supabase/functions/_shared/entitlement.ts` on `origin/main` (via PR #802 @ `cff975a54`)
- Table: `supabase/migrations/20260519230000_create_entitlements_table.sql` on `origin/feat/entitlements-table-migration` (PR #789) @ `49d6f866e`

**Labels:** money-path, type-alignment, pre-wire
**Overall verdict:** **SAFE-TO-WIRE** — A18 PR1 can call this RPC directly from a Deno edge function. All 6 input args are type-aligned with the JS-side derived snapshot + caller context. Two procedural follow-ups (§5) are required at apply time, not type-alignment defects.

---

## 0. A correction up front

The dispatch's per-arg mapping framed each RPC arg as a counterpart of a field on `EntitlementInput`. That framing is **incorrect** and would cause confusion at A18 PR1 wiring time:

`EntitlementInput` (`_shared/entitlement.ts:56–72`) is the **per-row INPUT to `deriveEntitlement()`** — a defensively loose-typed shape that structurally accepts both a raw `subscriptions` row and a `profiles.premium_*` projection row. It has *no* `user_id`, *no* `app_id`, *no* `computed_at` field; its `status`/`source`/expiry slots are all `unknown` for safe parsing of unknown shapes. It is the type of one element of the array `deriveEntitlement(rows: readonly EntitlementInput[], now): EntitlementSnapshot` consumes.

The RPC's input args are the **derived snapshot** (output of `deriveEntitlement()`) + **caller-context identifiers** (which the JS `recomputeEntitlement(userId, appId, opts)` function knows from its parameters, not from `EntitlementInput`).

Correct mapping below.

---

## 1. RPC signature recap

```sql
public.recompute_entitlement_tx(
  p_user_id      uuid,
  p_app_id       text,
  p_status       text,
  p_source       text,
  p_expires_at   timestamptz,
  p_computed_at  timestamptz
) returns public.entitlements
language plpgsql
security definer
set search_path = public, pg_temp
```

`GRANT EXECUTE` to `service_role` only; `REVOKE` from `public` / `anon` / `authenticated`.

---

## 2. TypeScript counterparts in `_shared/entitlement.ts` (canonical PR #802 exports)

```ts
export type EntitlementStatus =
  | "active" | "trialing" | "grace_period" | "past_due"
  | "paused" | "expired"  | "revoked"      | "inactive";

export type EntitlementSource =
  | "stripe" | "apple" | "google" | "gift_code" | null;

export type EntitlementSnapshot = {
  is_premium: boolean;
  status:     EntitlementStatus;
  source:     EntitlementSource;
  expires_at: string | null;
};

// (EntitlementInput is the INPUT to deriveEntitlement, NOT the RPC.
//  Listed here only to rule out the dispatch's framing — see §0.)
export type EntitlementInput = {
  status?: unknown; subscription_status?: unknown; state?: unknown;
  expires_at?: unknown; current_period_end?: unknown; period_end?: unknown;
  ends_at?: unknown; expired_at?: unknown;
  updated_at?: unknown; created_at?: unknown;
  source?: unknown; provider?: unknown; platform?: unknown; store?: unknown;
  id?: unknown;
};
```

---

## 3. Per-arg verdict — RPC inputs

| RPC arg | Postgres type | TS counterpart | Source in JS caller | Verdict |
|---|---|---|---|---|
| `p_user_id` | `uuid` | `string` | **caller context** — the `userId: string` parameter `recomputeEntitlement(userId, appId, opts)` receives. supabase-js sends JS strings to `uuid` columns; PostgreSQL parses them as UUIDs. | ✅ **MATCH** |
| `p_app_id` | `text` | `string` | **caller context** — `opts.appId ?? DEFAULT_APP_ID` (`"mercy_blade"`). | ✅ **MATCH** |
| `p_status` | `text` (with table CHECK in `{active, trialing, grace_period, past_due, paused, expired, revoked, inactive}`) | `EntitlementStatus` (literal union of exactly the same 8 strings) | `EntitlementSnapshot.status` returned by `deriveEntitlement(rows, now)` | ✅ **MATCH** — string-literal union is a *subset* of `text`; every JS-emitted value passes the SQL CHECK by construction. Verbatim taxonomy match between #789's CHECK list and `_shared/entitlement.ts:37–45`. |
| `p_source` | `text` (with table CHECK: `null` OR in `{stripe, apple, google, gift_code}`) | `EntitlementSource = "stripe" \| "apple" \| "google" \| "gift_code" \| null` | `EntitlementSnapshot.source` returned by `deriveEntitlement(rows, now)` | ✅ **MATCH** — verbatim taxonomy match between #789's CHECK list and `_shared/entitlement.ts:47–52`. Null is preserved (`p_source` is `text` and is *not* NOT NULL → `null` is a legal value; the CHECK explicitly allows `source is null`). |
| `p_expires_at` | `timestamptz` | `string \| null` | `EntitlementSnapshot.expires_at` (`getExpiresAt()` returns an ISO 8601 string or null) | ✅ **MATCH** — PostgreSQL accepts ISO 8601 strings for `timestamptz`; supabase-js sends JS strings directly. `null` becomes SQL `NULL` (column is nullable on #789). |
| `p_computed_at` | `timestamptz` | `string` | **caller context** — `opts.now.toISOString()` (A18 brief §3 / §5 captures `now` once at function entry as `opts.now ?? new Date()`, then serializes for the RPC). | ✅ **MATCH** — same ISO-string-to-timestamptz round-trip as `p_expires_at`. |

**Net inputs verdict:** 6 / 6 MATCH. No TYPE-MISMATCH, no MISSING-IN-TS, no EXTRA-IN-SQL.

---

## 4. Per-column verdict — RPC return (`returns public.entitlements`)

A18 PR1's `recomputeEntitlement(...): Promise<EntitlementRow>` will return the row supabase-js deserializes from this RPC. **There is currently no `EntitlementRow` export in `_shared/entitlement.ts`** — the brief plans for A18 PR1 to declare it locally in `recompute.ts` (a persisted-row superset of `EntitlementSnapshot`).

Recommended local type (A18 PR1 to declare in `recompute.ts`, per brief §3 lines 80–100 contract):

```ts
export type EntitlementRow = EntitlementSnapshot & {
  user_id:     string;     // uuid
  app_id:      string;
  computed_at: string;     // ISO timestamptz
  updated_at:  string;     // ISO timestamptz
};
```

Column-by-column verdict:

| Returned column | Postgres type | Recommended local TS field | Verdict |
|---|---|---|---|
| `user_id` | `uuid` | `string` | ✅ **MATCH** |
| `app_id` | `text` | `string` | ✅ **MATCH** |
| `status` | `text` (CHECK in 8 values) | `EntitlementStatus` | ✅ **MATCH** (taxonomy verbatim) |
| `source` | `text` NULL (CHECK in 4 values + null) | `EntitlementSource` (includes `null`) | ✅ **MATCH** |
| `expires_at` | `timestamptz` NULL | `string \| null` | ✅ **MATCH** |
| `is_premium` | `boolean` (GENERATED ALWAYS STORED from status) | `boolean` | ✅ **MATCH**. *Note:* the table column and `EntitlementSnapshot.is_premium` are computed from the **same** entitling-status set: SQL `status IN ('active','trialing','grace_period','past_due')` vs TS `ENTITLING_STATUSES = new Set([...same four...])` (`entitlement.ts:81–86`). Structural consistency by construction. |
| `computed_at` | `timestamptz` | `string` | ✅ **MATCH** |
| `updated_at` | `timestamptz` | `string` | ✅ **MATCH** |

**Net return verdict:** 8 / 8 MATCH. The `EntitlementRow` type A18 PR1 will declare locally is a clean extension of the existing `EntitlementSnapshot` — no surface contradicts.

---

## 5. Procedural follow-ups (not type-alignment defects)

These are normal-workflow items, raised so they don't surprise A18 PR1's dispatch — none of them block the SAFE-TO-WIRE verdict.

1. **Regenerate `database.types.ts` after migration apply.** Grep against `supabase/functions/_shared/database.types.ts` on `origin/main` finds:
   - Zero references to `recompute_entitlement_tx`.
   - Zero references to the new `entitlements` table (only `my_entitlements` / `user_entitlements` / `set_user_entitlements`, which are legacy / different).
   Predictable — #789 and #832 are not yet applied to prod. After Chau applies both, run `supabase gen types typescript --linked > supabase/functions/_shared/database.types.ts` so the generated `Database['public']['Functions']['recompute_entitlement_tx']` interface lands. Until then, A18 PR1's TypeScript call site will either need explicit return-type assertions or an interim `as any` (less defensible). **Recommended:** the regen is part of the same Chau session as the SQL Editor paste.
2. **A18 PR1 declares `EntitlementRow` locally.** Per brief §3 and the §4 table above. Not a defect — the brief always intended this; this verify just confirms the shape.
3. **`EntitlementSource` and the `null` literal.** The TS union explicitly includes `null` (line 52). When A18 PR1 calls the RPC, passing `null` for `p_source` is legal both at the supabase-js layer (JS `null` → JSON null → PostgreSQL `NULL`) and at the SQL CHECK level (`source is null or source in (...)`). No coercion gotcha.
4. **Date serialization discipline.** A18 brief §3 / §5 captures `now` exactly once at function entry. The RPC's `p_computed_at` is the ISO-serialized form of that frozen `now`. Tests covering the monotonic guard (brief §8 case 3) should assert that calling the RPC twice with the same frozen `now` is a no-op on entitlements — the verify cited in the RPC's commented §(d) smoke block (`BEGIN; SELECT recompute_entitlement_tx(... now()); ROLLBACK;`) demonstrates the same idempotency property at the SQL layer.

---

## 6. Summary verdict

**SAFE-TO-WIRE.** All 6 RPC input args and all 8 returned columns are type-aligned with `_shared/entitlement.ts` (PR #802) and with the entitlements table CHECK constraints (PR #789). A18 PR1 can call this RPC directly:

```ts
// Inside supabase/functions/_shared/entitlement/recompute.ts (A18 PR1)
const derived: EntitlementSnapshot = deriveEntitlement(rows, now);

const { data, error } = await supabase.rpc('recompute_entitlement_tx', {
  p_user_id:     userId,                   // caller context
  p_app_id:      opts.appId ?? DEFAULT_APP_ID, // caller context
  p_status:      derived.status,           // EntitlementSnapshot.status
  p_source:      derived.source,           // EntitlementSnapshot.source (incl. null)
  p_expires_at:  derived.expires_at,       // EntitlementSnapshot.expires_at (incl. null)
  p_computed_at: now.toISOString(),        // frozen-now from opts.now
});

if (error) {
  await captureEdgeError(error, { /* … brief §7 row 4 / 5 … */ });
  throw error;
}

const row: EntitlementRow = data as EntitlementRow;  // until gen-types regen
return row;
```

(That snippet is illustrative for the verify, not part of this PR's deliverable; the actual writer is A18 PR1's job.)

---

## 7. Sources

- RPC SQL: `git show origin/feat/recompute-entitlement-tx-rpc:supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql` (PR #832).
- TS exports: `supabase/functions/_shared/entitlement.ts` lines 37–86 on `origin/main` (PR #802 / `cff975a54`).
- Table CHECK constraints: `git show origin/feat/entitlements-table-migration:supabase/migrations/20260519230000_create_entitlements_table.sql` (PR #789).
- A18 brief contract: `reports/RECON-recompute-entitlement-impl-brief-A18.md` §3, §5, §6 on `origin/a18/recompute-impl-brief` @ `c56663e7d`.

---

## Status

- **No code touched.** No `_shared/entitlement.ts`, no migration files, no `src/`.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR.

*A8f — read-only type alignment verify. SAFE-TO-WIRE; gen-types regen + `EntitlementRow` local type are normal-workflow follow-ups, not defects.*
