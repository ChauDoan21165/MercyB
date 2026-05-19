# RECON — STILL-PHANTOM failed `customer.subscription.deleted` events (B21)

> **RETROACTIVE CAPTURE — authored by B36 (2026-05-19)** under the recon-doc
> convention (B16, PR #768). B21 ran the original read-only live forensic and
> produced three uncommitted worktree artifacts — `B21-remediation.sql`,
> `b21-probe.mjs`, `b21-probe2.mjs` — and **no committed recon doc**. One
> `git worktree prune` would have destroyed all three (same failure mode as
> A77/B5, one dispatch generation later). This doc is the durable extraction
> of the SQL header narrative + per-event status table; the probe scripts and
> the (renamed) remediation SQL are committed alongside it. **No prod
> re-query was performed by B36.** Every value below is quoted verbatim from
> B21's own committed `b21-probe.mjs` / `b21-probe2.mjs` / remediation SQL.
>
> Branch: `b21/failed-deletion-events` · Labels: stale-audit-note,
> money-path, silent-failure · Pairs with:
> `reports/REMEDIATION-stripe-deletion-events-B21.sql`.

## Verdict

The pre-PR-#561 `[object Object]` webhook defect produced **two STILL-PHANTOM
`public.subscriptions` rows** (U1 `04c57155…`, U2 `397a6ab7…`) — both still
`status='active'` with `canceled_at` NULL and `updated_at` unchanged since
2026-04-09 as of B21's 2026-05-19 read, plus **one UNKNOWABLE event**
(`evt_1TUxM52K1tPxy04udiaKvPJL`, 2026-05-08T22:58:53Z) unattributable from
every DB/Sentry source. **Net paying-customer impact: zero** — U1 is
independently entitled by a `user_subscriptions` gift comp (2030→2031); U2
(`chaudoan@yahoo.com`) is a founder/test identity with no gift and no paid
exposure. Remediation is **A94's owned scope and A94's reconciled SQL is
canonical** (per the chat decision); B21's SQL is a consolidated
reference-only snapshot, **not** an apply candidate.

## Evidence

All quoted verbatim from B21's committed probe scripts and remediation SQL
(no re-run). Probe queries are `@supabase/supabase-js` reads against prod
`buemdfxyhxunzpgdoqin`, service-role key passed as `argv[2]`, **read-only**.

### Per-event status table (from `B21-remediation.sql` header + probe2)

| # | User | Identity | `subscriptions.id` | `provider_subscription_id` | Failed event | Event ts | period_end | Independent entitlement | Status (B21, 2026-05-19) |
|---|---|---|---|---|---|---|---|---|---|
| U1 | `04c57155-b479-4615-bb78-d036bb91dbf2` | `chaudoanproton@proton.me` | `c3496ebe-e584-4c3c-a92a-1d2a32a69072` | `sub_1TK6no2K1tPxy04urxSq7DAL` | `evt_1TUz732K1tPxy04uz1zfCXKV` | 2026-05-09T00:51:28Z (52s after period_end) | 2026-05-09T00:50:36Z | **gift comp in `user_subscriptions`, 2030→2031** — structurally untouched | STILL-PHANTOM (`status='active'`) |
| U2 | `397a6ab7-1d3a-480f-9f02-9021a438d02a` | `chaudoan@yahoo.com` | `03fb832c-81d8-426f-b73c-e899fc4eeaae` | `sub_1TK7Fj2K1tPxy04uV17yVd7K` | `evt_1TUzYp2K1tPxy04uWOBxRjGW` | 2026-05-09T01:20:10Z (43s after period_end) | 2026-05-09T01:19:27Z | **none** (no `user_subscriptions` row) | STILL-PHANTOM (`status='active'`) |
| — | (unattributable) | — | — | — | `evt_1TUxM52K1tPxy04udiaKvPJL` | 2026-05-08T22:58:53Z | — | — | **UNKNOWABLE** — resolve via Stripe Dashboard → Developers → Events |
| ctrl | `cd9b889c-eb9f-428f-9462-de66d4f92c04` | `mylinh.nutrition@gmail.com` (B5) | — | — | — | — | renewed 2026-05-09T07:18 | — | **NOT a deletion failure** — B5 renewal field-order bug, control row only |

### Verbatim attribution queries (from `b21-probe.mjs`)

The full failed-event population was derived not from partial brief IDs but
from data — five independent sweeps of `stripe_webhook_events`:

```js
// 2)  ALL events 2026-05-06 .. 2026-05-12, ordered by created_at
// 2b) processed_at IS NULL since 2026-05-01
// 2c) error NOT NULL since 2026-05-01
// 2d) type = 'customer.subscription.deleted' since 2026-04-15
```

Attribution was by **period-end timing correlation** against
`public.subscriptions` (the failed `deleted` events left no
`entitlement_events` row — probe step 5b expects 0 — and
`stripe_webhook_events` has no payload column, so the deletion was provably
never applied). The gift-safety guard is `b21-probe2.mjs` step
`user_subscriptions GIFT/MANUAL guard` per user: U1 returns the
2030→2031 comp row; U2 returns 0 rows.

### Remediation SQL (B21's, now `reports/REMEDIATION-stripe-deletion-events-B21.sql`)

PK-targeted, provider/subscription-guarded, idempotent (only flips a
still-`active` row to `revoked`; `canceled_at`/`ended_at` set to the Stripe
`period_end` proxy because the event payload was never stored). The
deleted-handler maps to `status='revoked'`
(`stripe-webhook/webhook-events.ts:617`). Gift entitlements in
`public.user_subscriptions` (`is_gift_redemption=true`) are a different
table and are structurally untouched — U1 keeps its comp.

## Root cause

By CLAUDE.md layer separation: an **external-integration + data-shape**
defect, not loading / rendering / permissions.

1. **Pre-#561 `[object Object]` serialization** made the failures
   undiagnosable for ~2 weeks (fixed; PR #561 idempotency hardening).
2. **The failure path is a forensic black hole by design** — on a handler
   throw the claim row is released/deleted (so Stripe's legitimate retry is
   not re-blocked), the throw precedes the `subscriptions` upsert, and
   `stripe_webhook_events` has no payload column. A failed delivery
   therefore exists in **no** durable table; B21 could only attribute it
   indirectly via period_end timing — hence the thin, non-reproducible
   evidence. (Structural fix is owned by
   `reports/RECON-A96-webhook-forensics-scoping.md`, not B21.)
3. **Residual phantom rows.** The two deletion events partially applied:
   the delete side-effect failed, leaving orphan `subscriptions` rows that
   no later event reconciled (U1, U2 — verified still phantom).

## Impact

- **Paying-customer impact: zero.** U1's entitlement is satisfied by the
  gift comp regardless of the stale Stripe mirror row; U2
  (`chaudoan@yahoo.com`) is a founder/test identity with no gift and no
  paid exposure.
- **Data-integrity impact: 2 stale `subscriptions` rows** advertising
  `status='active'` for cancelled Stripe subscriptions — exactly the class
  any numeric tier/`subscriptions`-status reader would mis-trust (cf.
  `project_room_tier_db_corruption`, B25's `tier >= N` gate).
- **One UNKNOWABLE event** with no remediation possible from any DB source.

## Fix recommendation

1. **Do NOT apply B21's SQL.** Per the chat decision, **A94's reconciled
   stale-subscription cleanup SQL is canonical**;
   `reports/REMEDIATION-stripe-deletion-events-B21.sql` is preserved as a
   cross-checkable reference snapshot only (it is bannered NON-CANONICAL).
   Reconcile against A94's block and apply **once** via the Supabase SQL
   Editor, human-reviewed — there is no unattended SQL path to this
   project. As of B21's 2026-05-19 read **neither** had been applied (both
   rows still `status='active'`).
2. **`evt_1TUxM52K1tPxy04udiaKvPJL`** — resolve by hand via Stripe
   Dashboard → Developers → Events → read `data.object.customer` +
   `.subscription`, map to a row. No DB path exists.
3. **Structural blindness** → route to
   `reports/RECON-A96-webhook-forensics-scoping.md` (separate decision).

## Worktree disposition

`prune` — B21's three artifacts are now committed on this branch (this doc,
the renamed remediation SQL, both probe scripts). The conclusions are fully
captured; the remediation is superseded by A94's canonical SQL. Nothing in
`/private/tmp/B21-failed-deletions` is irreplaceable once this commit lands.
