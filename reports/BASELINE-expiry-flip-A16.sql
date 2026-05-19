-- =============================================================================
-- BASELINE: B13 Phase 3 "expiry-flip" blast-radius measurement
-- =============================================================================
-- Agent:   A16  (branch a16/expiry-flip-baseline — operator artifact, no PR)
-- Source:  reports/RECON-b13-phase3-dispatch-spec-A12.md §6, lines 299–312
--          (A12 brief, local branch b71/b13-phase3-brief @ 7cc351b64 —
--           not yet on origin at extraction time; queries copied VERBATIM)
-- Date:    2026-05-19
--
-- WHY THIS FILE EXISTS
-- --------------------
-- B13 phase 3 extracts one shared `deriveEntitlement(rows, now)` WITH an
-- expiry check and repoints the 4 currently expiry-BLIND read/write gates at
-- it (R1 me-entitlement/entitlement.ts:113, R3 stripe-webhook/core.ts:167,
-- + the two projection readers R2/R4). Today those gates return `active`
-- purely from `status='active'` and never compare the expiry date to now().
--
-- Consequence: every user who is shown premium *solely* because an
-- entitling-status row has an expiry already in the past will FLIP to
-- non-premium the instant Phase 3 deploys. That flip is CORRECT (they are
-- not paying / not entitled) but it is a user-visible money-path change.
-- These two queries measure exactly how many such users exist, so Chau
-- knows the blast radius BEFORE authorizing the Phase 3 dispatch.
--
-- HOW TO RUN
-- ----------
-- Agents have no SQL Editor / pg_catalog access (B48 D6: no unattended SQL
-- path to this Supabase). Chau runs both queries, read-only, in the Supabase
-- SQL Editor (project buemdfxyhxunzpgdoqin), then records the two integers
-- below and applies the decision matrix at the bottom.
--
-- Both queries are pure `count(*)` SELECTs. Zero side effects. Safe to run
-- any number of times. They do NOT mutate state and do NOT need a txn.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- QUERY A — projection readers (R2/R4 surface): users who will flip
-- -----------------------------------------------------------------------------
-- Measures: rows in `profiles` whose PERSISTED entitlement projection still
-- says premium (premium_status is an entitling value) but whose stored
-- expiry is already in the past. These are read by get-subscription-status
-- (R2) and _shared/billing.ts toEntitlementResponse (R4) — the surfaces that
-- trust the persisted `profiles.premium_*` snapshot without re-checking
-- expiry. This is the count of users who lose the premium UI/access at
-- deploy (or at the post-merge recompute — see DEPLOY ORDER below).
--
--   ZERO      → no persisted projection is stale-past-expiry. Nobody flips
--               via the projection surface. Ship; nothing to communicate.
--   NON-ZERO  → exactly this many users currently see premium they are not
--               entitled to via the persisted projection. They WILL lose it.
--               This is the primary "blast radius" number. Drives the
--               decision matrix + the mandatory post-merge recompute scope.

select count(*) from profiles
 where premium_status in ('active','trialing','grace_period','past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now();


-- -----------------------------------------------------------------------------
-- QUERY B — derive readers (R1/R3 surface): entitling sub rows already expired
-- -----------------------------------------------------------------------------
-- Measures: rows in canonical `subscriptions` for this app whose status is
-- still an entitling value but whose current_period_end is already in the
-- past. These are what the DERIVE path reads live: R1 me-entitlement
-- (the live access gate) and R3 stripe-webhook/core.ts isEntitlingSubscription
-- (the WRITE-path derive that persists profiles.premium_*). This is the
-- upstream cause of Query A: a winner-selected expired row here is what makes
-- a profile projection stale.
--
-- Counts ROWS, not distinct users — one user can hold several sub rows. Read
-- it as "how many entitling-but-expired rows the derive path will now reject."
-- It will typically be >= the distinct-user impact of B and overlaps A's
-- population. Treat A as the canonical user-facing blast radius; B confirms
-- the derive path is the cause and scopes the post-merge recompute.
--
--   ZERO      → no entitling sub row is past expiry. The derive path's new
--               expiry check changes nothing live. Strong "safe to ship".
--   NON-ZERO  → this many entitling rows are already expired and currently
--               (wrongly) granting access via the live gate. Post-merge
--               recompute must cover the users behind these rows.

select count(*) from subscriptions
 where app_id = 'mercy_blade'
   and status in ('active','trialing','grace_period','past_due')
   and current_period_end is not null
   and current_period_end <= now();


-- =============================================================================
-- RECORD RESULTS HERE (Chau, fill in after running)
-- =============================================================================
--   Query A (profiles projection, users flipping) ......... __________
--   Query B (subscriptions rows, expired entitling) ....... __________
--   Run date / time (UTC) ................................. __________
-- =============================================================================


-- =============================================================================
-- DECISION MATRIX — at what count does the plan change?
-- =============================================================================
-- IMPORTANT framing: per A12 §6 the CODE FIX SHIPS REGARDLESS of the count.
-- Keeping the bug = continuing to give premium away for free, indefinitely.
-- The count does NOT gate "do we fix it" — it gates the ROLLOUT
-- CHOREOGRAPHY and the COMMUNICATION decision (A12's words: "the handling
-- is *communication*, not code"). Do NOT soften the flip with a grace /
-- skew window — that re-introduces the exact bug A12 is removing.
--
-- MercyBlade reality check: total `profiles` cohort is ~100 users
-- (CLAUDE.md). A four-figure count is structurally impossible here, so the
-- meaningful buckets are small. Generic framework first, then calibrated.
--
-- Use the LARGER signal of {Query A users} for the user-facing decision.
--
--  ┌──────────────┬────────────────────────────────────────────────────────┐
--  │ Affected (A) │ Action                                                  │
--  ├──────────────┼────────────────────────────────────────────────────────┤
--  │ 0            │ SHIP NOW. No comms, no recompute needed (nothing stale). │
--  │              │ Note "0 affected" in the PR body and proceed.           │
--  ├──────────────┼────────────────────────────────────────────────────────┤
--  │ 1 – 5        │ SHIP, LOG, MONITOR. State the count in the PR body. Run  │
--  │              │ the §6 post-merge recompute for these users. Chau eyeball│
--  │              │ each row first (is any a real payer mis-expired? B5/#770 │
--  │              │ period_end field-order bad-row class — if so fix the row,│
--  │              │ do not count it as a legit flip). No mass email needed.  │
--  ├──────────────┼────────────────────────────────────────────────────────┤
--  │ 6 – 20       │ EMAIL THOSE USERS FIRST (Chau decision, separate         │
--  │              │ workstream). One-time courtesy / re-offer in Vietnamese  │
--  │              │ BEFORE or alongside the flip. Still ship Phase 3 — the   │
--  │              │ comms goes out, then recompute. PR body states count +   │
--  │              │ "comms: <sent / scheduled / declined by Chau>".          │
--  ├──────────────┼────────────────────────────────────────────────────────┤
--  │ 21 – 100     │ BIGGER CONVERSATION. At MercyBlade scale this is a large │
--  │ (i.e. a      │ fraction of the whole user base silently on free premium.│
--  │  large % of  │ Dispatch proceeds (the bug must die) but the rollout is  │
--  │  ~100 total) │ Chau-staged: comms plan + re-offer pricing decision +    │
--  │              │ recompute timing decided BEFORE merge, not discovered in │
--  │              │ prod. Treat as a launch event, not a silent deploy.      │
--  ├──────────────┼────────────────────────────────────────────────────────┤
--  │ 1000+        │ N/A at current scale (cohort ~100). If the cohort has    │
--  │ (generic     │ grown to where this is possible: do NOT block the fix —  │
--  │  large-scale │ A12's correctness decision still stands — but HARD-GATE  │
--  │  bucket)     │ the dispatch behind a written comms + phased-recompute   │
--  │              │ plan signed off by Chau. "Block" = block the silent      │
--  │              │ deploy, never "keep the revenue leak".                   │
--  └──────────────┴────────────────────────────────────────────────────────┘
--
-- Query B reading: if B == 0 while A > 0, the stale projections have no live
-- entitling sub backing them (pure persisted-snapshot debt) — recompute
-- alone fully resolves, lower risk. If B > 0, the live derive path is
-- actively mis-granting right now; the fix is more urgent, not less.
--
-- =============================================================================
-- A12'S BINDING DECISIONS (already decided in the brief — do not relitigate)
-- =============================================================================
-- 1. These users SHOULD lose premium. It is correctness; they are not
--    paying. Ship the fix as-is.
-- 2. Do NOT add a grace / skew / fudge window to soften the flip. That IS
--    the bug.
-- 3. Any courtesy email / re-offer is a SEPARATE workstream Chau owns — it
--    is NOT part of Phase 3 and must not block the code fix.
-- 4. Phase 3 definition-of-done INCLUDES a one-time post-merge recompute
--    for the Query A/B users (Chau-run admin invocation or a one-shot,
--    read-only-verified SQL UPDATE shipped in the PR — never an unattended
--    job; the webhook failure-swallow at billing.ts:587 means "let the next
--    webhook fix it" is not a guarantee).
-- 5. A correct flip of a genuinely-expired user is NOT a rollback trigger.
--    A real paying user losing premium IS — investigate as a B5/#770
--    period_end field-order bad row, not a Phase 3 logic fault.
--
-- The PR description MUST state the measured Query A and Query B counts.
-- =============================================================================
