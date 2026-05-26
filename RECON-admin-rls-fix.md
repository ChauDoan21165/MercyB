# RECON — /admin/access-codes frontend INSERT is RLS-denied (wrong admin model)

Branch `admin-insert-rls-fix` off `origin/main` HEAD `68855a29` (#556 merged ✓).
Phase 1 — recon only, no code changes. Scope locked to `access_codes` (locked #3).

Origin: `reports/RECON-stripe-audit.md` (branch `stripe-payment-audit`), finding
**§3.1 / §5 — "Admin INSERT RLS — `/admin/access-codes` can't create codes from
frontend" — HIGH, STILL OPEN.** This recon confirms it from source and adds the
exact frontend-gate evidence the stripe audit deferred ("needs one live DB query").

---

## TL;DR

The 20260509 "fix" wired all four `access_codes` admin RLS policies to
`has_role(auth.uid(),'admin')`, which reads **`public.user_roles`**. Every
other part of the product — the admin route guard, all admin edge functions,
email RLS, story/interview/analytics moderation, and 38 other live RLS
policies — treats **`public.admin_users` via `get_admin_level()`** as the admin
truth. Admins provisioned the normal way exist in `admin_users` (and
`profiles.is_admin`) but **not necessarily in `user_roles`**, so the browser
INSERT (`AdminAccessCodes.tsx:172`, anon client + admin JWT, RLS-subject)
evaluates `has_role → user_roles → no row → false` → `new row violates
row-level security policy`. Workaround in use today: admins INSERT via the
Supabase SQL Editor (service_role, bypasses RLS).

Fix = drop the 4 `has_role` policies and recreate them on
`get_admin_level(auth.uid()) >= 7`, preserving the unrelated user-redemption
SELECT policy.

**DECISION LOCKED (Chau): `N = 7`** — payment-grade, matches
`useAdminAccess` `canManagePayments` (access codes grant a paid tier).
Canonical predicate: **`public.get_admin_level(auth.uid()) >= 7`**.
Cross-task contract: Terminal 16 (`payment-transactions-rls-fix`) will mirror
this exact predicate for its INSERT policy once Phase 2 lands — keep the
predicate verbatim and quotable so both PRs ship an identical admin check.

---

## 1. Broken policy — exact source

`supabase/migrations/20260509000000_fix_access_codes_insert_policy.sql`

```sql
DROP POLICY IF EXISTS "Admins can manage access codes"   ON public.access_codes;
DROP POLICY IF EXISTS "Admins can view all access codes"  ON public.access_codes;

CREATE POLICY "Admins can select access codes" ON public.access_codes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));            -- ← WRONG MODEL
CREATE POLICY "Admins can insert access codes" ON public.access_codes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));       -- ← WRONG MODEL (the documented bug)
CREATE POLICY "Admins can update access codes" ON public.access_codes
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
                              WITH CHECK (public.has_role(auth.uid(), 'admin'));        -- ← WRONG MODEL
CREATE POLICY "Admins can delete access codes" ON public.access_codes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));            -- ← WRONG MODEL
```

`public.has_role` (`20251124083520`, body):

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
```

→ The function reads **`public.user_roles`**, not `admin_users`. (Note: the
original `20251130002025` admin SELECT policy *already* used `has_role` — the
wrong-model rot predates the 20260509 fix; 20260509 merely propagated it to
INSERT/UPDATE/DELETE, which is what made the frontend write path fail.)

This is the **last** migration that defines `access_codes` admin policies — no
later migration re-fixes it. It is the current effective production state.

---

## 2. Canonical admin model (the truth `access_codes` should use)

`public.get_admin_level` (`20251209061329`, re-granted `20260427010000`):

```sql
CREATE OR REPLACE FUNCTION public.get_admin_level(_user_id uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT level FROM public.admin_users WHERE user_id = _user_id), 0)
$$;
REVOKE ALL ON FUNCTION public.get_admin_level(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_level(uuid) TO authenticated;   -- ← browser JWT path can call it
```

`public.admin_users` (`20251209061329`): `user_id uuid UNIQUE → auth.users`,
`email text`, `level int CHECK (1..10)`, `created_by`. RLS enabled; only
level 9+ can INSERT new admins. `get_admin_level` is `SECURITY DEFINER` so it
reads this restricted table safely from a normal JWT.

**Why `get_admin_level/admin_users` is the canonical truth — evidence:**

| Surface | Admin model used |
|---|---|
| `admin-management` edge fn (live; behind `useAdminLevel`) | **`admin_users`** — `admin_users.insert` is the error-checked write; the `user_roles` upsert at `:171-173` is fire-and-forget (`await` with **no `if (error)`** — best-effort compat shim) |
| `manage-admins` edge fn (legacy) | `user_roles` only — a competing, older model |
| Email RLS (`email_campaigns`/`email_events`) | `get_admin_level() >= 9` |
| Story / interview / analytics moderation RLS | `get_admin_level() >= 9` |
| All other live RLS admin gates | `get_admin_level(auth.uid()) >= 9` ×38, `>= 5` ×1, `> 0` ×3 |
| `access_codes` | **`has_role` → `user_roles`** — the lone outlier |

The frontend admin gate is itself three-headed and confirms the mismatch.
`useAdminAccess.ts` (the documented "Single Source of Truth for admin access in
the frontend") resolves admin status **primarily from `profiles.is_admin` /
`profiles.admin_level`** (`isAdminFromProfile`, `:86-89`), and only falls back to
RPCs — `has_role` **and** `get_admin_level` — when the profile lookup doesn't
surface admin (`:170-205`). `AdminRoute` admits anyone with `level > 0`
(`useAdminAccess.ts:59`, `isAdmin = safeLevel > 0`). So a normally-provisioned
admin **sees `/admin/access-codes` and the Create button** via
`profiles`/`admin_users`, then the browser INSERT is judged by a *fourth*,
disjoint source (`user_roles`) and is denied.

---

## 3. Bug trace (frontend INSERT → RLS denial)

1. `src/pages/admin/AdminAccessCodes.tsx:172` —
   `await supabase.from("access_codes").insert(payload)` using the **browser
   anon client** (`@/lib/supabaseClient`) carrying the logged-in admin's JWT.
   No edge-function indirection → **subject to RLS** as role `authenticated`,
   `auth.uid()` = admin's UID. (`toggleCodeStatus` `:196` UPDATE and delete
   `:221` are the same direct-browser pattern → same failure.)
2. RLS INSERT check → policy `"Admins can insert access codes"` →
   `WITH CHECK (public.has_role(auth.uid(), 'admin'))`.
3. `has_role` → `SELECT EXISTS(... FROM public.user_roles WHERE
   user_id = <admin uid> AND role = 'admin')`.
4. Admin was provisioned into `admin_users` / `profiles.is_admin` (normal path;
   founder/seed admins were inserted directly via SQL Editor per CLAUDE.md
   "Some migrations were applied manually via SQL Editor"; `admin-management`'s
   `user_roles` back-fill is best-effort and unverified for pre-existing
   admins, and `update_level`/`delete` paths do not keep `user_roles` in sync).
   → no `user_roles` row → `has_role` = **false**.
5. `WITH CHECK` fails → Postgres: *new row violates row-level security policy
   for table "access_codes"* → `AdminAccessCodes.tsx:188` toast
   **"Failed to create access code"**. Exactly the reported symptom.

Why the *list* still half-works (not a contradiction): RLS policies are OR'd,
and the unrelated user-redemption policy `"Users can view their assigned codes
or public codes"` (`20251130002025`, never dropped, still live) lets an admin
SELECT the public/active subset even though the admin SELECT policy also fails
— so the page renders but Create hard-fails. Service_role (SQL Editor) bypasses
RLS entirely, which is why the manual workaround works.

`access_codes` columns (`20251120035109`): `code` (UNIQUE NOT NULL), `tier_id`
(NOT NULL → `subscription_tiers`), `days` (NOT NULL), `max_uses`, `used_count`,
`is_active`, `expires_at`, `created_by` (NOT NULL), `notes`. Frontend payload
supplies `code, tier_id, days, max_uses, notes, created_by, is_active`
(+ optional `expires_at`) — schema-valid; the *only* thing rejecting it is RLS.

---

## 4. New policy SQL (proposed migration)

`supabase/migrations/20260510040000_fix_access_codes_admin_model.sql`
(timestamp after the existing 20260510* migrations; final value set at Phase 2).
`{N}` resolved per §7 before writing.

```sql
-- Re-point access_codes admin RLS from the wrong admin model
-- (has_role → public.user_roles) to the canonical one
-- (get_admin_level → public.admin_users), matching every other admin
-- RLS gate in the product. Fixes the documented /admin/access-codes
-- frontend INSERT denial (stripe-audit §3.1/§5).
--
-- NOT touched: "Users can view their assigned codes or public codes"
-- (20251130002025) — the user redemption-visibility policy. It is a
-- separate policy and must remain intact.
--
-- service_role bypasses RLS, so the SQL-Editor workaround and the
-- redeem-access-code RPC/service path are unaffected.
-- get_admin_level already has GRANT EXECUTE TO authenticated
-- (20260427010000), so the browser JWT path can evaluate this.
-- Safe to re-run (DROP POLICY IF EXISTS … then CREATE).

DROP POLICY IF EXISTS "Admins can select access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can insert access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can update access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can delete access codes" ON public.access_codes;

CREATE POLICY "Admins can select access codes" ON public.access_codes
  FOR SELECT TO authenticated
  USING (public.get_admin_level(auth.uid()) >= {N});

CREATE POLICY "Admins can insert access codes" ON public.access_codes
  FOR INSERT TO authenticated
  WITH CHECK (public.get_admin_level(auth.uid()) >= {N});

CREATE POLICY "Admins can update access codes" ON public.access_codes
  FOR UPDATE TO authenticated
  USING (public.get_admin_level(auth.uid()) >= {N})
  WITH CHECK (public.get_admin_level(auth.uid()) >= {N});

CREATE POLICY "Admins can delete access codes" ON public.access_codes
  FOR DELETE TO authenticated
  USING (public.get_admin_level(auth.uid()) >= {N});
```

- **Browser INSERT (frontend JWT path):** `authenticated` role, `auth.uid()` =
  admin. `get_admin_level` is `SECURITY DEFINER` + granted to `authenticated` →
  returns the admin's level from `admin_users` → `>= {N}` → INSERT allowed. ✔
- **Service-role path (SQL Editor / `redeem-access-code` RPC):** `service_role`
  has BYPASSRLS → policies never evaluated → still works. ✔
- **Non-admin authenticated user:** `get_admin_level` = 0 → all 4 admin
  policies false; only the user-redemption SELECT policy applies → cannot
  insert/update/delete, can still see their own/public codes. ✔
- DROP-before-CREATE in one migration → **no lockout window** (transactional;
  no point where `access_codes` has zero admin policy). Satisfies "do not
  remove the broken policy without immediately replacing it."

---

## 5. Other tables with the same bug pattern

Targeted at the surface where the bug actually *bites* — direct browser writes
by admins via the anon client (RLS-subject). Enumerated every
`.insert/.update/.delete/.upsert` under `src/pages/admin/`:

| Page | Table | Admin model in its RLS | Verdict |
|---|---|---|---|
| `AdminAccessCodes.tsx` | `access_codes` | `has_role`/`user_roles` | **THE BUG** |
| `InterviewPromptsModeration.tsx` | `user_interview_prompts` | `get_admin_level() >= 9` (`20260534000000`; page header confirms) | OK |
| `StoryModeration.tsx` | `user_stories` | `get_admin_level() >= 9` (`20260523000000`; header confirms) | OK |
| `LatencyMonitoring.tsx` | `alert_pause` | `get_admin_level()` family (`20260518000000`) | OK |

**`access_codes` is the only frontend-write table on the wrong model.** No
other same-bug table needs fixing on the user-facing path → this PR stays
scoped to `access_codes` (locked #3).

Broader note (out of scope, flagged for a separate audit): 42 live migration
files still reference `has_role(`. The vast majority gate tables written only
by service-role edge functions (RLS-bypassed) or admin-SELECT-only surfaces, so
they don't manifest the same user-visible failure — but `has_role`/`user_roles`
remaining a *parallel* admin model is latent debt (and a reverse risk:
`admin-management` `delete`/`update_level` don't prune `user_roles`, so a
demoted/deleted admin can retain `has_role`-gated access). Recommend a
dedicated follow-up: full `pg_policies` introspection of effective production
state + a decision to retire `has_role`/`user_roles` and `manage-admins`, or
formally make `admin_users` strictly authoritative with a sync trigger.
Separate PR, separate brief.

---

## 6. Frontend test plan

Automated (Phase 2 ships with these):

- **Migration shape test** — assert the migration drops the 4 `has_role`
  policies and creates 4 `get_admin_level`-based ones; assert it does **not**
  reference `"Users can view their assigned codes or public codes"`. (Static
  assertion in the migration-shape test suite; no live DB.)

Manual / DB verification (no DB creds in recon scope — for Chau or staging):

1. **Confirm the bug pre-fix:**
   `SELECT user_id, level FROM admin_users;` vs
   `SELECT user_id, role FROM user_roles WHERE role='admin';` — expect the
   founder/admin UID present in `admin_users`, absent from `user_roles`.
2. **Frontend success path (post-fix):** as a real admin (`admin_users.level
   >= {N}`), open `/admin/access-codes` → Create → fill form → submit. Expect
   toast "Access code created", code copied, row appears in the list. (No SQL
   Editor.)
3. **Frontend deny path:** as a non-admin authenticated user (or
   `level < {N}`), attempt the same INSERT via console
   (`supabase.from('access_codes').insert({...})`). Expect RLS denial.
4. **UPDATE/DELETE:** as the admin, toggle a code active/inactive and delete a
   test code from the UI → both succeed (previously also `has_role`-gated).
5. **Service path regression:** `redeem-access-code` redeem flow + a SQL-Editor
   INSERT still work (service_role unaffected).
6. **Non-regression:** a regular user can still SELECT their assigned/public
   codes (user-redemption policy untouched).

---

## 7. Open decision — the level threshold `N` (needs Chau)

The migration is fully determined **except** the numeric threshold. This is a
product/security call, not derivable from code, and it changes the SQL:

- The `/admin/access-codes` route is visible to **any `level > 0`** admin
  (`AdminRoute` → `isAdmin = level > 0`).
- Issuing an access code **grants a paid subscription tier** (it's a
  comp/grant primitive), so it is a sensitive money-adjacent operation.
- Convention: privileged write/manage RLS overwhelmingly uses `>= 9`
  (38 policies; email RLS; system edit; moderation). `useAdminAccess`'s own
  capability map puts `canManagePayments` at `>= 7`, `canEditSystem` at `>= 9`.

Trade-off:

- **`>= 9`** — maximally consistent with existing privileged RLS; treats code
  issuance as high-trust. Cost: level 1–8 admins see the page but still can't
  create (a smaller, *intentional* gate, not a bug).
- **`>= 7`** — matches `canManagePayments`; aligns the gate to the *nature* of
  the op (granting paid tiers). Recommended default.
- **`> 0`** — matches the UI gate exactly; eliminates every page-visible-but-
  action-denied mismatch. Cost: any level-1 admin can mint unlimited
  paid-tier codes.

**Recommendation: `>= 7`** (payment-grade, matches `canManagePayments`).
Confirm before Phase 2.

---

## 8. Risk assessment

- **Blast radius:** one table, four admin policies. The user-redemption SELECT
  policy and all service-role paths are untouched by construction.
- **Reversibility:** fully reversible — re-applying `20260509000000`'s body
  restores the prior (broken) state. No data migration, no schema change to
  columns, no destructive operation.
- **No lockout risk:** single transactional migration, DROP immediately
  followed by CREATE; `access_codes` is never left without an admin policy.
- **Production schema change** → locked #4: **explicit Chau approval required
  before push.** Migration is human-reviewed (CLAUDE.md git discipline).
- **Migration drift caveat:** prod has had manual SQL-Editor migrations;
  policies are idempotent (`DROP … IF EXISTS`) so re-application is safe
  regardless of recorded CLI state. Recommend applying via SQL Editor
  (consistent with how the workaround/admins already operate) and recording it,
  per the CLAUDE.md Supabase drift note.
- **Lowest-risk posture:** smallest safe diff (locked operating discipline);
  no new code paths; aligns `access_codes` with the model the rest of the
  product already trusts rather than inventing a new one.

---

## Phase 2 (after recon + threshold approved)

- Write `supabase/migrations/20260510040000_fix_access_codes_admin_model.sql`
  with `{N}` resolved.
- Add the migration-shape test.
- Single PR (locked #16); PR body references stripe-audit §3.1/§5 and explains
  the `has_role`/`user_roles` vs `get_admin_level`/`admin_users` mismatch.
- Standard gates (`typecheck:ci`, `lint`, `vitest run`) green before commit.
- No push without explicit Chau approval (locked #4).
