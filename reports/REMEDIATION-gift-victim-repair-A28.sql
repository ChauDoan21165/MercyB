-- ============================================================================
-- A28 — Remediation: gift-code silent-failure VICTIMS — re-grant the burned
--   entitlement (companion to PR #787 which fixed the bug going FORWARD only;
--   every historical victim still has a consumed gift_codes code and ZERO
--   honored entitlement). This block grants each victim exactly the gift
--   their burned code encoded: gift_codes.tier for 1 year from used_at.
--
--   STATUS:    HANDOFF ONLY. NOT EXECUTED by A28. A read-only diagnostic
--              (A13) produced the victim list; this is the SPECIFICATION of
--              the corrective write, NOT a runnable block until every
--              ‹PLACEHOLDER› victim row is transcribed from a fresh,
--              human-reviewed run of A13's Query 1. Apply ONCE via the
--              Supabase SQL Editor, human-reviewed. Never `supabase db
--              push`. Never an agent. There is no unattended SQL path to
--              this Supabase (CLAUDE.md → Supabase; memory
--              project_db_schema_drift_audit / project_578_rls_applied /
--              project_agent_infra_access).
--
--   EVIDENCE:  reports/AUDIT-gift-victims-A13.sql  (the victim list — Query
--              1 — is the ONLY source of the user_ids below; do NOT trust
--              this .sql standalone, run A13 Q1 first). Convention:
--              docs/agent-briefs/sql-remediation-convention.md (B29 — the
--              seven mandatory parts). Structural exemplar:
--              reports/REMEDIATION-mylinh-paid-but-free-B5.sql (A2 — GATE +
--              RECOVERABLE/NOT-RECOVERABLE + GREATEST never-shorten guard).
--              Code grounding for every column/value below:
--                - the bug + read predicate:
--                  src/lib/gift/fetchActiveGiftSubscription.ts (honors a
--                  row ONLY where status='active' AND is_gift_redemption
--                  =true AND current_period_end > now()).
--                - the buggy write path (omits is_gift_redemption ⇒ DB
--                  DEFAULT false ⇒ invisible row + burned code):
--                  supabase/functions/redeem-gift-code/index.ts:130-141
--                  (delete-then-insert) and the +1yr duration L92-93
--                  (end.setFullYear(+1)).
--                - the CORRECT sibling writer (mirrored here): RPC
--                  public.redeem_access_code_atomic, migration
--                  20260510020000_fix_gift_subscription_constraint.sql
--                  step 5 — it sets is_gift_redemption=true on BOTH its
--                  UPDATE and INSERT and stacks on any later existing
--                  period (v_start := v_existing_period_end). The
--                  GREATEST() below reproduces that never-shorten stack.
--                - user_subscriptions DDL + UNIQUE(user_id):
--                  20251020094557_3ba06735-...sql:24-35.
--                - the CHECK that made the bug fatal:
--                  20260510020000 step 2 — `active_requires_stripe_for
--                  _paid_tiers`: an active paid-tier row with NO
--                  stripe_subscription_id is REJECTED unless
--                  is_gift_redemption=true. Setting is_gift_redemption
--                  =true is therefore BOTH the visibility fix AND what
--                  makes the row constraint-legal. Every write below sets
--                  it true; an INSERT without it would be re-rejected
--                  exactly as the original bug was.
--
--   SCOPE:     N victims (N = the row count of A13 Query 1 at apply time;
--              ~100-user cohort ⇒ small N). EXACTLY ONE entitlement table
--              is written: public.user_subscriptions. One write per victim
--              user_id, keyed on the exact uuid transcribed from A13 Q1
--              (B29 part-1 PK-targeting: the VALUES list IS the enumerated
--              exact-key set — it can only touch a user_id Chau typed in;
--              it is NOT a predicate sweep; A94-vs-A77 hazard avoided).
--              user_subscriptions has UNIQUE(user_id) ⇒ user_id is a
--              one-row key, so `WHERE us.user_id = v.user_id` is
--              exactly-one-row targeting.
--
--   TWO DISJOINT VICTIM CLASSES (from A13 Q1 `failure_mode`), handled by
--   two separate VALUES lists so the human classifies each row by hand:
--     • PART B1 UPDATE  ← failure_mode = 'is_gift_redemption=false (THE
--       #787 fingerprint)'. The row EXISTS; only the flag (and possibly a
--       stale period) is wrong. SQL re-asserts the classification with
--       `AND us.status='active' AND us.is_gift_redemption=false` so a
--       mis-transcribed non-active row is a 0-match no-op, not a forced
--       grant.
--     • PART B2 INSERT  ← failure_mode = 'no_subscription_row
--       (deleted/never persisted)'. No row exists (the buggy INSERT was
--       rejected by the CHECK above, or a later path deleted it). Mirrors
--       the correct sibling writer's INSERT; NOT EXISTS-guarded so it
--       cannot violate UNIQUE(user_id) and a re-run is a no-op.
--
--   EXCLUDED (rows A13 Q1 surfaces but this block deliberately does NOT
--             write — surfaced in PREVIEW for a human go/stop, A2 GATE-3
--             discipline: never fabricate an entitling state):
--           - failure_mode 'status=<x> (not active)'  — the gift row
--             exists but is cancelled/expired/past_due. Forcing
--             status='active' here would FABRICATE entitlement and could
--             stomp a deliberate revoke. Out — resolve per-row by hand.
--           - failure_mode 'expired/no period_end' — an is_gift_redemption
--             =true, active row whose period simply ELAPSED. That is a
--             naturally-expired prior gift, not a #787 silent failure;
--             re-granting it is a renewal decision, not an incident
--             repair. Out.
--           - failure_mode 'other — inspect manually'. Out.
--           - any victim whose A13 Q1 `intended_tier_id_besteffort` is
--             NULL (gift tier not found in subscription_tiers ⇒
--             tier_not_configured). The INSERT needs a NOT NULL tier_id;
--             a NULL one is a separate defect. Out — do NOT guess a tier.
--           - public.subscriptions / public.profiles.premium_* (the
--             Stripe entitlement pair) — a DIFFERENT mechanism in
--             DIFFERENT tables. The gift entitlement is read 100% from
--             public.user_subscriptions by fetchActiveGiftSubscription.ts;
--             the live gift write path (redeem-gift-code) NEVER writes
--             profiles. So neither does this block (step-8 "profiles
--             re-grant follows the live code path" ⇒ for the GIFT path
--             the live path writes no profiles row; smallest safe diff).
--           - public.user_tiers — the live gift path also upserts it, but
--             grep-confirmed it is WRITE-ONLY/vestigial: no entitlement
--             read in src/** or supabase/functions/** consults user_tiers.
--             Zero user-felt effect. Optional mirror documented in PART C,
--             default OFF (A2 "we did not bolt on extra writes" honesty).
--
--   INDEPENDENT-ENTITLEMENT GUARD (B29 part 2): the only entitlement table
--           touched is public.user_subscriptions. A victim independently
--           entitled by Stripe is entitled via public.subscriptions +
--           public.profiles.premium_* — different tables, structurally
--           untouched here. The period write is
--           GREATEST(used_at+1yr, existing current_period_end) so it can
--           ONLY move the gift period FORWARD — it can never shorten a
--           longer entitlement the user already holds in
--           user_subscriptions from any other path. status is NEVER
--           written, so the subscription state machine cannot be
--           downgraded or fabricated. PART B2's NOT EXISTS prevents
--           overwriting any pre-existing row. (A13 Q1's own NOT EXISTS
--           already excludes anyone with a currently-honored gift sub,
--           so double safety.)
--
--   INDEPENDENCE GUARD — why this CANNOT grant access incorrectly
--   (step 9, stated explicitly):
--     (a) Entitlement path written: public.user_subscriptions ONLY — the
--         exact table+predicate fetchActiveGiftSubscription.ts reads. No
--         other gating surface is touched.
--     (b) Cannot grant to a WRONG user: every write is keyed to an exact
--         user_id transcribed from A13 Q1, whose user_id = gift_codes
--         .used_by = the real redeemer. The all-zero sentinel rows match
--         0 users by design — an un-edited paste grants nobody anything.
--     (c) Cannot grant MORE than owed: tier_id = the gift's own resolved
--         subscription_tiers id (A13 Q1 intended_tier_id_besteffort = the
--         redeem function's own resolution); period = used_at + 1 year
--         (the function's hard-coded duration). Every value is sourced
--         from the gift_codes row, never invented.
--     (d) Cannot grant when it SHOULDN'T: non-active rows are excluded
--         (no fabricated entitling state); the `is_gift_redemption=false`
--         guard confines PART B1 to the exact #787 fingerprint and makes
--         a re-run a 0-row no-op.
--     (e) RLS is irrelevant (SQL Editor runs as postgres); the
--         profiles-freeze trigger (20260614000000) is irrelevant — this
--         block never touches profiles.
--
--   ── PERIOD-END (flagged, NOT silently reconciled — A2/B12 discipline) ──
--   Code-faithful corrected period = used_at + interval '1 year' (the
--   redeem function hard-codes end.setFullYear(+1) from redemption time).
--   That is this block's DEFAULT (derived in-SQL from the transcribed
--   redeemed_at, so it cannot drift from a hand-typed period). CAVEAT:
--   a victim who redeemed > 1 year ago has used_at+1yr ALREADY IN THE
--   PAST — flipping the flag alone leaves them still unentitled (the read
--   path needs current_period_end > now()), which CONTRADICTS the A13
--   outreach promise ("the full duration the gift was meant to give you
--   (1 year)"). PREVIEW PART A flags exactly these victims
--   (`code_faithful_already_expired`). Whether to give them a goodwill
--   "1 year from activation" instead is a Chau product decision, NOT a
--   silent reconciliation — see GATE step 4. The block does NOT choose
--   generosity for you; default = code-faithful.
--
--   ┌──────────────────────────────────────────────────────────────────┐
--   │ >>> GATE — DO NOT FLIP ROLLBACK→COMMIT UNTIL ALL 5 ARE DONE <<<    │
--   ├──────────────────────────────────────────────────────────────────┤
--   │ 1. Run reports/AUDIT-gift-victims-A13.sql QUERY 1 in the SQL      │
--   │    Editor. For EACH returned row, read `failure_mode`:            │
--   │      • 'is_gift_redemption=false (THE #787 fingerprint)'          │
--   │           → add a VALUES row to victims_update (PART B1):         │
--   │             (user_id, redeemed_at, intended_tier_id_besteffort).  │
--   │      • 'no_subscription_row (deleted/never persisted)'            │
--   │           → add a VALUES row to victims_insert (PART B2):         │
--   │             (user_id, redeemed_at, intended_tier_id_besteffort).  │
--   │      • anything else (status=… / expired / other / NULL tier)    │
--   │           → DO NOT add it anywhere. Resolve by hand. Note it.     │
--   │    Delete the all-zero SENTINEL row from each list ONLY after you │
--   │    have added ≥1 real row to that list. A list left at the        │
--   │    sentinel is a safe 0-row no-op (do not delete the sentinel if  │
--   │    that class has no victims — leave the whole list as sentinel). │
--   │ 2. Run PART A PREVIEW (under ROLLBACK). Confirm: every            │
--   │    victims_update row has live status='active' AND               │
--   │    is_gift_redemption=false AND live tier_id = the transcribed    │
--   │    intended_tier_id (if tier_id diverges → that row is a          │
--   │    different defect: remove it from victims_update). Confirm      │
--   │    every victims_insert row truly has NO user_subscriptions row.  │
--   │ 3. Confirm row counts: PART D VERIFY shows exactly the           │
--   │    transcribed victims reached status='active' +                 │
--   │    is_gift_redemption=true + period>now(); the GUARD select       │
--   │    shows no OTHER user_id changed.                                │
--   │ 4. Period decision: in PREVIEW A, for any victim flagged          │
--   │    `code_faithful_already_expired = true`, decide goodwill vs     │
--   │    code-faithful. DEFAULT (do nothing) = code-faithful            │
--   │    (used_at+1yr, may already be past = no usable access). To      │
--   │    instead give a full year from activation for THOSE victims,    │
--   │    swap the marked expression in PART B1/B2 (one line, clearly    │
--   │    annotated) — a deliberate edit, never automatic.               │
--   │ 5. Only with 1–4 done: change the single final `ROLLBACK;` to     │
--   │    `COMMIT;` and re-run ONCE.                                     │
--   └──────────────────────────────────────────────────────────────────┘
--
--   APPLY PATH: Supabase SQL Editor, ONCE, human-reviewed, after every
--   victim row is transcribed from a fresh A13 Q1 run and the GATE is
--   cleared. Never `db push`. Never an agent.
-- ============================================================================
--
-- RECOVERABLE vs NOT RECOVERABLE
-- -----------------------------------------------------------------------------
-- RECOVERABLE (sourced to committed code/evidence — used verbatim below):
--   * the read predicate that defines "honored": status='active' AND
--     is_gift_redemption=true AND current_period_end > now()
--     (fetchActiveGiftSubscription.ts:75-78).
--   * the gift duration: used_at + interval '1 year'
--     (redeem-gift-code/index.ts:92-93, end.setFullYear(+1)).
--   * the never-shorten stack: GREATEST(corrected, existing) mirrors the
--     sibling RPC's `v_start := v_existing_period_end` stacking
--     (20260510020000 step 5).
--   * the table + UNIQUE(user_id): 20251020094557_3ba06735-...sql:24-35.
--   * is_gift_redemption is BOTH the visibility fix and the CHECK
--     legality fix (20260510020000 step 2).
--
-- NOT RECOVERABLE (transcribe from a fresh, human-reviewed A13 Q1 run —
-- DO NOT GUESS, DO NOT INVENT victim user_ids; the sentinel stays a
-- sentinel until Chau fills it):
--   * each victim user_id            → A13 Q1 column `user_id`
--   * each victim redeemed_at        → A13 Q1 column `redeemed_at`
--   * each victim intended_tier_id   → A13 Q1 column
--                                      `intended_tier_id_besteffort`
--                                      (if NULL → EXCLUDED, see header)
--   * which class each victim is in  → A13 Q1 column `failure_mode`
--                                      (drives which VALUES list; GATE 1)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- VICTIM INPUT — fill from A13 Query 1 (GATE step 1). The first row of each
-- list is an ALL-ZERO SENTINEL: the nil uuid matches no real user, so an
-- un-edited paste writes NOTHING. Add one real VALUES row per victim of
-- that class; remove the sentinel only once that list has ≥1 real row.
-- Keep the explicit ::uuid / ::timestamptz casts on the first row.
-- ---------------------------------------------------------------------------
WITH
victims_update (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    -- SENTINEL — do not run against this; replace with real rows.
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , ( '‹victim user_id from A13 Q1 user_id›'::uuid,
    --     '‹A13 Q1 redeemed_at›'::timestamptz,
    --     '‹A13 Q1 intended_tier_id_besteffort›'::uuid )   -- one per #787-fingerprint victim
),
victims_insert (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    -- SENTINEL — do not run against this; replace with real rows.
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , ( '‹victim user_id›'::uuid,
    --     '‹A13 Q1 redeemed_at›'::timestamptz,
    --     '‹A13 Q1 intended_tier_id_besteffort›'::uuid )   -- one per no_subscription_row victim
)

-- ---- PART A · PREVIEW (run first; nothing persists under ROLLBACK) ---------
-- A. UPDATE-class pre-state. EXPECT one row per victims_update entry.
--    Read off: live status (MUST be 'active' to be eligible — GATE 2),
--    live is_gift_redemption (MUST be false — the #787 fingerprint),
--    live tier_id vs transcribed intended_tier_id (MUST match — GATE 2),
--    and code_faithful_already_expired (period decision — GATE 4).
SELECT v.user_id,
       us.id                              AS user_sub_pk,
       us.status                          AS live_status,        -- expect 'active'
       us.is_gift_redemption              AS live_is_gift,       -- expect false
       us.tier_id                         AS live_tier_id,
       v.intended_tier_id                 AS transcribed_tier_id,-- expect = live_tier_id
       us.current_period_end              AS live_period_end,
       (v.redeemed_at + interval '1 year') AS code_faithful_end,
       ((v.redeemed_at + interval '1 year') <= now())
                                          AS code_faithful_already_expired -- GATE 4
FROM   victims_update v
LEFT JOIN public.user_subscriptions us ON us.user_id = v.user_id
WHERE  v.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;
-- expect: N_update rows, each live_status='active', live_is_gift=false,
--         live_tier_id = transcribed_tier_id. Any deviation → that victim
--         is a different defect; remove it from victims_update.

-- (Run the same shape for the INSERT class.)
SELECT v.user_id,
       (SELECT count(*) FROM public.user_subscriptions u
         WHERE u.user_id = v.user_id)     AS existing_rows,      -- expect 0
       v.intended_tier_id                 AS transcribed_tier_id,-- expect NOT NULL
       (v.redeemed_at + interval '1 year') AS code_faithful_end,
       ((v.redeemed_at + interval '1 year') <= now())
                                          AS code_faithful_already_expired -- GATE 4
FROM   victims_insert v
WHERE  v.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;
-- expect: N_insert rows, existing_rows=0, transcribed_tier_id NOT NULL.

-- ---- PART B · THE FIX -----------------------------------------------------

-- B1. UPDATE — un-hide the #787-fingerprint rows + extend to the intended
--     gift period. Sets ONLY: is_gift_redemption=true (visibility + CHECK
--     legality), current_period_end (never-shorten), updated_at. Does NOT
--     write status (must already be 'active' — the WHERE re-asserts the
--     A13 classification so a mis-typed non-active row is a 0-match
--     no-op). Does NOT write tier_id (the buggy insert set it correctly;
--     PREVIEW A confirms; smallest safe diff). Idempotency (B29 part 3):
--     `AND us.is_gift_redemption = false AND us.status = 'active'` ⇒ a
--     second run, or an already-fixed row, matches 0 rows.
WITH
victims_update (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , (... real victims_update rows — KEEP IDENTICAL to PART A ...)
)
UPDATE public.user_subscriptions us
SET    is_gift_redemption = true,
       current_period_end = GREATEST(
                              (v.redeemed_at + interval '1 year'), -- code-faithful (DEFAULT)
                              -- GATE 4 goodwill swap (deliberate, per-run):
                              -- replace the line above with:
                              --   GREATEST(v.redeemed_at + interval '1 year', now() + interval '1 year')
                              -- ONLY for the code_faithful_already_expired victims.
                              us.current_period_end                 -- never shorten
                            ),
       updated_at         = now()
FROM   victims_update v
WHERE  us.user_id              = v.user_id                  -- PK-class: exact uuid
  AND  v.user_id              <> '00000000-0000-0000-0000-000000000000'::uuid
  AND  us.status               = 'active'                   -- status truly supports it
  AND  us.is_gift_redemption   = false;                     -- idempotency + #787 fingerprint
-- expect: N_update rows (0 on a re-run / already-correct rows).

-- B2. INSERT — re-create the row the buggy path failed to persist. Mirrors
--     the CORRECT sibling writer (redeem_access_code_atomic INSERT,
--     20260510020000 step 5): is_gift_redemption=true is mandatory or the
--     active_requires_stripe_for_paid_tiers CHECK rejects it exactly as it
--     rejected the original. NOT EXISTS-guarded (B29 part 3): cannot
--     violate UNIQUE(user_id); a re-run is a 0-row no-op.
WITH
victims_insert (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , (... real victims_insert rows — KEEP IDENTICAL to PART A ...)
)
INSERT INTO public.user_subscriptions
       (user_id, tier_id, status, current_period_start,
        current_period_end, is_gift_redemption, updated_at)
SELECT v.user_id,
       v.intended_tier_id,
       'active',
       v.redeemed_at,
       GREATEST(
         (v.redeemed_at + interval '1 year'),                -- code-faithful (DEFAULT)
         -- GATE 4 goodwill swap (deliberate, per-run): replace with
         --   GREATEST(v.redeemed_at + interval '1 year', now() + interval '1 year')
         -- ONLY for code_faithful_already_expired victims.
         v.redeemed_at + interval '1 year'
       ),
       true,
       now()
FROM   victims_insert v
WHERE  v.user_id        <> '00000000-0000-0000-0000-000000000000'::uuid
  AND  v.intended_tier_id IS NOT NULL                        -- NOT NULL FK; NULL → EXCLUDED
  AND  NOT EXISTS (                                          -- idempotency + UNIQUE guard
         SELECT 1 FROM public.user_subscriptions u
         WHERE  u.user_id = v.user_id
       );
-- expect: N_insert rows (0 on a re-run).

-- ---- PART C · OPTIONAL live-code-path mirror (user_tiers) ------------------
-- The live gift path also `upsert`s public.user_tiers {user_id, tier,
-- updated_at}. Grep-confirmed it is WRITE-ONLY: no entitlement read in
-- src/** or supabase/functions/** consults user_tiers, so this has ZERO
-- user-felt effect on whether a victim is premium. Deliberately DEFAULT
-- OFF (CLAUDE.md "smallest safe change"; the load-bearing repair is
-- PART B). Enable ONLY if a separate decision wants byte-parity with the
-- live function's side write. (Left commented; `tier` is the human label
-- gift_codes.tier — fetch it alongside in A13 Q1 if you enable this.)
--
--   INSERT INTO public.user_tiers (user_id, tier, updated_at)
--   SELECT v.user_id, '‹gift_codes.tier label›', now()
--   FROM   victims_update v WHERE v.user_id <> '0000...'::uuid
--   ON CONFLICT (user_id) DO UPDATE
--     SET tier = EXCLUDED.tier, updated_at = now();
-- (Considered and rejected as default — documented, not bolted on.)

-- ---- PART D · VERIFY-AFTER (read before flipping to COMMIT) ----------------
WITH
victims_all (user_id) AS (
  -- Union of every transcribed victim user_id (both classes). KEEP the
  -- user_id list IDENTICAL to PART A's two lists (sentinel filtered out).
  VALUES ( '00000000-0000-0000-0000-000000000000'::uuid )
  -- , ('‹every transcribed victim user_id, update + insert classes›'::uuid)
)
-- D1. PRIMARY SUCCESS — every transcribed victim is now HONORED by the
--     exact read-path predicate (fetchActiveGiftSubscription.ts).
SELECT us.user_id,
       us.status,                                  -- expect 'active'
       us.is_gift_redemption,                       -- expect true
       us.tier_id,
       us.current_period_end,                       -- expect > now()
       (us.status = 'active'
        AND us.is_gift_redemption = true
        AND us.current_period_end > now())          AS honored_now -- expect true
FROM   public.user_subscriptions us
JOIN   victims_all va ON va.user_id = us.user_id
WHERE  va.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;
-- expect: one row per transcribed victim, honored_now = true for all.

-- D2. GUARD — no user_id OUTSIDE the transcribed victim set changed in
--     this transaction (proves the VALUES lists, not a predicate, bounded
--     the write). Expect 0 rows.
SELECT us.user_id, us.status, us.is_gift_redemption, us.updated_at
FROM   public.user_subscriptions us
WHERE  us.updated_at >= date_trunc('second', now())          -- touched this txn
  AND  us.user_id NOT IN (
         SELECT user_id FROM victims_all
         WHERE user_id <> '00000000-0000-0000-0000-000000000000'::uuid
       );
-- expect: 0 rows. ANY row here ⇒ scope leak ⇒ ROLLBACK, do NOT COMMIT.

-- D3. INDEPENDENT-ENTITLEMENT untouched: this block writes only
--     user_subscriptions. Confirm no Stripe pair was touched (sanity;
--     this txn issued no profiles/subscriptions write at all).
SELECT count(*) AS profiles_touched_this_txn
FROM   public.profiles
WHERE  updated_at >= date_trunc('second', now());
-- expect: 0 (this block never writes profiles).

-- ============================================================================
-- First run with ROLLBACK below. Read PART D:
--   D1 honored_now = true for every transcribed victim ·
--   D2 = 0 rows (no scope leak) · D3 = 0 (profiles untouched).
-- Only THEN change the single word `ROLLBACK;` to `COMMIT;` and re-run ONCE.
ROLLBACK;
-- ============================================================================
-- After Chau applies this via the SQL Editor, banner the top of this file
-- (B29 §4 lifecycle):
--   -- APPLIED via SQL Editor <date> — verified <N> rows; do not re-run
-- The WRITE-PATH bug is fixed FORWARD by PR #787 (honest errors, code not
-- burned); this block is the one-time historical-victim repair. Keep the
-- file as repaired-cohort history. Outreach: reports/OUTREACH-gift-
-- victims-A13.md (send only once this is applied so the promise is true).
-- ============================================================================
