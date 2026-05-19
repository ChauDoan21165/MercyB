-- ============================================================================
-- A2 (regenerating B5; supersedes the B57 HANDOFF SKELETON in git history)
--   Remediation: mylinh.nutrition@gmail.com paid-but-free — stale
--   public.subscriptions.current_period_end (period_end field-order class
--   bug; fixed at the WRITE path by PR #770 / B11; this corrects the one
--   historical row #770 cannot retro-fix).
--
--   WHY REGENERATED (B66 closeout marked this 🔴 blocked):
--   ------------------------------------------------------------------------
--   B5's verbatim live SQL is permanently lost (RECON-mylinh-paid-but-free
--   -B5.md). B57 salvaged a B29-shaped SKELETON but it was NOT executable
--   and carried two defects this regeneration fixes under human review:
--     (1) It used psql `:name` bind params — those do NOT work in the
--         Supabase SQL Editor (not psql; no \set). Replaced with inline
--         hand-edit placeholders + a GATE block (the B64 pattern).
--     (2) It used ONE placeholder `:premium_status_target` for BOTH
--         subscriptions.status AND profiles.premium_status — two DIFFERENT
--         domains with DIFFERENT check constraints (subscriptions.status ∈
--         {active,trialing,grace_period,past_due,paused,expired,revoked};
--         profiles.premium_status ∈ {active,inactive}). Flipping
--         subscriptions.status from a guessed value would FABRICATE an
--         entitling state. This regeneration does NOT write
--         subscriptions.status at all (smallest safe diff; the recon's
--         only defect is the stale period, not the status). profiles is
--         re-granted by mirroring the live code path, not a free guess.
--
--   STATUS:    HANDOFF ONLY. NOT EXECUTED by A2/B57/B5. A read-only
--              diagnostic (B5) produced the evidence; this is the
--              specification of the corrective write, not a runnable block
--              until every ‹PLACEHOLDER› is resolved from a fresh,
--              human-reviewed Stripe Dashboard + DB read. Apply ONCE via
--              the Supabase SQL Editor, human-reviewed. Never
--              `supabase db push`. There is no unattended SQL path to this
--              Supabase (CLAUDE.md → Supabase; memory
--              project_db_schema_drift_audit / project_578_rls_applied /
--              project_agent_infra_access).
--
--   EVIDENCE:  reports/RECON-mylinh-paid-but-free-B5.md (B24/B5) — paired
--              recon; the identity + stale-period constants are justified
--              there. Do NOT trust this .sql standalone; read the recon
--              first. Write/read path of the entitlement pair:
--              reports/RECON-billing-architecture-as-built-B45.md.
--              Convention: docs/agent-briefs/sql-remediation-convention.md
--              (B29). Structural template: REMEDIATION-price-map-repair
--              -B64.sql. Code grounding for every column/value below:
--                - subscriptions DDL: supabase/migrations/
--                  20260315211233_unified_entitlements_and_subscriptions.sql
--                - profiles premium_* + check constraints: same file L63–94
--                - entitlement derivation (what re-grants premium):
--                  supabase/functions/stripe-webhook/core.ts
--                  deriveEntitlementFromSubscriptions / isEntitlingSubscription
--                - persistence: supabase/functions/stripe-webhook/billing.ts
--                  recomputeAndPersistEntitlement (L542–575)
--
--   SCOPE:     EXACTLY ONE user, TWO rows.
--                user_id = cd9b889c-eb9f-428f-9462-de66d4f92c04
--                email   = mylinh.nutrition@gmail.com
--              Row 1: her public.subscriptions Stripe mirror row
--                     (PK = subscriptions.id — NOT on disk; resolved from
--                     PREVIEW A1, true B29 part-1 PK-targeting).
--              Row 2: her public.profiles row (PK = id = the user_id above
--                     — fully recoverable → exact PK-targeting).
--
--   EXCLUDED (rows/columns a careless block would touch but are
--              deliberately OUT):
--            - Every OTHER user. This is a single-identity correction. It
--              MUST NOT be expressed as a predicate (e.g.
--              "status='active' AND current_period_end < now()") — that is
--              the class-wide bulk remediation owned by the B11/B12 track
--              (PR #770 is the write-path fix), NOT this file. A94-vs-A77
--              predicate hazard: PK only.
--            - public.subscriptions.status — NOT written. The recon's only
--              proven defect is the stale period; her status is NOT
--              RECOVERABLE and flipping it would fabricate entitlement.
--              The PREVIEW surfaces it for a human go/stop decision instead
--              (see GATE step 3).
--            - public.subscriptions.current_period_end_at — a SEPARATE
--              parallel column added by drift migration
--              20260319000000_team_c_billing_foundation.sql (L58–59). The
--              live entitlement reader (core.ts / billing.ts) reads
--              `current_period_end`, NOT `_at` (grep-confirmed: billing.ts
--              select strings + core.ts winner logic use current_period_end
--              with no `_at`). This block fixes `current_period_end` only.
--              `current_period_end_at` is shown in PREVIEW for awareness;
--              do NOT also write it without a fresh decision.
--            - public.user_subscriptions (gift/manual grants) — only
--              SELECTed as a guard; structurally never written here.
--
--   INDEPENDENT ENTITLEMENTS (B29 part 2): a gift / manual grant, IF one
--              exists for this user, lives in public.user_subscriptions
--              (is_gift_redemption=true) — a DIFFERENT table the UPDATEs
--              below DO NOT touch (B45 §W3/R-live: the gift path is
--              read-side only; it never writes profiles.premium_*).
--              Whether such a row exists, and its period, is NOT
--              RECOVERABLE from committed evidence. The GREATEST() in the
--              profiles UPDATE (PART B2) is the structural gift guard: it
--              can only move premium_expires_at FORWARD, never shorten an
--              existing longer (gift) entitlement. The dispatch brief's
--              asserted gift '2026-11-11' is NOT corroborated by any
--              committed artifact and is deliberately NOT baked in.
--
--   TRIGGER INTERACTION (blast-radius bound — read this): migration
--              20260614000000_profiles_freeze_privileged_columns.sql
--              installs a BEFORE UPDATE trigger that REVERTS any delta to
--              premium_status / premium_expires_at / premium_source when
--              the JWT role claim is 'authenticated'. The Supabase SQL
--              Editor runs as postgres with NO request.jwt → claim NULL →
--              the trigger passes through (its own header documents this
--              exemption). So PART B2 takes effect ONLY via this sanctioned
--              SQL-Editor human-reviewed path — never via any browser /
--              anon / authenticated path, and never via `db push`. This is
--              a built-in bound on how this write can reach prod.
--
--   ── PERIOD-END RECONCILIATION (flagged, NOT silently reconciled) ──
--   B5's on-disk constant (b5-deep.mjs:14, quoted in the recon) is the
--   exact epoch __stripe_freshness.object_time = 1780985801000 ms.
--   Deterministic decode: new Date(1780985801000).toISOString()
--      = 2026-06-09T06:16:41.000Z   ← EXACT, recoverable
--   Stale persisted column = 2026-05-09T06:16:41+00:00; the corrected
--   value is EXACTLY +31 days, same time-of-day → a clean monthly renewal
--   boundary (strong corroboration). NOTE: the recon prose and B45 prose
--   both APPROXIMATE this as "≈2026-06-08" — that prose is a ~1-day eyeball
--   error; the exact constant decodes to 2026-06-09T06:16:41Z. Divergence
--   FLAGGED here (B12 "do not silently reconcile" rule), not buried. The
--   AUTHORITATIVE value is the LIVE Stripe read (GATE step 2);
--   2026-06-09T06:16:41Z is the evidence-derived cross-check only.
--
--   ┌──────────────────────────────────────────────────────────────────┐
--   │ >>> GATE — DO NOT FLIP ROLLBACK→COMMIT UNTIL ALL 4 ARE DONE <<<    │
--   ├──────────────────────────────────────────────────────────────────┤
--   │ 1. ‹SUBSCRIPTION_PK›  — run PREVIEW A1. Confirm EXACTLY ONE        │
--   │    subscriptions row for the user_id and that its                 │
--   │    current_period_end is the stale 2026-05-09T06:16:41+00:00.     │
--   │    Transcribe its `id` UUID into PART B1 (replace the all-zero     │
--   │    sentinel). The sentinel matches 0 rows by design → an          │
--   │    un-edited paste is a safe no-op, never a wrong-row write.       │
--   │ 2. ‹CORRECTED_PERIOD_END› — Stripe Dashboard → Customers →         │
--   │    mylinh.nutrition@gmail.com → her ACTIVE subscription → read     │
--   │    "Current period end". Put THAT value in PART B1/B2. The         │
--   │    literal pre-filled there (2026-06-09T06:16:41+00:00) is the     │
--   │    evidence-derived CROSS-CHECK ONLY — confirm/replace from live   │
--   │    Stripe. If live Stripe disagrees by > ~1 day, STOP & re-       │
--   │    diagnose (do not paste).                                        │
--   │ 3. subscriptions.status go/stop — from PREVIEW A1 + Stripe         │
--   │    Dashboard subscription Status. PROCEED ONLY IF the live DB      │
--   │    status ∈ {active,trialing,grace_period,past_due} (the          │
--   │    entitling set per core.ts isEntitlingSubscription). If it is    │
--   │    expired/revoked/paused/canceled → STOP: that is a DIFFERENT     │
--   │    defect; correcting the period alone will NOT re-grant her and   │
--   │    forcing status here would fabricate entitlement. Re-dispatch.   │
--   │ 4. period column — from PREVIEW A1 confirm `current_period_end`    │
--   │    is the stale one. `current_period_end_at` is the team_c drift   │
--   │    column the entitlement reader ignores; do NOT also write it.    │
--   └──────────────────────────────────────────────────────────────────┘
--
--   APPLY PATH: Supabase SQL Editor, ONCE, human-reviewed, after every
--   ‹PLACEHOLDER› + GATE step is resolved. Never `db push`. Never an agent.
-- ============================================================================
--
-- RECOVERABLE vs NOT RECOVERABLE
-- -----------------------------------------------------------------------------
-- RECOVERABLE (sourced to committed evidence — used below verbatim):
--   * user_id / profiles PK : cd9b889c-eb9f-428f-9462-de66d4f92c04
--                             (recon; b5-deep.mjs:10)
--   * email                 : mylinh.nutrition@gmail.com (recon;
--                             b5-diagnostic.mjs:7)
--   * stale current_period_end (the WRONG value being corrected; used as
--     the idempotency guard): 2026-05-09T06:16:41+00:00 (recon;
--     b5-deep.mjs:13)
--   * corrected current_period_end CANDIDATE (cross-check ONLY — confirm
--     vs live Stripe): 2026-06-09T06:16:41+00:00 (exact decode of epoch
--     1780985801000; recon; b5-deep.mjs:14)
--   * fix-target column = public.subscriptions.current_period_end, and the
--     re-grant pair = profiles.premium_status / premium_expires_at /
--     premium_source set to ('active', GREATEST(corrected, existing),
--     'stripe') — these values/columns are NOT guesses: they mirror the
--     live writer deriveEntitlementFromSubscriptions + recomputeAnd-
--     PersistEntitlement (core.ts / billing.ts) and satisfy the
--     profiles_premium_status_chk / profiles_premium_source_chk
--     constraints.
--
-- NOT RECOVERABLE (resolve from a fresh human-reviewed read — DO NOT GUESS;
-- the dispatch brief asserted some of these and they are DELIBERATELY NOT
-- baked in, per salvage rule "do not invent values"):
--   * ‹SUBSCRIPTION_PK›  — public.subscriptions.id for this user. Only
--                          user_id is on disk. Resolve from PREVIEW A1
--                          (live DB read in the SQL Editor), transcribe
--                          into PART B1 before COMMIT. → fills via:
--                          PREVIEW A1 (not a Stripe lookup).
--   * ‹CORRECTED_PERIOD_END› — the LIVE Stripe current_period_end. →
--                          fills via: Stripe Dashboard → Customers →
--                          mylinh.nutrition@gmail.com → active sub →
--                          "Current period end". Cross-check candidate
--                          2026-06-09T06:16:41+00:00.
--   * subscriptions.status (NOT written; go/stop input) — recon: explicitly
--                          NOT RECOVERABLE. → confirm via: PREVIEW A1 +
--                          Stripe Dashboard subscription Status (GATE 3).
--   * gift row in user_subscriptions (exists? period?) — recon: NOT
--                          RECOVERABLE. → fills via: PREVIEW A3 (live DB);
--                          GREATEST() guard makes it safe either way.
-- =============================================================================

BEGIN;

-- ---- PART A · PREVIEW (run first; nothing persists under ROLLBACK) ---------

-- A1. The subscriptions row(s) for this user. EXPECT EXACTLY 1 ROW.
--     Read off: `id` → transcribe into PART B1 (GATE 1); `status` → GATE 3
--     go/stop; confirm `current_period_end` = the stale
--     2026-05-09T06:16:41+00:00; note `current_period_end_at` is the
--     IGNORED drift column (GATE 4); `app_id` shown because the live
--     entitlement reader scopes by it (billing.ts recomputeAndPersist
--     filters .eq app_id) — if >1 app_id row appears, STOP & re-dispatch.
SELECT id                       AS subscription_pk,   -- → PART B1 (GATE 1)
       user_id,
       app_id,
       provider,
       status                   AS sub_status_live,   -- → GATE 3 go/stop
       provider_subscription_id,
       current_period_end,                             -- expect 2026-05-09T06:16:41+00:00
       current_period_end_at,                          -- drift column; DO NOT write
       updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect 1 row

-- A2. Current canonical entitlement state (profiles PK = user_id).
--     EXPECT 1 ROW; expect it to currently show the user as NOT premium
--     (premium_status='inactive' OR premium_expires_at in the past) — that
--     is the user-felt symptom this block repairs.
SELECT id, premium_status, premium_expires_at, premium_source, tier, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect 1 row

-- A3. Independent-entitlement pre-state (NEVER written by this block —
--     this is the part-2 guard baseline). If a gift row exists, note its
--     current_period_end; PART B2's GREATEST() will preserve it. If NO
--     row, the GREATEST() still behaves correctly (NULL arg ignored).
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: 0 or more rows; whatever is here MUST be byte-identical in D3

-- ---- PART B · THE FIX -----------------------------------------------------

-- B1. Correct ONLY the stale period on the Stripe mirror row.
--     PK-targeted (B29 part 1). The all-zero sentinel below MUST be
--     replaced with the real `id` from PREVIEW A1 (GATE 1) — left as-is it
--     matches 0 rows (safe no-op, not a wrong-row write). Idempotency
--     (B29 part 3): the guard `AND current_period_end = '2026-05-09…'` is
--     the EXACT recoverable stale value, so a second paste (or a run after
--     PR #770 already fixed it) matches 0 rows. status is intentionally
--     NOT in the SET list (see header EXCLUDED + GATE 3).
UPDATE public.subscriptions
SET    current_period_end = '2026-06-09T06:16:41+00:00',  -- ‹CORRECTED_PERIOD_END›
                                                          -- <<< CONFIRM/REPLACE from
                                                          --     LIVE Stripe (GATE 2) >>>
       updated_at         = now()
WHERE  id      = '00000000-0000-0000-0000-000000000000'   -- ‹SUBSCRIPTION_PK›
                                                          -- <<< REPLACE from PREVIEW A1
                                                          --     (GATE 1) >>>
  AND  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'   -- recoverable, fixed
  AND  current_period_end = '2026-05-09T06:16:41+00:00';  -- idempotency: exact stale
-- expect 1 row

-- B2. Re-grant premium by MIRRORING the live writer
--     (deriveEntitlementFromSubscriptions + recomputeAndPersistEntitlement,
--     core.ts/billing.ts): an entitling sub ⇒ premium_status='active',
--     premium_expires_at = winner.current_period_end, premium_source =
--     provider. premium_expires_at uses GREATEST(corrected, existing) so
--     it can ONLY move FORWARD — this IS the independent-entitlement /
--     gift guard (B29 part 2): a longer existing or gift expiry is never
--     shortened. premium_status/premium_source/premium_expires_at are NOT
--     free guesses — they are the exact code-derived target and satisfy
--     profiles_premium_status_chk ('active'|'inactive') and
--     profiles_premium_source_chk (NULL|'stripe'|'apple'|'google').
--     profiles.updated_at is intentionally NOT set (the canonical webhook
--     writer billing.ts does not set it; avoids depending on a column the
--     live writer never touches). Idempotency (B29 part 3): the WHERE
--     skips the row if it is already at/after target.
--     >>> Run ONLY if GATE 3 passed (live status is entitling). If GATE 3
--         said STOP, do not run B2 — re-dispatch. <<<
UPDATE public.profiles
SET    premium_status     = 'active',                     -- code-derived, not a guess
       premium_source     = 'stripe',                     -- = winner.provider
       premium_expires_at = GREATEST(
                              '2026-06-09T06:16:41+00:00'::timestamptz, -- ‹CORRECTED_PERIOD_END›
                                                          -- <<< same live Stripe value
                                                          --     as B1 (GATE 2) >>>
                              premium_expires_at                        -- never regress
                            )
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'        -- PK, fully recoverable
  AND  ( premium_status <> 'active'
         OR premium_expires_at IS NULL
         OR premium_expires_at < '2026-06-09T06:16:41+00:00'::timestamptz ); -- ‹CORRECTED_PERIOD_END›
-- expect 1 row (0 on a re-run / if already correct)

-- ---- PART C · OPTIONAL cleanup ---------------------------------------------
-- NONE. Considered and deliberately rejected: scope is exactly the stale
-- period (CLAUDE.md "smallest safe change"). No status flip, no
-- user_subscriptions touch, no class-wide sweep — those belong to
-- B11/B12/#770. This section is kept (empty) so the structure matches B64
-- and the "we did not bolt on extra writes" decision is explicit.

-- ---- PART D · VERIFY-AFTER (read before flipping to COMMIT) ----------------

-- D1. PRIMARY SUCCESS CRITERION — the stale period is corrected.
SELECT id, user_id, status, current_period_end, current_period_end_at, updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: current_period_end = ‹CORRECTED_PERIOD_END›; status UNCHANGED
--         from A1 (we did not touch it); current_period_end_at UNCHANGED.

-- D2. Entitlement re-granted on the canonical pair.
SELECT id, premium_status, premium_expires_at, premium_source, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: premium_status='active', premium_source='stripe',
--         premium_expires_at >= ‹CORRECTED_PERIOD_END› (and >= any gift
--         period from A3 — GREATEST guarantees it never regressed).

-- D3. PART-2 GUARD — independent entitlements structurally untouched.
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: byte-identical to PREVIEW A3 (this block never writes this table).

-- D4. Code-faithful sanity: re-derive entitlement the way the live reader
--     does (isEntitlingSubscription = status in the 4-set; winner =
--     max current_period_end). After the fix this MUST yield exactly the
--     state D2 shows — proving the manual write matches what the webhook
--     would have produced, not an ad-hoc value.
SELECT 'active'::text                       AS derived_premium_status,
       max(current_period_end)              AS derived_premium_expires_at,
       'stripe'::text                       AS derived_premium_source
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  status IN ('active','trialing','grace_period','past_due');
-- expect: 1 row matching D2 (derived_premium_expires_at = the corrected
--         period). If 0 rows → no entitling sub → GATE 3 was mis-passed:
--         ROLLBACK and re-diagnose, do NOT COMMIT.

-- ============================================================================
-- First run with ROLLBACK below. Read PART D. Confirm:
--   D1 = period corrected, status unchanged · D2 = premium active +
--   expires>=corrected · D3 = byte-identical to A3 · D4 = 1 row matching D2.
-- Only THEN change the single word `ROLLBACK;` to `COMMIT;` and re-run ONCE.
ROLLBACK;
-- ============================================================================
-- After Chau applies this via the SQL Editor, banner the top of this file
-- (B29 §4 lifecycle):
--   -- APPLIED via SQL Editor <date> — verified <N> rows; do not re-run
-- Superseded at the WRITE path by PR #770 / B11 (period_end field-order
-- fix) — that stops NEW stale writes; this corrects the one historical
-- row. Keep the file as corrected-row history.
-- ============================================================================
--
-- CHAU — affected user (full values here; do not publish in any user-facing
-- surface). Exactly ONE paying user, paid through ≈June, receiving no
-- premium as of 2026-05-19:
--   user_id = cd9b889c-eb9f-428f-9462-de66d4f92c04
--   email   = mylinh.nutrition@gmail.com
-- ============================================================================
