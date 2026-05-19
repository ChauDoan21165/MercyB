# RECON — Entitlements table schema spec (A5)

> **D1 implementation design. NO migration file, NO code.** This is the
> committed design input for the *future* gated dispatch that creates the
> table, writes the migration, and wires the single writer. That dispatch
> is gated on **D1 confirmation + this design landing** (B48 §Chau-decision).
>
> Branch: `b67/entitlements-schema-spec` · off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Labels: `money-path`, `silent-failure`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Primary input: `reports/RECON-billing-target-state-B48.md`
>   (on `origin/b48/billing-target-state`, not yet on main — quoted inline)
> Live source reads: `me-entitlement/{index,entitlement}.ts`,
>   `stripe-webhook/{core,billing,types}.ts`, `_shared/billing.ts`,
>   migrations `20260315211233_unified_entitlements_and_subscriptions.sql`,
>   `20251020094557_*` (user_subscriptions), `20260614000000_profiles_freeze`,
>   `20260425083000_gift_subscriptions.sql`.

---

## Verdict

D1 is decided: **materialized `entitlements` table**, one row per
`(user_id, app_id)`, written only by the future server-side
`recomputeEntitlement(userId)`, read only by `loadEntitlement(userId, appId)`
(B48 target invariants 1–3). This spec fixes the schema so the gated
implementation dispatch has no design decisions left to make.

Two design choices carry the weight and are justified below:

1. **`is_premium` is a `GENERATED ALWAYS … STORED` column**, not a written
   one. It is structurally impossible for `is_premium` to disagree with
   `status` — which is *exactly* the B13 class of bug (two copies of the
   derivation drift). The schema enforces the invariant the code kept
   failing to.
2. **`source` / `status` are `text + CHECK`, not native `ENUM`.** Matches
   the established pattern on `subscriptions.status`,
   `subscriptions.provider`, `profiles.premium_source`; trivially evolvable
   in a codebase that already carries heavy SQL-Editor schema drift, where
   `ALTER TYPE` is the worst possible thing to need.

One correction to the brief's suggested source set is flagged in §5.

---

## Evidence consulted (current state)

### `subscriptions` — the upstream truth (`20260315211233_*`)

PK `id uuid`; `user_id uuid not null → profiles(id) on delete cascade`;
`provider text check (provider in ('stripe','apple','google'))`;
`status text check (status in ('active','trialing','grace_period',
'past_due','paused','expired','revoked'))`; `current_period_start/end
timestamptz`; `created_at/updated_at`. **`app_id` is NOT in this
migration** — it is live prod SQL-Editor drift (see §App-id semantics).

### `user_subscriptions` — legacy gift store (`20251020094557_*`)

PK `id uuid`; `user_id uuid not null`; `tier_id → subscription_tiers`;
`status text default 'active' check (status in ('active','cancelled',
'expired','past_due'))`; `current_period_end timestamptz`;
**`UNIQUE(user_id)`** (already one-row-per-user). Gift redemptions land
here with `is_gift_redemption = true`; the unified `subscriptions` table
never sees them. The read path bolts on a fallback for exactly this
(`me-entitlement/index.ts:42-63,152-162`).

### Read-derive vs write-derive (the B13 split, confirmed live)

- **Read-derive** `me-entitlement/entitlement.ts`:
  `CanonicalSource = 'stripe'|'apple'|'google'|'gift_code'|null`,
  `CanonicalStatus =` 8 values incl. `'inactive'`,
  `isPremiumStatus = active|trialing|grace_period|past_due`. Carries the
  expiry-blind bug at `normalizeStatus` `case "active": return "active"`
  (entitlement.ts:113 — no expiry check; B13 blind spot #1).
- **Write-derive** `stripe-webhook/core.ts deriveEntitlementFromSubscriptions`
  → `EntitlementSnapshot = { status: 'active'|'inactive'; expires_at;
  source: 'stripe'|'apple'|'google'|null }` (types.ts:53-57). It
  **collapses** the rich status to binary and **drops `gift_code`**. This
  is the structural reason the two derivations cannot agree — they don't
  even share a type. The entitlements row models the **richer** read-side
  shape; the future single `deriveEntitlement` (B13 phase 3) produces that
  shape and both paths consume it.
- `_shared/billing.ts toEntitlementResponse` also drops `gift_code`
  (`EntitlementSource = stripe|apple|google|null`, billing.ts:6,86-90) and
  probes a dead candidate list `['user_entitlements_v','user_entitlements',
  'my_entitlements_v1','my_entitlements']` (billing.ts:211-216) that
  resolves to none today → returns hard `inactive`. Flagged in §Open
  questions; the single `loadEntitlement` replaces this probe.

### App-id semantics (resolves brief step 5)

`subscriptions.app_id` **exists in production** but in **no migration** —
the live read path filters on it: `me-entitlement/index.ts:126`
`.eq("app_id", "mercy_blade")`; `billing.ts:550` same; the writer threads
it through (`webhook-events.ts:25 DEFAULT_APP_ID="mercy_blade"`,
`billing.ts:33` same, `subscription-insert.ts:52`). The **only** non-default
value anywhere is the test fixture `"kids-app"`
(`__tests__/subscriptionInsert.test.ts:68`) — there is **no second app in
production**. `user_room_progress` already uses the same
`(user_id, app_id, room_id)` keying (`20260424000000_*`).

**Conclusion:** `app_id` is **single-valued (`'mercy_blade'`) in prod
today, multi-tenant-capable by deliberate codebase design.** The composite
PK `(user_id, app_id)` is correct: it costs nothing today (one app), and
the day a `kids-app` ships its entitlements don't collide with
`mercy_blade`'s. `app_id text NOT NULL DEFAULT 'mercy_blade'` so every
existing call site keeps working unchanged.

---

## Schema — SQL DDL (spec only; NOT a migration file)

```sql
-- ── public.entitlements ──────────────────────────────────────────────
-- ONE materialised row per (user_id, app_id). The single answer to
-- "is this user entitled?". Written ONLY by the server-side
-- recomputeEntitlement(userId) (service-role). Read ONLY by
-- loadEntitlement(userId, appId). A derived projection of
-- `subscriptions` (+ gift source) — holds nothing not re-derivable
-- from upstream truth (this is what makes rollback lossless, §Rollback).

create table if not exists public.entitlements (
  user_id      uuid        not null
                 references public.profiles(id) on delete cascade,

  -- Single-valued ('mercy_blade') in prod today; multi-tenant-capable.
  -- Default keeps every existing .eq("app_id", …) call site working.
  app_id       text        not null default 'mercy_blade',

  -- Full canonical status (read-side shape, not the write-side binary).
  -- CHECK mirrors subscriptions.status + 'inactive' (entitlement.ts
  -- CanonicalStatus). text+CHECK, not ENUM — see §Design decision 2.
  status       text        not null default 'inactive'
                 check (status in (
                   'active','trialing','grace_period','past_due',
                   'paused','expired','revoked','inactive')),

  -- Includes 'gift_code' (entitlement.ts CanonicalSource) so a
  -- gift-derived entitlement is representable regardless of D3 timing
  -- (§D3). NULL when status is non-entitling / no winner row.
  source       text        null
                 check (source is null or source in (
                   'stripe','apple','google','gift_code')),

  expires_at   timestamptz null,

  -- The B13-killer: is_premium can NEVER drift from status because it
  -- is not written — it is computed by the engine. Single source of the
  -- premium predicate (= isPremiumStatus, entitlement.ts:153-160).
  is_premium   boolean     not null
                 generated always as (
                   status in ('active','trialing','grace_period','past_due')
                 ) stored,

  -- Liveness: bumped by recomputeEntitlement on EVERY run, even a no-op
  -- recompute. "When did we last check?" → B7 staleness monitoring.
  computed_at  timestamptz not null default timezone('utc', now()),

  -- Audit: bumped by trigger ONLY when (status,source,expires_at)
  -- actually changes. "When did the answer last change?"
  updated_at   timestamptz not null default timezone('utc', now()),

  primary key (user_id, app_id)
);

-- ── Indexes ──────────────────────────────────────────────────────────
-- Read pattern is "by user_id" → the PK's leftmost column already
-- serves equality + prefix scans on user_id; loadEntitlement does
-- `where user_id = $1 and app_id = $2` which is a pure PK point-get.
-- NO standalone user_id index needed (would duplicate the PK prefix).
-- Write pattern is single-row UPSERT on the PK → also covered.

-- MRR / "how many users are entitled" (B7 Q1/Q4 safety-net query):
create index if not exists entitlements_is_premium_idx
  on public.entitlements (app_id)
  where is_premium;

-- Staleness sweep (B7 safety-net: rows not recomputed in N hours →
-- a stuck/missing write path is now observable, not silent):
create index if not exists entitlements_computed_at_idx
  on public.entitlements (computed_at);

-- ── RLS — users read own row only, service-role writes ───────────────
alter table public.entitlements enable row level security;

-- Dual lock (defense in depth — the profiles-freeze lesson:
-- 20260614000000_* proved table-level GRANTs are the real risk surface):
--   (1) no write policy for `authenticated`
--   (2) no write GRANT for `authenticated`
-- recomputeEntitlement uses the service-role key → bypasses RLS.
-- anon has neither grant nor policy → no access at all.
grant select on public.entitlements to authenticated;
-- (deliberately NO insert/update/delete grant to authenticated)

drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own
  on public.entitlements
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ── updated_at maintenance (value-change only) ───────────────────────
-- computed_at is set explicitly by recomputeEntitlement each run.
-- updated_at moves only on a real delta, so it is a true change clock.
create or replace function public.entitlements_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.status   is distinct from old.status
  or new.source   is distinct from old.source
  or new.expires_at is distinct from old.expires_at then
    new.updated_at := timezone('utc', now());
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists entitlements_touch_updated_at on public.entitlements;
create trigger entitlements_touch_updated_at
  before update on public.entitlements
  for each row
  execute function public.entitlements_touch_updated_at();

comment on table public.entitlements is
  'Single materialised answer to "is this user entitled?". One row per '
  '(user_id, app_id). Server-write-only (recomputeEntitlement, '
  'service-role). Derived projection of subscriptions (+ gift source); '
  'losslessly rebuildable. is_premium is GENERATED — cannot drift from '
  'status (closes the B13 two-derivation class). See '
  'reports/RECON-entitlements-table-schema-A5.md.';
```

### Note: NO BEFORE-UPDATE freeze trigger (unlike `profiles`)

`profiles` needs `profiles_freeze_privileged_columns` (`20260614000000_*`)
**because** `authenticated` has a table-level UPDATE grant on it. The
entitlements table is **born server-write-only** — no write grant, no
write policy — so there is no privilege-escalation surface to revert. The
freeze pattern is unnecessary here; not adding it is the smaller, correct
design.

---

## Column-by-column rationale (brief step 5)

| Column | Type | Null | Default | Why |
|---|---|---|---|---|
| `user_id` | `uuid` | no | — | FK → `profiles(id) ON DELETE CASCADE`, identical to `subscriptions.user_id` (the upstream truth's FK). User deleted → entitlement gone. |
| `app_id` | `text` | no | `'mercy_blade'` | Prod reality (§App-id). Default = zero call-site churn. PK half. |
| `status` | `text` | no | `'inactive'` | Rich 8-value canonical status (read-side shape). `text+CHECK` matches `subscriptions.status`. Default `'inactive'` = safe-closed (backfill/insert before first recompute denies premium, never grants). |
| `source` | `text` | yes | — | `null \| stripe \| apple \| google \| gift_code` = `CanonicalSource`. NULL ⇔ non-entitling / no winner. |
| `expires_at` | `timestamptz` | yes | — | Winner's period end. NULL for lifetime/inactive. The column B13's gates ignored — here it is *stored*, and the future `deriveEntitlement` writes it with the expiry check applied. |
| `is_premium` | `boolean` | no | *generated* | `GENERATED ALWAYS AS (status IN (active,trialing,grace_period,past_due)) STORED`. Never written → never drifts from `status`. |
| `computed_at` | `timestamptz` | no | `now()` | Liveness clock — every recompute bumps it (even no-op). Drives staleness monitoring. |
| `updated_at` | `timestamptz` | no | `now()` | Change clock — trigger bumps only on real value delta. Drives audit / change detection. |

**PK = `(user_id, app_id)`** (B48 invariant 1 verbatim). Read = PK
point-get; write = PK UPSERT (`on conflict (user_id, app_id) do update`).
`computed_at`/`updated_at` semantics are deliberately split so "we checked
and nothing changed" is distinguishable from "nothing has happened" — the
former is healthy, the latter (with old `computed_at`) is a silent-failure
signal (the exact B48 through-line).

---

## Design decision: `source` set — brief correction

Brief step 5 suggests `('stripe','revenuecat','gift_code', null)`.
**`revenuecat` is wrong for this column.** RevenueCat is the *integration
vendor* for Apple/Google; the value persisted everywhere in the codebase is
`apple` or `google`, never `revenuecat`
(`subscriptions.provider check (… 'apple','google')`; `CanonicalSource`;
`revenuecat-webhook` writes `subscriptions` with provider `apple`/`google`).
Using `revenuecat` would make the entitlements `source` disagree with
`subscriptions.provider` and reintroduce a normalization seam.

**Decided set: `('stripe','apple','google','gift_code')` NULLABLE** — it is
exactly `entitlement.ts CanonicalSource`, so the writer can persist
`normalizeSource()`'s output with zero remapping.

**`text + CHECK`, not native `ENUM`** — justification:
- Established pattern: `subscriptions.status`, `subscriptions.provider`,
  `profiles.premium_status`, `profiles.premium_source` are all
  `text + CHECK`. A native ENUM here would be the lone exception.
- Evolvability under drift: this Supabase has heavy SQL-Editor schema
  drift (`app_id`, `is_admin_user`, `profiles` policies — none in
  migrations). Adding a future source = `drop constraint` / `add
  constraint` (instant, reversible, reviewable in one SQL block). A native
  `ALTER TYPE … ADD VALUE` cannot run inside a transaction and the value
  can never be removed — the worst tool to hand a drift-prone DB.
- No measurable read benefit at this table's scale (~100 users today).

Same reasoning applies to `status` (`text + CHECK`, mirroring
`subscriptions.status` + `'inactive'`).

---

## Relationship to `subscriptions` / `user_subscriptions` (D3 — brief step 7)

```
subscriptions       (provider truth: stripe-webhook, revenuecat-webhook)
       │
user_subscriptions  (legacy gift store, is_gift_redemption=true,
       │             UNIQUE(user_id)) ── folded in per D3 (writer-side)
       │
       ▼  ONE pure fn  deriveEntitlement(rows, now)  [B13 phase 3, +expiry]
       │
   entitlements      ← this table (the only answer)
       │
       ▼  same transaction
profiles.premium_*   ← read-only projection (UI/legacy convenience)
```

**The entitlements schema is D3-agnostic — by design.** D3 (fold
`user_subscriptions` gifts into `subscriptions` as `source='gift_code'`
rows, vs keep the legacy fallback forever) changes **what
`recomputeEntitlement` reads**, never the entitlements row shape:

- **Pre-D3 (legacy fallback kept):** writer reads `subscriptions` *and*
  the `user_subscriptions` gift fallback (today's `me-entitlement/index.ts`
  `fetchActiveGiftSubscription` logic, moved server-side into the single
  writer). A gift produces an entitlements row with `source='gift_code'`.
- **Post-D3 (folded in):** writer reads only `subscriptions`; gifts are
  already `source='gift_code'` rows there. **Identical entitlements row.**

The single schema requirement D3 imposes is already met: **`source` must
include `'gift_code'`** (it does). Nothing in this table changes when D3 is
decided either way — confirming the brief's step-7 framing.

---

## Backfill plan (brief step 8)

Goal: when the table lands, **every existing profile has an entitlements
row** so `loadEntitlement` never returns a phantom `inactive` for a paying
user, and no read path needs a "row missing?" branch.

1. **Same logic, once, server-side.** The backfill is `recomputeEntitlement`
   run for every `profiles.id`, not a hand-written SQL derivation — reusing
   the single writer guarantees backfill and steady-state can't diverge
   (the whole point of this exercise). Shape: a one-shot admin edge
   function / script that pages all profiles and calls
   `recomputeEntitlement(userId, 'mercy_blade')`.
2. **Gifts included from row one.** The recompute MUST run with the gift
   path active (legacy fallback pre-D3, or folded-in post-D3) so
   gift-redeemed users backfill as `is_premium=true source=gift_code`, not
   `inactive`. Backfilling before the gift-aware writer exists would
   silently strip ~all gift users — explicitly sequence backfill *after*
   the single writer reads gifts.
3. **Floor row for everyone.** Profiles with no subscription and no gift
   get an explicit `status='inactive'` row (the table default). Every
   profile ends with exactly one `(user_id,'mercy_blade')` row.
4. **Idempotent.** UPSERT `on conflict (user_id, app_id) do update`. Safe
   to re-run (and it *will* be re-run if it half-completes).
5. **Verification gate before flipping reads.** After backfill:
   `count(profiles) == count(distinct entitlements.user_id where
   app_id='mercy_blade')`, and spot-check that every
   `profiles.premium_status='active'` user and every active
   `user_subscriptions` gift user has `entitlements.is_premium=true`. Only
   then repoint `loadEntitlement` at the table.
6. **D6 / locked #4 — Chau-applied.** No unattended SQL/catalog path to
   this Supabase (memory: agent-infra-access, db-schema-drift-audit). The
   table DDL and the backfill run are **human-applied via SQL Editor /
   admin-invoked**, reviewed first. Budget Chau manual-apply time into the
   gated implementation dispatch.

---

## Rollback plan (brief step 9)

The table is a **derived projection** — it stores nothing not
re-derivable from `subscriptions` + `user_subscriptions`, and
`profiles.premium_*` keeps being written in the *same* transaction as the
entitlements UPSERT (B48 invariant 3). That property is what makes
rollback lossless. Tiered, fastest-first:

1. **Read flip (seconds, no data touched).** `loadEntitlement` is the
   single read seam. Behind a flag / function swap, repoint it from
   "SELECT the entitlements row" back to the **current** derive-on-read
   (`me-entitlement` `normalizeEntitlement(subscriptions)` + gift
   fallback). Reads instantly return to today's behavior. The table can
   keep being written (harmless) while you diagnose.
2. **Stop writing (1 line).** If the *writer* is the problem, make the
   entitlements UPSERT a no-op (keep the `profiles.premium_*` projection
   write — that path predates this table and the legacy readers still use
   it). System is exactly pre-table.
3. **Keep the table ≥1 release before DROP.** Do not `DROP TABLE` on the
   same deploy as the read flip — a kept-but-idle table makes re-enable a
   one-line revert instead of a re-migration + re-backfill. Only
   `DROP TABLE public.entitlements;` (+ its trigger/function) after a full
   release of stable derive-on-read, Chau-applied.

**No data-loss risk at any tier:** the entitlements row is recomputable
from upstream truth at any time by re-running the backfill (§8). Rollback
is a *read-path* and *write-target* decision, never a data-recovery one.

---

## Open questions / dependencies (not blockers for this spec)

1. **`subscriptions.app_id` is untracked prod drift.** The gated
   implementation migration should *also* formally introduce + comment
   `subscriptions.app_id` (and document the `'mercy_blade'` default) so the
   composite FK story isn't half-tracked. Out of scope for *this* schema
   spec; flag for the implementation dispatch. (Memory:
   db-schema-drift-audit — there is no unattended path to reconcile this.)
2. **`_shared/billing.ts` dead probe list.** `readEntitlementForUser`
   probes `['user_entitlements_v','user_entitlements','my_entitlements_v1',
   'my_entitlements']` and `toEntitlementResponse` drops `gift_code`. The
   single `loadEntitlement` (B48 invariant 2) replaces this whole function;
   confirm `loadEntitlement` is *new* (in `_shared/entitlement.ts`) and the
   old probe path is deleted, not extended — otherwise a stale reader could
   read a non-existent view and silently return `inactive` (a fresh
   silent-failure). Implementation-dispatch concern.
3. **`computed_at` staleness threshold** for the B7 safety-net alert is
   unspecified here (it's monitoring scope, B7/D5, not schema). The index
   exists; the alerting query/threshold is a separate workstream.
4. **`is_premium` GENERATED STORED** assumes Postgres ≥12 (Supabase is far
   newer — fine). Noted only so the implementation dispatch doesn't treat
   it as exotic.

None of these gate adopting this schema. They are handoffs to the
gated implementation dispatch.

---

## Worktree disposition

**`prune` — design fully captured in this committed doc.** No code, no
migration, no follow-up worktree. This file is the sole input to the
gated implementation dispatch (create table + migration + single writer),
which starts only on **D1 confirmation + this doc landed on its branch**.
