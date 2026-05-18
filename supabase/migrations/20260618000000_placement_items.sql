-- 20260618000000_placement_items.sql
--
-- Placement Test v2 — the server-only item bank (Phase 2, PR-V2-4).
-- Sequence doc: /private/tmp/placement-test-v2-phase2-pr-sequence.md.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau-applied, NOT auto-applied
-- (CLAUDE.md Phase-2 manual gate; agents never `supabase db push`).
--
-- Schema decisions D1–D4 are now CONFIRMED (Chau, 2026-05-18). They are
-- recorded below with the chosen option + rationale. itemBank.ts (the
-- pure validate/index layer) is decision-INDEPENDENT — it types against
-- the `Item` TS interface, not these column names; the row→Item mapping
-- is the edge fn's job (PR-V2-8).
--
-- ── Locked context ────────────────────────────────────────────────────
-- Q1 server-authoritative + Q2: item content and the ANSWER KEY live
-- EXCLUSIVELY server-side; no public JSON bank file in the repo; the
-- placement-session edge fn (PR-V2-8) reads via the service-role key.
--
-- ── D1 = B (CONFIRMED): RLS on; NO anon/authenticated general policy;
--          ONE admin-only SELECT for inspection/debugging ─────────────
-- RLS enabled. No anon/authenticated read. service_role bypasses RLS
-- (built-in) for normal edge-fn operation. PLUS a single admin SELECT
-- so a logged-in admin can inspect items for debugging — a *controlled*
-- risk (requires auth + an admin check), not an anonymous hole.
--
-- ADMIN-GATE RECONCILIATION (verified before copying the sketch, as
-- instructed): the dispatch sketched `profiles.tier >= 9`. That is the
-- PAID-tier axis (profiles.tier = 0..N, 0 = free — five non-negotiables
-- / project memory "no VIP tier"), NOT an admin signal: a high-paying
-- learner would wrongly get the answer key. The HOUSE admin gate is the
-- SECURITY-DEFINER fn `public.get_admin_level()` over `admin_users`
-- (defined 20251209061329, EXECUTE-restored later). Recent migrations
-- (e.g. 20260533000000_teacher_feedback.sql) gate admin reads with
-- `public.get_admin_level() >= 9`. This migration uses that exact
-- idiom — matching convention over the sketch, per the explicit
-- "verify, match the existing convention" instruction.
--
-- ── D2 = ship EMPTY (CONFIRMED) ──────────────────────────────────────
-- No seed INSERTs. Phase-3 authoring fills this table. The engine runs
-- end-to-end on an empty bank (selector → 'bank_exhausted').
--
-- ── D3 = HYBRID (CONFIRMED) ──────────────────────────────────────────
-- Indexed scalar columns the selector/exposure logic filters on —
-- EXACT names per the decision: id, cefr_level, item_type, difficulty,
-- discrimination, bank_version, active, is_l1_transfer — plus a single
-- `content jsonb` holding the render + ANSWER payload (prompt, passage,
-- options, correctOptionId, audio, transcript, skill, l1_tags,
-- param_source, meta). `skill`, `l1_tags`, `param_source` are NOT in
-- the decided indexed-scalar set (used only post-hoc on the in-memory
-- Item, never as a DB filter) so they live in `content`. Standard
-- CMS pattern: queryable + authoring-flexible; the answer key is one
-- protected column; Phase-3 / Item-shape evolution needs no migration.
--
-- ── D4 = A (CONFIRMED): per-row bank_version + active; no meta table ──
-- YAGNI on a separate placement_bank_meta. Each row carries
-- `bank_version`; `active` soft-retires WITHOUT delete so historical
-- placement_responses / exposure stay referentially sane across bank
-- revisions. Edge fn loads `where active and bank_version = <current>`.
-- Trivial to migrate to a meta table later if equating gets complex.
--
-- ── Reversibility ─────────────────────────────────────────────────────
--   DROP TABLE IF EXISTS public.placement_items;   (no types created)
--
-- Idempotent (create … if not exists, drop policy if exists); safe to
-- re-run. No BEGIN/COMMIT wrapper — matches recent house migrations
-- (20260533000000_teacher_feedback.sql), not the older design-doc claim
-- (source-of-truth = current codebase reality).

create table if not exists public.placement_items (
  id             text primary key,                       -- stable, e.g. 'rd_b1_017'
  bank_version   text    not null,                        -- D4 equating anchor
  active         boolean not null default true,           -- D4 soft-retire
  item_type      text    not null
    check (item_type in ('reading','listening','grammar','vocabulary','writing_sample')),
  cefr_level     text    not null
    check (cefr_level in ('pre_a1','A1','A2','B1','B2','C1','C2')),
  difficulty     numeric not null,                        -- IRT b_i
  discrimination numeric not null check (discrimination > 0), -- IRT a_i (2PL: a>0)
  is_l1_transfer boolean not null default false,          -- VI L1-transfer item?
  -- D3: render + ANSWER payload (prompt, passage, options,
  -- correctOptionId, audio, transcript, skill, l1_tags, param_source,
  -- meta). The answer key (correctOptionId / listening transcript)
  -- lives ONLY here — never a client-reachable column or repo file (Q2).
  content        jsonb   not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.placement_items is
  'Placement v2 server-only item bank (answer key in content jsonb). '
  'RLS: no anon/authenticated read; service-role (edge fn) full; admin '
  'get_admin_level()>=9 SELECT for inspection only (D1=B). Ships empty '
  '(D2); Phase-3 authoring fills it. See migration header D1-D4.';

-- Candidate filtering the selector does server-side (PR-V2-5): the
-- active current-bank items of a type near a difficulty.
create index if not exists idx_placement_items_select
  on public.placement_items (active, bank_version, item_type, difficulty);
create index if not exists idx_placement_items_cefr
  on public.placement_items (cefr_level);

-- D1=B — RLS on. No anon/authenticated GENERAL policy and NO table
-- grants → ordinary clients denied. service_role is RLS-exempt (the
-- edge fn's normal path). The ONE policy below is the intentional,
-- documented admin-inspection path — NOT an oversight.
alter table public.placement_items enable row level security;

drop policy if exists "placement_items_admin_read" on public.placement_items;
create policy "placement_items_admin_read"
  on public.placement_items
  for select
  to authenticated
  using (public.get_admin_level() >= 9);   -- house admin gate, NOT profiles.tier

-- Deliberately ABSENT (do not add without revisiting the answer-key
-- exposure): any anon/authenticated INSERT/UPDATE/DELETE/general-SELECT
-- policy, and any GRANT to anon/authenticated. Authoring (Phase 3) and
-- calibration writes go through the service-role only.
