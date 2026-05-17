# RECON — Stripe webhook idempotency race (check-then-insert)

**Agent:** stripe-idempotency-agent
**Branch:** `stripe-webhook-idempotency` (off `origin/main` @ `68855a29`)
**Date:** 2026-05-17
**Source finding:** `RECON-stripe-audit.md` (branch `stripe-payment-audit`) — **N4 (HIGH)**, related **N10 (LOW)**
**Status:** Phase 1 recon — **no code changed, no push**. Awaiting approval for Phase 2.

---

## 1. TL;DR

- The race is **real and present in current `origin/main` code**. Verified by reading the live handler (locked #5).
- **Active endpoint = `stripe-webhook` (v1).** `stripe-webhook-v2` is **dormant and NOT registered** in `supabase/config.toml`, uses an older SDK, has no tests, and its top-of-file comment is even mislabeled `// supabase/functions/stripe-webhook/index.ts`.
- **v2 does NOT fix the race.** It has the *same* check-then-process TOCTOU, merely with one extra read-only `hasProcessedEntitlementEvent` check (the audit's "dual-guard"). "Migrate to v2" is **not** a valid fix — v2 is neither correct nor active.
- **Recommendation: fix v1 in place** with an atomic `INSERT … ON CONFLICT DO NOTHING` claim-before-process, + an idempotent tracked migration codifying the `event_id` unique constraint (currently DB-drift, untracked). Separately recommend deleting v2 (N10 cleanup) — flagged, **not** bundled.
- **Key risk to design carefully:** claim-first must remain *reclaimable on processing failure*, or a transient error permanently blocks Stripe's legitimate retry and silently drops a real subscription grant. This is higher-severity than the race itself if mishandled.

---

## 2. v1 current code — race condition highlighted

`supabase/functions/stripe-webhook/index.ts`, request handler:

```ts
// L316 — CHECK (a plain SELECT)
const alreadyProcessed = await hasStripeWebhookEventBeenProcessed(supabase, event.id);
if (alreadyProcessed) {
  return json({ ok: true, duplicate: true }, 200);   // L321-323
}

switch (event.type) {                                  // L325 — PROCESS (side-effects)
  case "checkout.session.completed":
    await handleCheckoutSessionCompleted({ ... markStripeWebhookEventProcessed });
  // ...
}
```

`hasStripeWebhookEventBeenProcessed` (L172-195) = `select event_id … eq(event_id).maybeSingle()` — a pure read.

The idempotency row is written **only at the very end**, inside the handler, via the
`markStripeWebhookEventProcessed` callback → `upsertStripeWebhookEventResult` (L119-158):

```ts
await supabase.from("stripe_webhook_events")
  .upsert(payload, { onConflict: "event_id" });   // L135-137 — runs LAST, after grant
```

Side-effect ordering inside `processSubscriptionLikeEvent` (`webhook-events.ts` L399-516),
reached by every subscription event:

```
resolveUserByStripeLinkage            (read)
upsertSharedSubscriptionMonotonic     (L468) ── WRITES public.subscriptions  (the grant)
finalizeSubscriptionProcessing        (L498) ── recompute entitlements / tier (grant side-effect)
markProcessedWithLog → mark*Processed (L505) ── idempotency row written HERE, dead last
```

### The race window

Two concurrent deliveries of the **same `event.id`** (Stripe retries on a slow/▾200 response):

| t | Delivery A | Delivery B |
|---|------------|------------|
| 1 | `hasStripeWebhookEventBeenProcessed` → **false** (no row) | |
| 2 | | `hasStripeWebhookEventBeenProcessed` → **false** (A hasn't marked — mark is last) |
| 3 | `upsertSharedSubscriptionMonotonic` + `finalizeSubscriptionProcessing` (grant) | |
| 4 | | `upsertSharedSubscriptionMonotonic` + `finalizeSubscriptionProcessing` (**grant again**) |
| 5 | `markProcessed` upsert | `markProcessed` upsert (onConflict → silent overwrite, **no error**) |

**Why the existing `upsert(onConflict)` does not save us:**
1. supabase-js `.upsert(v, { onConflict })` with default `ignoreDuplicates:false` compiles to `ON CONFLICT … DO UPDATE` (merge), **not** `DO NOTHING` — no conflict signal.
2. Even as `DO NOTHING`, it runs **after** the grant — it cannot gate side-effects it follows.
3. Its return value is never used to decide whether to process.

**Honest severity nuance:** `upsertSharedSubscriptionMonotonic` is itself an upsert keyed on the
subscription tuple and "monotonic", so a duplicate *`subscriptions` row* is unlikely. But the
unprotected double-fire still hits: `finalizeSubscriptionProcessing` tier/entitlement recompute
runs twice; the `invoice.paid` path; and any non-idempotent downstream (emails, notifications).
Matches the audit's **HIGH** — real, partially cushioned by the monotonic subscription upsert,
**not** eliminated by it.

---

## 3. v2 status — dormant, NOT a fix

| | `stripe-webhook` (v1) | `stripe-webhook-v2` |
|---|---|---|
| In `supabase/config.toml` | ✅ `[functions.stripe-webhook]`, `verify_jwt=false`, entrypoint wired | ❌ **no `[functions.stripe-webhook-v2]` block, no `config.toml`** |
| supabase-js | `@supabase/supabase-js@2.49.1` | `@supabase/supabase-js@2.39.3` (older) |
| Last touched | 2026-05-07 ("fix(billing): restore Stripe webhook delivery") | 2026-04-15 (untouched since) |
| Tests | `__tests__/` present | none |
| File header | correct | mislabeled `// supabase/functions/stripe-webhook/index.ts` |
| Idempotency | check-then-process (1 read) | check-then-process (**2 reads**: `hasProcessedStripeWebhookEvent` + `hasProcessedEntitlementEvent`) |

v2's "dual-guard" is **two sequential SELECTs**, not an atomic claim — same TOCTOU class.
The only genuinely atomic primitive in the codebase is `markEntitlementEventProcessed`
(`billing.ts` L440-465: bare `.insert()` into `entitlement_events`, unique-violation `23505`
detected by `isDuplicateEventInsertError`) against the real index
`entitlement_events_provider_event_id_key` (migration `20260315211233`). **Neither v1 nor v2's
`index.ts` calls `markEntitlementEventProcessed` on the subscription path** — it is not wired
as the webhook idempotency anchor. So v2 buys nothing here.

**Conclusion:** v1 is the live, maintained endpoint. Fix v1. v2 is dead weight that confuses the
audit (N10) — recommend deleting it in a **separate** cleanup PR, not this one.

---

## 4. Idempotency table schema

`public.stripe_webhook_events` — shape from `types.ts` L140-160:

```
event_id     text     -- the idempotency key (PRIMARY KEY / UNIQUE in live DB)
created_at   timestamptz null
type         text null
livemode     boolean null
processed_at timestamptz null   -- null = claimed but not yet finished; set = completed
error        text null
```

**Constraint verification (brief step 3):**
- **No CREATE TABLE migration exists in the repo.** `grep -rl stripe_webhook_events supabase/migrations/`
  returns only `20260422020000_enable_rls_on_exposed_tables.sql`, which merely
  `ALTER TABLE … ENABLE ROW LEVEL SECURITY` — it *assumes* the table already exists.
- Table was created **manually via SQL Editor** → classic CLAUDE.md migration drift.
- The live `.upsert(..., { onConflict: "event_id" })` has been working in production
  (commits restoring webhook delivery, 2026-05-07). PostgREST `onConflict` / Postgres
  `ON CONFLICT` **require a matching unique index** or they error `42P10`. Since it works,
  a PK/unique on `event_id` **almost certainly exists in the live DB** — but it is
  **untracked**, an undocumented invariant the fix will now structurally depend on.

→ **The fix must add an idempotent, tracked migration** codifying the table + `event_id`
primary key (or unique index) + RLS — purely a no-op against prod, version-controlling the
invariant. This satisfies brief step 3 ("if not, that's part of the fix") even though the
constraint likely already exists: we make it guaranteed, not assumed.

---

## 5. Recommended fix — tighten v1 (atomic claim-before-process)

**Do NOT** roll a custom idempotency primitive. Use the DB unique constraint + `ON CONFLICT`.

### 5.1 Code (v1 `index.ts`)

Replace the read-only check at L315-323 with an **atomic claim**:

```ts
// Claim the event_id BEFORE any side-effect. Atomic: exactly one concurrent
// delivery wins the INSERT; the rest see the conflict and no-op with 200.
const claim = await supabase
  .from("stripe_webhook_events")
  .upsert(
    { event_id: event.id, type: event.type, livemode: ..., processed_at: null },
    { onConflict: "event_id", ignoreDuplicates: true },   // → ON CONFLICT DO NOTHING
  )
  .select("event_id");

// ignoreDuplicates:true returns ONLY rows actually inserted.
// Empty data ⟺ row already existed ⟺ another delivery owns it.
if (claim.error && !isMissingStripeWebhookEventsTable(claim.error)) throw claim.error;
const weClaimedIt = !isMissingStripeWebhookEventsTable(claim.error)
  && (claim.data?.length ?? 0) > 0;

if (!weClaimedIt && !isMissingStripeWebhookEventsTable(claim.error)) {
  return json({ ok: true, duplicate: true }, 200);   // someone else owns it — no-op
}
// else: we own it (or table missing → preserve current fail-open) → process
```

- Reuse the existing `isDuplicateEventInsertError` (`billing.ts`, code `23505`) /
  `isMissingStripeWebhookEventsTable` (PGRST205) helpers — **preserve the fail-open
  behavior when the table is missing** (current production-safety contract; do not regress it).
- `markStripeWebhookEventProcessed` (trailing upsert, `ignoreDuplicates:false` → DO UPDATE)
  **stays** — it now flips `processed_at` from null→now() as a *completion* marker, not the
  idempotency anchor. The error catch (L384-395) keeps writing `processed:false` + message.

### 5.2 Reclaimable-on-failure (the critical design point — needs your call)

Claim-first means: if processing **fails midway**, the claim row exists with
`processed_at IS NULL`. A Stripe retry would now be wrongly rejected as "duplicate" → a real
subscription grant is **permanently dropped**. Two safe options — **I recommend A**:

- **Option A (recommended):** on the *retryable* error path (the existing catch, when error is
  **not** `NonRetryableWebhookError`), `DELETE` the claim row before returning 500. Stripe
  retries → re-claims cleanly → reprocesses. Non-retryable errors leave the row (terminal).
  Smallest behavioral surface; mirrors v1's existing retryable/non-retryable split.
- **Option B:** treat `processed_at IS NULL AND error IS NOT NULL` rows as reclaimable in the
  claim step (conditional re-acquire). More logic in the hot path; more states to test.

This is a real semantic change to webhook retry behavior and a money path — **flagging for
explicit decision, not silently choosing** (locked #4).

### 5.3 Migration (idempotent, tracked)

New `supabase/migrations/<ts>_stripe_webhook_events_idempotency.sql`:

```sql
create table if not exists public.stripe_webhook_events (
  event_id     text primary key,
  created_at   timestamptz default now(),
  type         text,
  livemode     boolean,
  processed_at timestamptz,
  error        text
);

-- Belt-and-braces if the table pre-exists without the PK (drift):
do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.stripe_webhook_events'::regclass and contype = 'p'
  ) then
    alter table public.stripe_webhook_events
      add constraint stripe_webhook_events_pkey primary key (event_id);
  end if;
end $$;

alter table public.stripe_webhook_events enable row level security;
```

No-op against current prod (everything `if not exists` / guarded). **Human-reviewed before
applying** — do **not** `supabase db push` blind (CLAUDE.md migration-drift protocol).

---

## 6. Test plan

Existing tests are pure Deno units (`__tests__/parseWebhookSecrets.test.ts`,
`eventTypes.test.ts`). True cross-process concurrency can't be reproduced deterministically
without a live DB, but the **correctness lives in the claim helper's branching**, which is
fully unit-testable with a fake supabase client:

1. **First delivery wins** — fake client returns 1 inserted row → helper returns "claimed" →
   handler proceeds to process.
2. **Concurrent duplicate** — fake client returns empty `data` (ON CONFLICT DO NOTHING) →
   helper returns "not claimed" → handler returns `200 { duplicate: true }`, **zero
   side-effect calls** (assert `handleCheckoutSessionCompleted` spy not invoked).
3. **Table missing (PGRST205)** — helper preserves **fail-open** (process anyway), matching
   today's degradation contract — guard against accidental regression.
4. **Retryable failure → reclaimable** (if Option A): simulate handler throw (non-`NonRetryable`)
   → assert claim row `DELETE` issued → a re-delivered event re-claims and reprocesses.
5. Acceptance / manual integration (documented, not automated): fire two identical
   signed deliveries back-to-back at a local function instance; assert exactly one
   `subscriptions` upsert + one `finalize`.

Test added under `supabase/functions/stripe-webhook/__tests__/idempotencyClaim.test.ts`,
runnable via the same Deno test harness as the existing two.

---

## 7. Risk assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **Poisoned claim blocks Stripe retry** → permanently dropped real grant | **HIGH** (worse than the race if mishandled) | §5.2 Option A: delete claim on retryable failure; comprehensive test #4 |
| Behavior change: duplicates now rejected *earlier* (pre-grant vs post-grant) | MEDIUM | Intended — that's the fix; net safer. Documented in PR. |
| Missing-table fail-open regressed | MEDIUM | Explicitly preserved + test #3 |
| Migration drift: live table differs from assumed shape | LOW | All-`if not exists` + PK-guard `do $$` block; human review before apply |
| Touching money path | per locked #4 | Phase 1 recon only; explicit approval before Phase 2 push |
| Collision with `origin/fix/stripe-duplicate-subscription` (N2) | **None** | Verified: that branch diffs only `src/lib/billing.ts` + `billing-stripe-change-plan/index.ts`; **zero** lines in `supabase/functions/stripe-webhook/`. Different territory (checkout-flow guard vs webhook table race). I will not touch their files. |

**Preflight (memory):** `git fetch` done; no `stripe-webhook-idempotency` branch/worktree
pre-existed; no idempotency-race fix in `git log`; dupe-fix worktree parked at main HEAD,
not diverged on this path.

---

## 8. Phase 2 plan (after approval)

1. Add idempotent migration (§5.3).
2. Add `claimStripeWebhookEvent` helper + rewire v1 handler (§5.1), preserving fail-open.
3. Implement chosen reclaim strategy (§5.2 — **need decision: A or B**).
4. Add `idempotencyClaim.test.ts` (§6 cases 1-4).
5. Gates: `npm run typecheck:ci`, `npm run lint`, Deno tests green.
6. Single PR per locked #16. PR body explains the race, the fix, the reclaim semantics,
   references `RECON-stripe-audit.md` N4/N10.
7. (Separate, flagged not bundled) recommend deleting `stripe-webhook-v2` — N10 cleanup.

**Open question for you (blocks Phase 2 start):** §5.2 — **Option A** (delete claim on
retryable failure; recommended) or **Option B** (reclaimable-stale-row logic)?
