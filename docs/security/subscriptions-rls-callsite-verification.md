# `public.subscriptions` RLS Cal-site Verification — pre-merge check for !86

**Status:** read-only diagnostic. C-side does not fix call sites.

**Subject MR:** !86 (`a1/subscriptions-rls-select-policies`) —
ENABLE ROW LEVEL SECURITY on `public.subscriptions`, plus two SELECT
policies:

```sql
CREATE POLICY subscriptions_self_select
  ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY subscriptions_admin_select
  ON public.subscriptions FOR SELECT TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);
```

No GRANT/REVOKE changes. No INSERT/UPDATE/DELETE policies (writes were
always service-role-only; that stays the same).

**Method:** for each of the 20 call sites enumerated in the dispatch
brief, read the SQL (and the surrounding client setup) to determine the
auth context (service-role vs user-JWT), the row scope (`eq("user_id", x)`
vs all rows), and the resulting post-RLS behavior.

---

## ⚠️ STOP-AND-FLAG FINDING — Frontend / backend admin-gate mismatch

> **`AdminSubscriptions` and `CostMonitoring` admin dashboards read `public.subscriptions` with the browser singleton (user JWT) and depend on seeing ALL rows.**
>
> **`AdminRoute` (the frontend gate) admits any user with `admin_level > 0`** — `src/hooks/admin/useAdminAccess.ts:59`: `const isAdmin = safeLevel > 0;`.
>
> **!86's admin SELECT policy requires `admin_level >= 9`.**
>
> An admin with `admin_level` in `1..8`:
> - Passes the `AdminRoute` gate (they're "admin").
> - Lands on `/admin/subscriptions` or `/admin/cost-monitoring`.
> - The page issues a `SELECT … FROM subscriptions` with their JWT.
> - Only the **own-row** policy matches (admin policy needs ≥ 9).
> - Result: page renders with **only their own subscription row** (typically zero rows for ops admins).
>
> **This is not a security regression** — !86 is doing its job of locking the table down. It IS a **silent functional regression** for admins below level 9: the dashboard renders with broken/empty data instead of erroring loudly.
>
> **Real-world impact depends on whether any admin in production has `admin_level` in `1..8`.**
> The auto-admin migration `supabase/migrations/20251020153130…` only auto-promotes `cd12536@gmail.com`; if Chau is the sole admin and is at level 9 or 10, the practical impact is zero. If any operator / contractor / dev account is at 1–8, those users will see broken admin dashboards starting the moment !86 is applied.
>
> **A-side decision needed before merging !86:**
> 1. **Verify admin-level distribution in prod** with a one-line query
>    (Chau or A-side runs it):
>    ```sql
>    SELECT level, COUNT(*)
>      FROM public.admin_users
>     GROUP BY level
>     ORDER BY level;
>    ```
>    If only level-10 admins exist, !86 is safe to merge as-is.
> 2. **If any 1–8 admin exists**, choose one of:
>    - Promote them to level 9+ (smallest change, preserves !86 unchanged).
>    - Loosen the admin policy in !86 to `>= 1` (broader admin read, less defense-in-depth).
>    - Tighten the frontend gate in a follow-up MR so non-9 admins never reach the broken page (smallest blast radius for admin dashboards; preserves !86 strictness).

---

## Per-call-site table

Legend:
- **Client:** `service-role` (Deno edge fn with `SUPABASE_SERVICE_ROLE_KEY`) | `user-JWT-edge` (Deno edge fn with anon key + caller's `Authorization` header) | `user-JWT-browser` (the browser `supabase` singleton; user session).
- **Auth context:** what the connection authenticates as at RLS-eval time.
- **What it reads:** "own row" = `eq("user_id", caller_uid)`; "specific user_id" = `eq("user_id", param)` where param can be any user; "all rows" = no user_id filter.
- **Post-RLS:** unaffected / works / silently empty / breaks.
- **Risk:** LOW / MEDIUM / HIGH (HIGH = a production user feature loses data on apply).

### Edge functions — service-role (RLS bypassed by design)

| File:Line | Client | Auth context | What it reads | Post-RLS | Risk |
|---|---|---|---|---|---|
| `supabase/functions/stripe-webhook/billing.ts:490` | service-role | bypasses RLS | varies (webhook ledger writes) | unaffected | LOW |
| `supabase/functions/stripe-webhook/billing.ts:511` | service-role | bypasses RLS | varies | unaffected | LOW |
| `supabase/functions/stripe-webhook/billing.ts:607` | service-role | bypasses RLS | recompute read | unaffected | LOW |
| `supabase/functions/stripe-webhook/billing.ts:819` | service-role | bypasses RLS | varies | unaffected | LOW |
| `supabase/functions/stripe-webhook/billing.ts:881` | service-role | bypasses RLS | varies | unaffected | LOW |
| `supabase/functions/stripe-webhook/webhook-events.ts:675` | service-role | bypasses RLS | event-side write | unaffected | LOW |
| `supabase/functions/me-entitlement/index.ts:123` | service-role (`adminClient`, line 115) | bypasses RLS | `.eq("user_id", user.id)` + `.eq("app_id", …)` | unaffected | LOW |
| `supabase/functions/create-billing-portal-session/index.ts:87` | service-role (`supabaseAdmin`, line 55) | bypasses RLS | per-user lookup | unaffected | LOW |
| `supabase/functions/admin-billing-cancel-subscription/index.ts:115` | service-role (`adminClient`, line 54) | bypasses RLS | UPDATE — RLS bypassed | unaffected | LOW |
| `supabase/functions/admin-billing-metrics/index.ts:189` | service-role (`supabase`, line 169) | bypasses RLS | aggregate read | unaffected | LOW |
| `supabase/functions/billing-stripe-change-plan/index.ts:262` | service-role (`params.supabaseAdmin`) | bypasses RLS | per-user read | unaffected | LOW |
| `supabase/functions/billing-google-attach-purchase/index.ts:382` | service-role (via `createAdminClient` from `_billing/client.ts`) | bypasses RLS | provider-sub lookup | unaffected | LOW |
| `supabase/functions/billing-google-attach-purchase/index.ts:395` | service-role | bypasses RLS | UPDATE | unaffected | LOW |
| `supabase/functions/billing-google-attach-purchase/index.ts:409` | service-role | bypasses RLS | INSERT | unaffected | LOW |
| `supabase/functions/_shared/entitlement/recompute.ts:139` | service-role (callers: `stripe-webhook`, `me-entitlement`, `get-subscription-status` — all pass their own service-role client in) | bypasses RLS | `.eq("user_id", userId).eq("app_id", appId)` | unaffected | LOW |

### Edge functions — user-JWT (RLS respected)

| File:Line | Client | Auth context | What it reads | Post-RLS | Risk |
|---|---|---|---|---|---|
| `supabase/functions/adult-content-url/index.ts:129` | user-JWT-edge (`supabase`, line 87, anon-key + caller `Authorization` header) | authenticated caller | `.eq("user_id", userId).single()` where `userId` is derived from the caller's `getUser()` result (line 91 "Require login") — i.e., always equals `auth.uid()` | **works correctly** — own-row policy matches | LOW |

### Browser singleton — user-JWT, ADMIN PAGE expecting ALL rows

| File:Line | Client | Auth context | What it reads | Post-RLS | Risk |
|---|---|---|---|---|---|
| `src/lib/admin/costMonitoring.ts:488` (called from `src/pages/admin/CostMonitoring.tsx:188`) | user-JWT-browser | authenticated admin | `.select("product_id, status").in("status", [...])` — **ALL rows across all users**, no user_id filter | **silently empty for admins level 1–8**; **works for admins level ≥ 9** via admin policy | **HIGH** if non-9 admins exist (silent revenue=0); LOW otherwise |
| `src/pages/admin/AdminSubscriptions.tsx:155` | user-JWT-browser | authenticated admin | `.select("id,user_id,…").order("updated_at")` — **ALL rows**, no user_id filter | **silently empty for admins level 1–8**; **works for admins level ≥ 9** | **HIGH** if non-9 admins exist; LOW otherwise |

### Browser-side billing helpers — UNUSED in production today

| File:Line | Client | Auth context | What it reads | Post-RLS | Risk |
|---|---|---|---|---|---|
| `src/billing/subscriptionRepository.ts:162` (`getSubscriptionsByUserId`) | user-JWT-browser via dynamic import of `@/integrations/supabase/client` | authenticated caller | `.select(…).eq("user_id", userId)` | **N/A — function is defined but has zero callers in `src/` outside tests** (`grep -rn "getSubscriptionsByUserId" src/` returns only its own definition and tests). The live subscription read path is the edge-fn `_shared/entitlement/recompute.ts`. | NONE (dead in prod) |
| `src/billing/subscriptionRepository.ts:266` (`upsertSubscription`) | user-JWT-browser | authenticated caller | UPSERT — RLS-without-INSERT-policy would block all writes | **N/A — zero non-test callers**. Would break if ever wired (no INSERT policy in !86). | NONE (dead in prod) |
| `src/billing/recomputeAndPersistEntitlement.ts:57` | user-JWT-browser | authenticated caller | `.eq("user_id", userId)` + profiles update | **N/A — zero non-test callers**. The live `recomputeAndPersistEntitlement` is at `supabase/functions/stripe-webhook/billing.ts:601` (service-role). | NONE (dead in prod) |

---

## Summary

**Safe-to-apply verdict:** **APPLY !86 ONLY AFTER VERIFYING ADMIN-LEVEL DISTRIBUTION.**

- The 15 edge-function call sites are all service-role and bypass RLS. **Unaffected.**
- The one user-JWT edge function (`adult-content-url`) reads only the caller's own row by construction. **Works correctly.**
- The 3 browser-side billing helpers (`getSubscriptionsByUserId`, `upsertSubscription`, `recomputeAndPersistEntitlement` in `src/billing/`) are **defined but unused** in production code paths. No live impact.
- **The 2 admin dashboard call sites (`AdminSubscriptions.tsx:155`, `costMonitoring.ts:488`) silently break for admins at `admin_level 1..8`** because `AdminRoute` admits them (`isAdmin = level > 0`) but the SQL admin policy requires `>= 9`.

### Pre-merge checklist for A-side

- [ ] Run `SELECT level, COUNT(*) FROM public.admin_users GROUP BY level ORDER BY level;` in the SQL Editor.
- [ ] **If every row has `level = 10`:** !86 is safe to apply. Merge.
- [ ] **If any row has `level` in `1..8`:** pick one of:
  - Promote them to 9+ (one `UPDATE`).
  - Amend !86 to use `>= 1` instead of `>= 9` (less defense-in-depth).
  - Tighten the frontend `useAdminAccess.ts:59` gate to `safeLevel >= 9` in a separate MR before applying !86.

### Out of scope

- Whether any of the 3 unused `src/billing/*` helpers should be wired up. They look like a parallel-track refactor; orthogonal to !86.
- The 4 `_billing/client.ts` `createAdminClient` callers' exact code path — verified by import inspection (it returns a service-role client) but not exhaustively read.
- INSERT/UPDATE/DELETE policies. !86 explicitly does not add them. Edge functions writing via service-role are unaffected.
