-- ============================================================================
-- ⛔ NON-CANONICAL — REFERENCE SNAPSHOT ONLY. DO NOT APPLY.
--
--   Renamed/relocated by B36 (2026-05-19) into the B29 reports/REMEDIATION-*
--   namespace (PR #776 convention) so it survives `git worktree prune`. Body
--   below is B21's VERBATIM remediation SQL — unaltered.
--
--   STATUS:    HANDOFF ONLY. NOT EXECUTED. A94's reconciled stale-subscription
--              cleanup SQL is CANONICAL (chat decision 2026-05-19); this block
--              is kept only as a cross-checkable second view of the same two
--              PKs. Reconcile against A94's, apply ONCE via the Supabase SQL
--              Editor, human-reviewed. Never `supabase db push`. No unattended
--              SQL path to this Supabase. Verified 2026-05-19: neither applied
--              (U1/U2 still status='active', updated_at unchanged 2026-04-09).
--   EVIDENCE:  reports/RECON-failed-deletion-events-B21.md (the PK list and
--              gift-safety are justified there; do not trust this standalone).
--   SCOPE:     U1 c3496ebe-e584-4c3c-a92a-1d2a32a69072 (04c57155…),
--              U2 03fb832c-81d8-426f-b73c-e899fc4eeaae (397a6ab7…).
--   EXCLUDED:  evt_1TUxM52K1tPxy04udiaKvPJL (2026-05-08T22:58:53Z) —
--              UNKNOWABLE, unattributable from every DB/Sentry source;
--              resolve by hand via Stripe Dashboard. Deliberately not here.
--   INDEPENDENT ENTITLEMENTS: U1 has a public.user_subscriptions gift comp
--              (is_gift_redemption=true, 2030→2031) — a DIFFERENT table,
--              structurally untouched by the UPDATEs below. U2 has none.
--   B29 NOTE:  the B29 BEGIN/ROLLBACK→COMMIT wrapper is intentionally NOT
--              applied here — this is a non-apply reference; the apply
--              candidate is A94's SQL, which carries the wrapper. B21's
--              executable text is preserved unmodified for forensic fidelity.
-- ============================================================================

-- ============================================================================
-- B21 — Remediation for STILL-PHANTOM failed customer.subscription.deleted
--       webhook events (2026-05-08/09 "[object Object]" defect, pre-PR #561).
--
-- STATUS: HANDOFF ONLY. NOT EXECUTED by B21. Read-only diagnostic produced it.
--
-- ⚠️ OWNERSHIP: U1 (04c57155) and U2 (397a6ab7) are A94's owned remediation
--    scope (branch a94/stale-sub-rows-cleanup). A94's cleanup SQL has NOT yet
--    been applied to prod (verified 2026-05-19: both rows still status='active',
--    canceled_at NULL, updated_at unchanged since 2026-04-09). This block is
--    provided so Chau has ONE consolidated, verified view — reconcile against
--    A94's SQL and apply ONCE via the Supabase SQL Editor. Do NOT double-apply.
--
-- Pattern: PK-keyed + provider/subscription guard + idempotent (only flips a
-- still-'active' row). Gift entitlements live in a DIFFERENT table
-- (public.user_subscriptions, is_gift_redemption=true) and are structurally
-- untouched — U1 keeps its 2030→2031 gift comp; this only corrects the stale
-- Stripe mirror row. The deleted-handler maps to status='revoked'
-- (stripe-webhook/webhook-events.ts:617); canceled_at/ended_at set to the
-- Stripe period_end (best available proxy — the event payload was not stored,
-- stripe_webhook_events has no payload column).
-- ============================================================================

-- ---- 0. VERIFY BEFORE (expect 2 rows, both status='active') ---------------
SELECT id, user_id, provider, status, provider_subscription_id,
       current_period_end, canceled_at, ended_at, updated_at
FROM   public.subscriptions
WHERE  id IN ('c3496ebe-e584-4c3c-a92a-1d2a32a69072',   -- U1
              '03fb832c-81d8-426f-b73c-e899fc4eeaae');   -- U2

-- ---- 1. U1 — 04c57155 (chaudoanproton@proton.me) -------------------------
--      failed event evt_1TUz732K1tPxy04uz1zfCXKV @ 2026-05-09T00:51:28Z
--      (fired 52s after period_end 2026-05-09T00:50:36Z → strong match)
UPDATE public.subscriptions
SET    status      = 'revoked',
       canceled_at = '2026-05-09T00:50:36+00:00',
       ended_at    = '2026-05-09T00:50:36+00:00',
       updated_at  = now()
WHERE  id                       = 'c3496ebe-e584-4c3c-a92a-1d2a32a69072'
  AND  provider                 = 'stripe'
  AND  provider_subscription_id = 'sub_1TK6no2K1tPxy04urxSq7DAL'
  AND  status                   = 'active';   -- idempotency guard; expect 1 row

-- ---- 2. U2 — 397a6ab7 (chaudoan@yahoo.com) -------------------------------
--      failed event evt_1TUzYp2K1tPxy04uWOBxRjGW @ 2026-05-09T01:20:10Z
--      (fired 43s after period_end 2026-05-09T01:19:27Z → strong match)
--      No user_subscriptions row exists for U2 — no gift to preserve.
UPDATE public.subscriptions
SET    status      = 'revoked',
       canceled_at = '2026-05-09T01:19:27+00:00',
       ended_at    = '2026-05-09T01:19:27+00:00',
       updated_at  = now()
WHERE  id                       = '03fb832c-81d8-426f-b73c-e899fc4eeaae'
  AND  provider                 = 'stripe'
  AND  provider_subscription_id = 'sub_1TK7Fj2K1tPxy04uV17yVd7K'
  AND  status                   = 'active';   -- idempotency guard; expect 1 row

-- ---- 3. VERIFY AFTER (expect 2 rows, both status='revoked') --------------
SELECT id, user_id, status, canceled_at, ended_at, updated_at
FROM   public.subscriptions
WHERE  id IN ('c3496ebe-e584-4c3c-a92a-1d2a32a69072',
              '03fb832c-81d8-426f-b73c-e899fc4eeaae');

-- NOTE: NO remediation for evt_1TUxM52K1tPxy04udiaKvPJL (2026-05-08T22:58:53Z).
--       UNKNOWABLE — unattributable from every DB/Sentry source. Resolve via
--       Stripe Dashboard → Developers → Events → that event id → read
--       data.object.customer + .subscription, then map to a row by hand.
