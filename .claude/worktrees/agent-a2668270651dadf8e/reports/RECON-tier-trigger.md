# RECON — `profiles.tier` sync trigger on `payment_transactions`

**Agent:** tier-trigger-recon-agent
**Branch:** `tier-trigger-cleanup-recon` (off `origin/main` @ `484f68cd`)
**Date:** 2026-05-17
**Scope:** RECON ONLY — no code changes, no PR.
**Cross-refs:** `RECON-stripe-audit.md` (stripe-payment-audit), `RECON-me-entitlement.md` (me-entitlement-recon)

---

## TL;DR

| Question | Answer |
|---|---|
| Trigger binding tracked in migrations? | **NO.** Production-only, created via SQL Editor. **Verified by live `supabase db dump`.** |
| What is the binding? | `trg_sync_profile_tier_from_payment` — `AFTER INSERT OR UPDATE OF status ON payment_transactions` (not just AFTER INSERT) |
| What does the trigger write? | `profiles.tier := subscription_tiers.vip_key::text` (a **text** key, e.g. `level3`). Never touches `subscriptions` / `user_subscriptions`. |
| `profiles.tier` column type in prod | **`text NOT NULL DEFAULT 'free'`** — NOT integer |
| Functional readers of `profiles.tier` | 2 named (stories eligibility, mock-interview rate limit) — **both already type-broken; neither consumes the trigger's output today** |
| me-entitlement reads `profiles.tier`? | **NO** (confirmed end-to-end; canonical source is `subscriptions`) |
| Recommended path | **Path A** — keep trigger, migrate the 2 readers to entitlement, delete trigger later in its own tiny PR |
| Safest/smallest | Path A. The trigger removal itself is a **zero-runtime-behavior-change** because no reader can act on what it writes. |

---

## 1. Trigger source code + migration reference

### 1a. Trigger function — `sync_profile_tier_from_payment_transactions()`

**Only tracked artifact:** `supabase/migrations/20260510010000_fix_sync_profile_tier_trigger.sql` — and it is a **`CREATE OR REPLACE FUNCTION` only**. It does **not** create the trigger binding. Its own header comment states:

> *"CREATE OR REPLACE keeps the existing trigger binding intact — triggers reference the function by oid… the AFTER INSERT trigger on payment_transactions continues to fire the updated function with no rebinding needed."*

The migration exists solely to hot-fix a `column st.key does not exist` error (schema drift: `subscription_tiers.key` → `.vip_key`, renamed in prod via SQL Editor, never migrated). There is **no migration that originally `CREATE`s the function** either — both the original function definition and the binding are production-only drift.

Production body (verbatim from `supabase db dump`, identical to the fix migration):

```plpgsql
CREATE OR REPLACE FUNCTION public.sync_profile_tier_from_payment_transactions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare
  v_tier_key text;
  v_profiles_has_tier    boolean := public._col_exists('public','profiles','tier');
  v_profiles_has_tier_id boolean := public._col_exists('public','profiles','tier_id');
begin
  if new.status is null then return new; end if;
  if lower(new.status) not in ('paid','completed') then return new; end if;

  select st.vip_key::text into v_tier_key
  from public.subscription_tiers st
  where st.id = new.tier_id limit 1;

  if v_tier_key is null then return new; end if;

  if v_profiles_has_tier and v_profiles_has_tier_id then
    execute format('update public.profiles set tier=$1, tier_id=$2 where id=$3')
      using v_tier_key, new.tier_id, new.user_id;
  elsif v_profiles_has_tier then
    execute format('update public.profiles set tier=$1 where id=$2')
      using v_tier_key, new.user_id;
  elsif v_profiles_has_tier_id then
    execute format('update public.profiles set tier_id=$1 where id=$2')
      using new.tier_id, new.user_id;
  end if;
  return new;
end;
$$;
```

Note: prod `profiles` has **`tier` but NO `tier_id` column** (`profiles` cols: `tier text`, `vip_rank int`, `premium_status text`, `premium_source text`). So the `_col_exists` guard means the trigger **only ever runs `update profiles set tier=$1`**. The `tier_id` branches are dead in prod — the guard makes this safe (no error).

### 1b. Sibling dead RPC — `sync_profile_tier_from_latest_payment(uuid)`

The dump also revealed a second untracked function doing the same write (`update profiles set tier = v_vip_key`). **Zero callers** anywhere in `src/` or `supabase/functions/` (only appears in generated `database.types.ts`). Pure dead debt — list it for the same cleanup, lower priority.

---

## 2. Production binding verification — **AUDIT CLAIM CONFIRMED**

Method: `supabase db dump --linked --schema public` (project `buemdfxyhxunzpgdoqin`, Docker confirmed running, dump succeeded, 23 418 lines).

**Static (migrations) check** — the only `CREATE TRIGGER` on `payment_transactions` in `supabase/migrations/` is:
```
20251120035109_…sql:92  CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE …
```
i.e. the `updated_at` touch trigger — **NOT** the tier-sync one.

**Live production dump** — the binding exists:
```sql
-- /tmp dump line 17693
CREATE OR REPLACE TRIGGER "trg_sync_profile_tier_from_payment"
  AFTER INSERT OR UPDATE OF "status" ON "public"."payment_transactions"
  FOR EACH ROW EXECUTE FUNCTION "public"."sync_profile_tier_from_payment_transactions"();
```

**Conclusion: the audit was correct.** The binding `trg_sync_profile_tier_from_payment` is live in production but is **not in any tracked migration** — it was created via the SQL Editor. The trigger also fires on `UPDATE OF status`, not only `INSERT` (the brief said "AFTER-INSERT" — it is slightly broader).

Related (context, on a *different* table — `user_subscriptions`, not in scope for removal):
- `trg_mb_sync_profile_vip_rank` AFTER INSERT/UPDATE → `mb_sync_profile_vip_rank()`
- `trg_sync_profile_vip_rank` AFTER INSERT/UPDATE OF vip_rank → `sync_profile_vip_rank()`

These maintain `profiles.vip_rank` (a parallel denormalized cache) and are out of scope here.

---

## 3. Full list of `profiles.tier` writers and readers

### Writers (for completeness — none are "the reader problem")
| Writer | Path | Value written | Tracked? |
|---|---|---|---|
| `trg_sync_profile_tier_from_payment` (this trigger) | `payment_transactions` INSERT/UPDATE status∈(paid,completed) | `subscription_tiers.vip_key::text` | binding NO, fn fix YES |
| `revenuecat-webhook/index.ts:241,296` | service-role IAP webhook | `'level3'` on purchase / `'level0'` on expiry | code, legitimate |
| `sync_profile_tier_from_latest_payment(uuid)` RPC | dead — no callers | `vip_key` | NO |

**Important:** removing the trigger does **not** orphan `profiles.tier` — `revenuecat-webhook` still maintains it for IAP users. The column stays a (partially-updated) legacy denormalized cache either way.

### Readers (the two named, plus a sweep for others)

| # | Reader | File:line | Query | Treats `tier` as | Gate? |
|---|---|---|---|---|---|
| R1 | Stories eligibility | `src/lib/stories/eligibility.ts:118-146` | `from("profiles").select("tier, created_at").eq("id",uid)` | `number \| null` (`MIN_TIER=1`) | YES — gates "share your story" |
| R2 | Mock-interview rate limit (server) | `supabase/functions/mock-interview/index.ts:31-50` → `_shared/mockInterviewRateLimit.ts:108` | `from("profiles").select("tier, is_premium, premium_status")` | `number` (`ctx.tier >= 2`) | YES — gates free weekly limit |
| — | Admin users table | `src/pages/admin/AdminUsersPage.tsx:741` | `select('id,email,tier,created_at')` | display string | NO (admin display) |
| — | Admin stats strip | `src/components/admin/widgets/AdminStatsStrip.tsx:83` | `select("tier")` | aggregate count | NO (admin display) |
| — | me-entitlement | `supabase/functions/me-entitlement/index.ts` | — | **does not read it** | NO |

Sweep confirms: **no other entitlement gate reads `profiles.tier`.** Remaining `.tier` hits in `src/` are `rooms.tier` (room difficulty), `subscription_tiers`, AI params, generated types, and tests. This matches both reference recon docs.

---

## 4. Per-reader: what it reads vs. what it actually needs

### The decisive finding — both gates are **already type-broken** and consume nothing from the trigger

`profiles.tier` is **`text`** in prod (`DEFAULT 'free'`; trigger writes `level3`/`vip_key`; revenuecat writes `'level3'`/`'level0'`). Both readers expect a **number**:

- **R1 `eligibility.ts`:** `const tier = profile.tier ?? 0; if (tier < MIN_TIER) …`. With a text value: `'free' ?? 0` → `'free'`; `'free' < 1` → `NaN < 1` → **`false`**. The tier gate **never blocks** (column is `NOT NULL DEFAULT 'free'`, so the `?? 0 → 0 < 1 → true` block path is unreachable). Effectively a **no-op gate today.**
- **R2 mock-interview:** `tier: typeof row.tier === "number" ? row.tier : 0` → text ⇒ **always `0`**. The only use is `if (ctx.tier >= 2)` (paid → unlimited) — **dead branch in prod.** Paid/trial users get unlimited *only* via `isTrialing` (`is_premium && premium_status==='trialing'`) or admin bypass — neither of which is fed by this trigger.

**Therefore: removing the trigger changes ZERO observable runtime behavior** for R1 and R2. They already cannot act on what it writes.

### What each reader actually needs (canonical source)

Both want "is this user entitled to premium-only behavior?" The canonical source is **`subscriptions`** (unified table) → `me-entitlement` edge function → `{ is_premium, status }`, with a `user_subscriptions` gift-code fallback. Denormalized mirror columns: `profiles.premium_status` / `premium_expires_at` / `premium_source` (written by `recomputeAndPersistEntitlement` / `me-entitlement`). `profiles.tier` is **not** part of the canonical entitlement path.

- **R1 should** call the same entitlement source the rest of the app uses (e.g. `fetchCurrentEntitlement` / `me-entitlement`, or read `profiles.premium_status`) instead of `profiles.tier`.
- **R2 should** mirror the client gate it already claims to mirror (`MockInterviewRoom.tsx:68` derives `isPaid` from the entitlement, not `profiles.tier`). The edge function should resolve premium from `subscriptions` (or `profiles.premium_status`) and drop the `tier` column entirely; `isTrialing` already uses `premium_status`.

---

## 5. Three-path comparison

| | **Path A — keep trigger, migrate readers first** | **Path B — remove trigger + migrate readers atomically** | **Path C — keep everything, document debt** |
|---|---|---|---|
| Diff shape | 2 small reader PRs now; 1 tiny trigger-drop migration later | 1 larger PR: 2 reader edits + trigger-drop migration | 0 code; 1 doc note |
| Trigger removal coupling | Decoupled — removal is independent & behavior-neutral | Coupled — readers + DDL in one shot | N/A |
| Touches central files | No (eligibility.ts + mock-interview fn are leaf modules) | Same edits + a migration | No |
| Security (stripe-audit N1) | Closed by RLS tightening (separate); reader fix removes the *future* footgun; trigger drop finishes it | Same, all at once | Footgun stays latent |
| Reversibility | Each step independently revertable | All-or-nothing revert | Nothing to revert |
| Net runtime behavior change | None (readers already broken → fixing them is the only behavior change, intentional) | None from trigger; intentional from readers | None |

### Key insight that resimplifies the decision

The brief framed this as "remove trigger ⇒ readers break unless migrated." **That premise does not hold:** the readers are *already* not consuming the trigger (text-vs-number mismatch). So:

- **Trigger removal is safe in isolation, today**, with or without reader migration. It is a pure dead-write elimination — the only thing that changes is `profiles.tier` stops being updated by the payments path (revenuecat still updates it; nothing reads it usefully).
- The reader migration is a **separate correctness improvement** (the gates don't actually gate). It is not a prerequisite for trigger removal; it's its own bug.

---

## 6. Recommended path — **Path A**, sequenced

1. **(Separate, already in flight)** Tighten `payment_transactions` INSERT RLS to admin + service_role (Terminal 18/22/24). This closes the self-INSERT → `profiles.tier` escalation primitive regardless of the trigger.
2. **PR 1 — fix R1 (`stories/eligibility.ts`)**: replace the `profiles.tier` numeric read with the canonical entitlement check (`premium_status` / entitlement). ~15–25 line diff, leaf file, has unit tests already (`eligibility` test exists).
3. **PR 2 — fix R2 (`mock-interview` edge fn)**: resolve premium from `subscriptions`/`premium_status`, drop the `tier` column from the select and the `ctx.tier >= 2` branch. ~20–30 lines across `index.ts` + `core.ts` + `_shared/mockInterviewRateLimit.ts`; tests exist.
4. **PR 3 — drop the trigger**: a single tracked migration `DROP TRIGGER IF EXISTS trg_sync_profile_tier_from_payment ON public.payment_transactions; DROP FUNCTION IF EXISTS public.sync_profile_tier_from_payment_transactions(); DROP FUNCTION IF EXISTS public.sync_profile_tier_from_latest_payment(uuid);` plus a comment noting the binding was previously SQL-Editor-only. ~10 lines. Independently safe.

**Why Path A over B:** "small diffs over smart diffs" + "checkpoint every risky step" (CLAUDE.md operating discipline). The trigger drop is a DDL change on a money table touched by other in-flight terminals (RLS work, stripe-dupe-fix, idempotency). Keeping the DDL in its own minimal PR — *after* the reader fixes prove green — means a payments-table migration never rides along with app-logic edits, and any one step reverts cleanly. Path B bundles a `payment_transactions` DDL change with app edits for no benefit (the steps aren't actually coupled — see §5).

**Why not Path C:** the gates are silently non-functional (R1 never blocks free users from the testimonial ask; R2's paid bypass is dead). That is a real product bug, not just cosmetic debt — documenting and walking away leaves two broken gates plus a latent escalation footgun.

---

## 7. Risk assessment

| Path | Primary risk | Likelihood | Mitigation |
|---|---|---|---|
| A | A reader PR ships with a wrong canonical-source mapping (e.g. trial vs paid) | Low–Med | Both readers have existing test suites; mirror the already-correct client gate `MockInterviewRoom.tsx:68` |
| A | Trigger-drop migration races another terminal's `payment_transactions` migration | Low | Sequence it last, after RLS lands; idempotent `DROP … IF EXISTS`; rebase on latest main |
| B | DDL + app edits in one PR — partial revert impossible if reader logic is wrong but RLS depends on the merge | Med | (Avoid — choose A) |
| B | Larger blast radius on a money table during active multi-terminal billing work | Med | (Avoid — choose A) |
| C | Two gates remain non-functional; if someone later "fixes" a reader to parse text tiers *without* fixing RLS/trigger, the self-INSERT escalation goes live | Med (latent) | Don't choose C |
| All | `revenuecat-webhook` keeps writing `profiles.tier` after trigger removal | N/A (expected) | Document `profiles.tier` as IAP-only legacy cache, no reader |

Lowest residual risk + smallest reversible diffs: **Path A.**

---

## 8. Estimated PR count & size

| Path | PRs | Total LOC (approx) | Largest single diff |
|---|---|---|---|
| **A (recommended)** | 3 (R1 fix · R2 fix · trigger-drop migration) | ~55–75 | R2 (~25–30, spans 3 files) |
| B | 1 | ~55–75 | the whole PR (app edits + DDL on payment_transactions) |
| C | 0 code (1 NORTH_STAR/debt-log note) | ~5 doc | n/a |

Trigger-drop migration on its own: **~10 lines**, zero runtime behavior change (verified §4).

---

## Appendix — verification commands run

- `git worktree add /tmp/MercyB-tier-trigger-recon -b tier-trigger-cleanup-recon origin/main`
- `grep` of `supabase/migrations/` for `CREATE TRIGGER` / `sync_profile_tier` → binding absent
- `supabase db dump --linked --schema public` → prod schema (line 17693 = live binding; line 6945 = `tier text`; lines 6056/6010 = both fns)
- Full reads: `eligibility.ts`, `mock-interview/{index,core}.ts`, `_shared/mockInterviewRateLimit.ts`, `me-entitlement/index.ts`, `recomputeAndPersistEntitlement.ts`, `revenuecat-webhook/index.ts`
- Cross-checked `RECON-stripe-audit.md` (§6 N1) and `RECON-me-entitlement.md` (refutes me-entitlement reads tier; flagged binding-needs-live-verify → now verified here)

*No files modified. No PR opened. Recon-only.*
