-- 20260619000000_placement_sessions.sql
--
-- Placement Test v2 — session/response relational store + the
-- profiles.placement_history fast-read growth log (Phase 2, PR-V2-7).
-- Sequence doc: /private/tmp/placement-test-v2-phase2-pr-sequence.md.
-- Implements design §3.1–§3.3.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau-applied, NOT auto-applied
-- (CLAUDE.md Phase-2 manual gate; agents never `supabase db push`).
--
-- Depends only on PR 1's type shapes (already on main): the
-- placement_history element mirrors PlacementHistoryEntry in
-- supabase/functions/placement-session/types.ts. NO engine dependency
-- (thetaEstimator/PR 3 not involved) — this is pure schema.
--
-- ── What this adds (additive only) ───────────────────────────────────
-- 1. profiles.placement_history jsonb — append-only denormalized growth
--    log (design §3.1). The EXISTING placement_cefr / placement_score /
--    placement_starting_room / placement_completed_at /
--    placement_weaknesses columns are UNTOUCHED and still the "latest
--    snapshot" that cefrToRoom.ts / MercyGuide / DailyCoach / onboarding
--    read — v2 keeps writing them too, so those readers need zero change.
-- 2. placement_sessions — one row per started session (resume + audit +
--    idempotency).
-- 3. placement_responses — one row per administered item; APPEND-ONLY
--    (no client UPDATE/DELETE policy — that append-only integrity IS an
--    anti-cheat control, design §3.3) — exposure control + resume +
--    future Phase-4 calibration.
-- 4. placement_item_exposure — optional global exposure rollup.
--
-- ── RLS (design §3.3, house idiom) ───────────────────────────────────
-- Owner: auth.uid() = user_id (the established pattern). Admin
-- analytics/calibration read via the HOUSE admin gate
-- public.get_admin_level() >= 9 (SECURITY-DEFINER fn over admin_users;
-- the SAME gate used in 20260533000000_teacher_feedback.sql and the
-- companion placement_items migration — NOT profiles.tier, which is the
-- paid axis). placement_item_exposure: no client policy at all
-- (service-role only) + admin read; it is internal exposure data.
--
-- ── FK indexes (production-readiness; cf. 20260617000000_index_
--    private_messages_fks.sql) ───────────────────────────────────────
-- Postgres does NOT auto-index foreign keys. Account deletion (a GDPR
-- path) and auth.users ON DELETE CASCADE must find child rows by
-- user_id / session_id; without indexes those are sequential scans of
-- append-only, unbounded tables. Every FK column here is explicitly
-- indexed.
--
-- ── Reversibility ─────────────────────────────────────────────────────
--   DROP TABLE IF EXISTS public.placement_responses;
--   DROP TABLE IF EXISTS public.placement_item_exposure;
--   DROP TABLE IF EXISTS public.placement_sessions;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS placement_history;
--   (no enum types created.)
--
-- Idempotent (create … if not exists, add column if not exists, drop
-- policy if exists); safe to re-run. No BEGIN/COMMIT wrapper — matches
-- recent house migrations (source-of-truth = current codebase reality).

-- ── 1. profiles.placement_history (additive) ─────────────────────────
alter table public.profiles
  add column if not exists placement_history jsonb not null default '[]'::jsonb;

comment on column public.profiles.placement_history is
  'Placement v2 append-only growth log (denormalized fast-read). Each '
  'element mirrors PlacementHistoryEntry (placement-session/types.ts): '
  '{ ts, bankVersion, theta, se, cefr, perSkill, l1Top, sessionId, '
  'source }. Source of truth is the relational tables below; existing '
  'placement_cefr/score/starting_room/completed_at/weaknesses are KEPT '
  'and still written as the latest snapshot (zero reader change).';

-- ── 2. placement_sessions ────────────────────────────────────────────
create table if not exists public.placement_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  bank_version  text not null,
  self_rating   text check (self_rating in
                  ('beginner','intermediate','advanced','not_sure')),
  phase         text not null default 'in_progress' check (phase in
                  ('awaiting_self_rating','in_progress','terminating',
                   'complete','abandoned')),
  prior_mean    numeric,
  theta         numeric,
  theta_se      numeric,
  cefr          text check (cefr in
                  ('pre_a1','A1','A2','B1','B2','C1','C2')),
  termination_reason text,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now()
);
comment on table public.placement_sessions is
  'Placement v2: one row per started session (resume + audit + '
  'idempotency). RLS: owner (auth.uid()=user_id) + admin >=9 read.';
-- FK + the "user''s recent sessions" / 90-day retake lookup.
create index if not exists idx_placement_sessions_user
  on public.placement_sessions (user_id, started_at desc);

-- ── 3. placement_responses (APPEND-ONLY) ─────────────────────────────
create table if not exists public.placement_responses (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.placement_sessions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  item_id       text not null,
  item_type     text not null,
  item_cefr     text,
  seq           int  not null,            -- 0-based order within session
  correct       boolean,                  -- null for writing_sample (decision #3)
  selected_option_id text,
  response_ms   int,
  timed_out     boolean default false,
  l1_revealed   boolean default false,
  audio_plays   int,
  shown_at      timestamptz,
  answered_at   timestamptz default now()
);
comment on table public.placement_responses is
  'Placement v2: one row per administered item. APPEND-ONLY — no client '
  'UPDATE/DELETE policy (that integrity is an anti-cheat control). '
  'Exposure control + resume + Phase-4 calibration.';
create index if not exists idx_placement_resp_session
  on public.placement_responses (session_id, seq);                -- FK + resume order
create index if not exists idx_placement_resp_user_item
  on public.placement_responses (user_id, item_id, answered_at desc); -- 90-day retake
create index if not exists idx_placement_resp_item
  on public.placement_responses (item_id);                        -- exposure + calibration

-- ── 4. placement_item_exposure (optional rollup) ─────────────────────
create table if not exists public.placement_item_exposure (
  item_id    text primary key,
  served     bigint not null default 0,
  updated_at timestamptz not null default now()
);
comment on table public.placement_item_exposure is
  'Placement v2: global per-item served count for cross-session '
  'exposure control. Service-role written; admin >=9 read only.';

-- ── RLS ──────────────────────────────────────────────────────────────
alter table public.placement_sessions       enable row level security;
alter table public.placement_responses      enable row level security;
alter table public.placement_item_exposure  enable row level security;

-- placement_sessions — owner read/insert/update own; admin read.
drop policy if exists "pls_owner_sel" on public.placement_sessions;
create policy "pls_owner_sel" on public.placement_sessions
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "pls_owner_ins" on public.placement_sessions;
create policy "pls_owner_ins" on public.placement_sessions
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "pls_owner_upd" on public.placement_sessions;
create policy "pls_owner_upd" on public.placement_sessions
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "pls_admin_sel" on public.placement_sessions;
create policy "pls_admin_sel" on public.placement_sessions
  for select to authenticated using (public.get_admin_level() >= 9);

-- placement_responses — owner read/insert ONLY (append-only); admin read.
drop policy if exists "plr_owner_sel" on public.placement_responses;
create policy "plr_owner_sel" on public.placement_responses
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "plr_owner_ins" on public.placement_responses;
create policy "plr_owner_ins" on public.placement_responses
  for insert to authenticated with check (auth.uid() = user_id);
-- NO owner UPDATE/DELETE policy — append-only integrity = anti-cheat.
drop policy if exists "plr_admin_sel" on public.placement_responses;
create policy "plr_admin_sel" on public.placement_responses
  for select to authenticated using (public.get_admin_level() >= 9);

-- placement_item_exposure — admin read only; writes via service-role
-- (RLS-exempt). No anon/authenticated general policy by design.
drop policy if exists "plx_admin_sel" on public.placement_item_exposure;
create policy "plx_admin_sel" on public.placement_item_exposure
  for select to authenticated using (public.get_admin_level() >= 9);
