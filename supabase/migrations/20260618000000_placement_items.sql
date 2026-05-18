-- 20260618000000_placement_items.sql
--
-- Placement Test v2 — the server-only item bank (Phase 2, PR-V2-4).
-- Sequence doc: /private/tmp/placement-test-v2-phase2-pr-sequence.md.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau-reviewed, NOT auto-applied
-- (CLAUDE.md Phase-2 manual gate). This file is a PROPOSAL: the four
-- schema decisions below (D1–D4) are flagged in the PR for confirm-or-
-- redirect BEFORE you run it. itemBank.ts (the pure validate/index
-- layer) is decision-INDEPENDENT and ships green regardless.
--
-- ── Locked context ────────────────────────────────────────────────────
-- Q1 server-authoritative + Q2: item content and the ANSWER KEY live
-- EXCLUSIVELY server-side; RLS denies ALL client reads; only the
-- service-role (the placement-session edge fn, PR-V2-8) reads it. There
-- is intentionally NO public JSON bank file in the repo.
--
-- ── D1 (high-stakes): RLS = enable + ZERO policies ───────────────────
-- RLS is enabled with NO permissive policy and NO table grants to
-- `authenticated`/`anon`. With RLS on and no policy, every non-service
-- role is denied by default. service_role bypasses RLS (built-in) — so
-- only the edge fn can read items/answers. Deliberately STRICTER than
-- the house teacher_feedback pattern (which grants admin level>=9 a
-- SELECT): there is NO admin client-side read here, because a SELECT
-- policy of any kind is a reachable path to the answer key. Admin
-- analytics/calibration go through service-role (an edge fn / export
-- job), never a browser JWT. >>> CONFIRM this strict model, or say if
-- you want an admin (>=9) read policy despite the answer-key exposure.
--
-- ── D2: ships EMPTY ──────────────────────────────────────────────────
-- Brief: "item bank starts empty; items are Phase 3." No seed INSERTs.
-- No repo bank file (Q2). Engine/unit fixtures are inline in test files
-- only. The engine runs end-to-end on an empty bank (selector handles
-- 'bank_exhausted'); real items are the Phase-3 authoring workstream
-- filling THIS table. >>> CONFIRM empty is intended for Phase 2.
--
-- ── D3: hybrid scalar-columns + protected `content jsonb` ────────────
-- The adaptive selector (PR-V2-5) and exposure control filter by
-- type / difficulty / active / bank_version SERVER-SIDE — those are
-- promoted to indexed columns. The render + answer payload (prompt,
-- passage, options, correctOptionId, audio, transcript, meta) lives in
-- one `content jsonb` so Phase-3 authoring and any `Item`-shape
-- evolution need NO further migration, and the answer key is a single
-- protected column. Shape of `content` mirrors the server-only `Item`
-- interface (supabase/functions/placement-session/types.ts) minus the
-- promoted scalars. >>> CONFIRM hybrid (vs fully-normalized columns,
-- or a single all-jsonb blob).
--
-- ── D4: per-row bank_version + active flag (equating) ────────────────
-- types.ts ItemBank.version / SessionState.bankVersion need an equating
-- anchor. Each row carries `bank_version`; `active` soft-retires an
-- item WITHOUT delete so historical placement_responses / exposure stay
-- referentially sane across bank revisions. The edge fn loads
-- `where active and bank_version = <current>`. >>> CONFIRM (vs a
-- separate placement_bank_meta table holding the active version).
--
-- ── Reversibility ─────────────────────────────────────────────────────
--   DROP TABLE IF EXISTS public.placement_items;
--   (no enum types created; nothing else added.)
--
-- Idempotent (create table/index if not exists, drop policy if exists);
-- safe to re-run. No BEGIN/COMMIT wrapper — matches the recent house
-- migrations (e.g. 20260533000000_teacher_feedback.sql), not the older
-- design-doc claim (source-of-truth = current codebase reality).

create table if not exists public.placement_items (
  id             text primary key,                       -- stable, e.g. 'rd_b1_017'
  bank_version   text    not null,                        -- D4 equating anchor
  active         boolean not null default true,           -- D4 soft-retire
  type           text    not null
    check (type in ('reading','listening','grammar','vocabulary','writing_sample')),
  skill          text    not null
    check (skill in ('reading','listening','grammar','vocabulary','writing')),
  cefr           text    not null
    check (cefr in ('pre_a1','A1','A2','B1','B2','C1','C2')),
  difficulty     numeric not null,                        -- IRT b_i
  discrimination numeric not null check (discrimination > 0), -- IRT a_i (2PL: a>0)
  is_l1_transfer_distractor boolean not null default false,
  l1_tags        text[]  not null default '{}',
  param_source   text    not null default 'expert'
    check (param_source in ('expert','empirical')),       -- 'expert' until Phase-4 pilot
  -- D3: render + ANSWER payload. correctOptionId / transcript live ONLY
  -- here — never in a client-reachable column or repo file (Q2). Shape
  -- mirrors the server-only `Item` minus the promoted scalar columns.
  content        jsonb   not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.placement_items is
  'Placement v2 server-only item bank (answer key included). RLS denies '
  'ALL client reads; service-role (placement-session edge fn) only. '
  'Ships empty — Phase-3 authoring fills it. See migration header D1-D4.';

-- Candidate filtering the selector does server-side (PR-V2-5).
create index if not exists idx_placement_items_select
  on public.placement_items (active, bank_version, type, difficulty);
create index if not exists idx_placement_items_cefr
  on public.placement_items (cefr);

-- D1 — RLS ON, ZERO policies, NO grants → all client roles denied;
-- only service_role (RLS-exempt) reads. Do NOT add a SELECT policy
-- without revisiting the answer-key exposure note above.
alter table public.placement_items enable row level security;

-- Defensive: if a permissive policy was ever added by mistake, this
-- makes the intent re-runnable/explicit. (No policy is created here.)
drop policy if exists "placement_items_no_client_access" on public.placement_items;
