-- ============================================================================
-- ⛔ HANDOFF SKELETON — NOT EXECUTABLE AS-IS. NOT EXECUTED. DO NOT APPLY BLIND.
--
--   B5 — Remediation: mylinh.nutrition@gmail.com paid-but-free (stale
--   subscriptions.current_period_end; period_end field-order class bug,
--   fixed at the write path by PR #770 / B11).
--
--   SALVAGE PROVENANCE
--   ------------------
--   B5 produced per-user remediation SQL during a LIVE terminal diagnostic.
--   It was pasted to chat, NEVER committed, and its verbatim text is
--   PERMANENTLY LOST (corroborated by THREE committed artifacts:
--     - reports/RECON-mylinh-paid-but-free-B5.md  (B24) → "The remediation
--       SQL … is not on disk. Do NOT reconstruct or run it."
--     - reports/RECON-billing-architecture-as-built-B45.md → line "B5's
--       mylinh remediation SQL not on disk (lost — recover from transcript
--       or B12-regenerate under review)."
--     - docs/agent-briefs/sql-remediation-convention.md (B29) → B5 is the
--       named cautionary loss case.)
--
--   This file is B57's salvage (2026-05-19, branch b57/mylinh-sql-salvage).
--   It reconstructs ONLY the B29 seven-part STRUCTURE and the constants that
--   are recoverable from committed evidence. It does NOT reproduce B5's
--   verbatim SQL — that is unrecoverable. Every value that cannot be sourced
--   to a committed artifact is a NOT-RECOVERABLE placeholder, deliberately
--   left as :name and NOT filled from the dispatch brief's asserted figures.
--   See "RECOVERABLE vs NOT RECOVERABLE" below.
--
--   STATUS:    HANDOFF SKELETON. NOT EXECUTED by B5 or B57. This is the
--              specification of the corrective write, not a runnable block.
--              An operator MUST resolve every :placeholder from a fresh,
--              human-reviewed Stripe Dashboard + DB read before this is
--              even a candidate. Apply ONCE via the Supabase SQL Editor,
--              human-reviewed. Never `supabase db push`. There is NO
--              unattended SQL path to this Supabase.
--   EVIDENCE:  reports/RECON-mylinh-paid-but-free-B5.md  (B24/B5 — the
--              identity + period constants are justified there; this file
--              is not trustworthy standalone). Architecture of the write/
--              read path: reports/RECON-billing-architecture-as-built-B45.md.
--   SCOPE:     EXACTLY ONE user — mylinh.nutrition@gmail.com,
--              user_id = cd9b889c-eb9f-428f-9462-de66d4f92c04.
--              Two rows: her public.subscriptions Stripe mirror row, and
--              her public.profiles canonical-entitlement row (id = user_id).
--   EXCLUDED:  Every other user. This is a single-identity correction; it
--              must NEVER be expressed as a predicate (e.g.
--              "status='active' AND current_period_end < now()") — that is
--              the class-wide bulk remediation owned by the B11/B12 track,
--              not this file. PK / user_id targeting only (B29 part 1;
--              A94-vs-A77 predicate hazard).
--   INDEPENDENT ENTITLEMENTS: A gift / manual grant, IF one exists for this
--              user, lives in public.user_subscriptions
--              (is_gift_redemption=true) — a DIFFERENT table that the
--              UPDATEs below DO NOT touch (B45 §W3/R-live: the gift path
--              never writes profiles.premium_*; it is read-side only).
--              Whether such a row exists, and its current_period_end, is
--              NOT RECOVERABLE from committed evidence (B5 RECON marks the
--              user_subscriptions read result NOT RECOVERABLE). The
--              GREATEST() in the profiles UPDATE is the structural gift
--              guard: it can only ever move premium_expires_at FORWARD,
--              never shorten an existing longer (gift) entitlement.
--
--   ── STRIPE DASHBOARD PRECONDITION (mandatory, manual, before any run) ──
--   B5's block opened with a Stripe precondition check. Reconstructed
--   intent: the operator opens Stripe Dashboard → Customers →
--   mylinh.nutrition@gmail.com → her active subscription, and reads the
--   LIVE current_period_end. The corrected value written below
--   (:corrected_period_end) MUST be that live Stripe value. The
--   evidence-derived candidate is given below as a cross-check ONLY.
--
--   ── PERIOD-END RECONCILIATION (flagged, not silently reconciled) ──
--   B5's on-disk constant (b5-deep.mjs:14, quoted in B5 RECON) is the
--   exact epoch  __stripe_freshness.object_time = 1780985801000 ms.
--   Deterministic decode: new Date(1780985801000).toISOString()
--      = 2026-06-09T06:16:41.000Z   ← EXACT, recoverable
--   The stale persisted column is 2026-05-09T06:16:41+00:00; the corrected
--   value is EXACTLY +31 days (a clean monthly renewal boundary), same
--   time-of-day — strong corroboration. NOTE: B5 RECON prose and B45 prose
--   both APPROXIMATE this as "≈2026-06-08"; that prose is a ~1-day eyeball
--   error. The exact constant decodes to 2026-06-09T06:16:41Z. This
--   divergence is FLAGGED here (per B12 RECON's "do not silently reconcile"
--   rule), not buried. The authoritative value remains the LIVE Stripe read
--   above; 2026-06-09T06:16:41Z is the evidence-derived cross-check.
--
--   APPLY PATH: Supabase SQL Editor, ONCE, human-reviewed, after all
--   placeholders resolved. Never db push. Never an agent. (CLAUDE.md →
--   Supabase; memory project_db_schema_drift_audit / project_578_rls_applied
--   / project_agent_infra_access — no unattended SQL path.)
-- ============================================================================
--
-- RECOVERABLE vs NOT RECOVERABLE
-- -----------------------------------------------------------------------------
-- RECOVERABLE (sourced to committed evidence — used below verbatim):
--   * user_id / profiles PK : cd9b889c-eb9f-428f-9462-de66d4f92c04
--                             (B5 RECON; b5-deep.mjs:10)
--   * email                 : mylinh.nutrition@gmail.com
--                             (B5 RECON; b5-diagnostic.mjs:7)
--   * stale current_period_end (the WRONG value to be corrected):
--                             2026-05-09T06:16:41+00:00
--                             (B5 RECON; b5-deep.mjs:13)
--   * corrected current_period_end CANDIDATE (cross-check only — confirm
--     against live Stripe): 2026-06-09T06:16:41+00:00  (exact decode of
--     epoch 1780985801000, B5 RECON; b5-deep.mjs:14)
--   * driving invoice event_created (context, NOT written): epoch
--     1778311089 → 2026-05-09T07:18:09Z (B5 RECON; b5-deep.mjs:15)
--   * canonical entitlement pair = profiles.premium_status +
--     profiles.premium_expires_at, written only by the Stripe webhook;
--     gift lives in a separate table (B45 §W1/W3/R-live)
--
-- NOT RECOVERABLE (left as :placeholder — DO NOT GUESS; resolve from a
-- fresh human-reviewed Stripe + DB read. The dispatch brief asserted some
-- of these; those assertions were DELIBERATELY NOT baked in, because no
-- committed artifact corroborates them and step 9 of the salvage brief
-- forbids fabricating timestamps/amounts):
--   * :subscription_pk        — public.subscriptions.id for this user.
--                               Only user_id is on disk; the PK must be
--                               transcribed from the PREVIEW output into
--                               the UPDATE before COMMIT (true B29 part-1
--                               PK-targeting).
--   * :sub_status_pre         — subscriptions.status pre-state. B5 RECON:
--                               explicitly NOT RECOVERABLE. (Brief asserted
--                               'active' — NOT corroborated; not baked in.)
--   * :provider_subscription_id — Stripe sub id (sub_…). Not on disk.
--   * :corrected_period_end   — the LIVE Stripe current_period_end (see
--                               Stripe precondition). Candidate cross-check
--                               = 2026-06-09T06:16:41+00:00.
--   * :gift_period_end        — current_period_end of her user_subscriptions
--                               gift row, IF ANY. B5 RECON: NOT RECOVERABLE.
--                               (Brief asserted a gift of '2026-11-11' — NO
--                               committed artifact contains this; NOT baked
--                               in. Read it live from user_subscriptions, or
--                               drop the gift term if no gift row exists.)
--   * :premium_status_target  — value to set profiles.premium_status to
--                               ('active' is the expected target per B45,
--                               but confirm against the live webhook logic /
--                               recomputeAndPersistEntitlement output).
-- =============================================================================

BEGIN;

-- ---- PART 4: PREVIEW (run first; resolve :subscription_pk from this) -------
--      Confirm exactly ONE subscriptions row, and that its
--      current_period_end is the stale 2026-05-09T06:16:41+00:00.
SELECT id              AS subscription_pk,   -- transcribe into UPDATE below
       user_id,
       provider,
       status          AS sub_status_pre,    -- NOT RECOVERABLE pre-state
       provider_subscription_id,
       current_period_end,                    -- expect 2026-05-09T06:16:41Z
       updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';   -- expect 1 row

-- Current canonical entitlement state for the same user (profiles PK = user_id)
SELECT id, premium_status, premium_expires_at, premium_source, tier, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';        -- expect 1 row

-- Independent-entitlement view (NEVER written by this block — proof of part 2)
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
--      ^ If a gift row exists, its current_period_end is :gift_period_end.
--        If NO row: drop the GREATEST gift term in the profiles UPDATE.

-- ---- PART 1+3: UPDATE subscriptions — correct the stale period -----------
--      PK-targeted (fill :subscription_pk from PREVIEW). Idempotency guard
--      is the EXACT stale value (recoverable): a re-run after the fix
--      matches 0 rows. expect 1 row.
UPDATE public.subscriptions
SET    current_period_end = :corrected_period_end,  -- live Stripe value;
                                                    -- cross-check 2026-06-09T06:16:41+00:00
       status             = :premium_status_target, -- expected 'active'; confirm
       updated_at         = now()
WHERE  id          = :subscription_pk               -- B29 part 1: PK, not predicate
  AND  user_id     = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  current_period_end = '2026-05-09T06:16:41+00:00';  -- idempotency: stale value

-- ---- PART 1+2+3: UPDATE profiles — re-grant premium, gift-safe ----------
--      profiles PK = user_id (FULLY recoverable → true PK-targeting).
--      premium_expires_at = GREATEST(corrected Stripe, whatever is already
--      there, gift) → can only move expiry FORWARD. This GREATEST IS the
--      gift guard (B29 part 2): a longer existing/gift entitlement is never
--      shortened. Idempotency: only acts if not already at/after target.
UPDATE public.profiles
SET    premium_status     = :premium_status_target,        -- expected 'active'; confirm
       premium_expires_at = GREATEST(
                              :corrected_period_end,        -- live Stripe value
                              premium_expires_at,           -- never regress existing
                              :gift_period_end              -- NOT RECOVERABLE — see PREVIEW;
                                                            -- omit this arg if no gift row
                            ),
       updated_at         = now()
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'          -- PK, not predicate
  AND  ( premium_expires_at IS NULL
         OR premium_expires_at < :corrected_period_end );   -- idempotency guard

-- ---- PART 5: VERIFY-AFTER (intended rows reached target state) -----------
SELECT id, user_id, status, current_period_end, updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
--      expect: current_period_end = :corrected_period_end, status target.

SELECT id, premium_status, premium_expires_at, premium_source, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
--      expect: premium_status target, premium_expires_at >= :corrected_period_end
--      (and >= :gift_period_end if a gift row existed).

-- ---- PART 2 GUARD: independent entitlement structurally untouched -------
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
--      expect: byte-identical to the PREVIEW read (this block never writes
--      this table).

-- ---- PART 6: BEGIN/ROLLBACK→COMMIT wrapper ------------------------------
-- First run with ROLLBACK: PREVIEW + UPDATE + VERIFY + GUARD all execute,
-- NOTHING persists. The operator (1) confirms every :placeholder was
-- resolved from a live human-reviewed read, (2) reads VERIFY/GUARD output,
-- then changes the single word below to `COMMIT;` and re-runs ONCE.
ROLLBACK;
-- ============================================================================
-- After Chau applies this via the SQL Editor, banner the top of this file:
--   -- APPLIED via SQL Editor <date> — verified N rows; do not re-run
-- (B29 §4 lifecycle). Superseded at the WRITE path by PR #770 / B11
-- (period_end field-order fix) — that stops NEW stale writes; this corrects
-- the one historical row. Keep the file as corrected-row history.
-- ============================================================================
