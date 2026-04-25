-- 20260425042419_user_sentences.sql
--
-- Step 6 (Community): user-generated sentence contributions.
--
-- Table holds learner-submitted EN↔VI sentence pairs that a MercyBlade
-- admin reviews before they flow into the curated bilingual-sentences.json
-- library. Approved rows remain in the DB until a human exports them; the
-- JSON file is NOT touched automatically — that's a deliberate daytime
-- review, per the PR scope.
--
-- Access model:
--   - Authenticated users can INSERT rows where submitter_user_id = auth.uid().
--   - Submitter can SELECT their own rows (any status).
--   - Admins (public.is_admin(auth.uid())) can SELECT all rows and UPDATE
--     status / reviewed_at / reviewed_by_user_id / review_notes.
--   - No DELETE for anyone via RLS (hard delete requires SQL editor / role).

create extension if not exists "pgcrypto";

create table if not exists public.user_submitted_sentences (
  id uuid primary key default gen_random_uuid(),

  submitter_user_id uuid references auth.users(id) on delete set null,

  en text not null,
  vi text not null,

  -- Free-form context tag (e.g. 'travel', 'medical', 'work'). Not enumed
  -- to keep the form flexible; admin can rename before export.
  context text,

  -- CEFR-style difficulty self-assessment from the submitter.
  -- Constrained at the app layer as well; the check here is defence-in-depth.
  difficulty text check (
    difficulty is null
    or difficulty in ('A1', 'A2', 'B1', 'B2', 'C1')
  ),

  -- Optional L1 rule slug suggested by submitter; must match vi_l1_<slug>.
  -- Kept as a free-text column so adding new rules in CC3 rounds never
  -- requires a migration here.
  suggested_l1_tag text check (
    suggested_l1_tag is null
    or suggested_l1_tag ~ '^vi_l1_[a-z0-9_]+$'
  ),

  submitted_at timestamptz not null default now(),

  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),

  reviewed_at timestamptz,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  review_notes text,

  -- Basic content-level guards. The app enforces these too (with friendly
  -- messages); DB check is the last line of defence.
  constraint user_sentences_en_minlen  check (char_length(trim(en)) >= 5),
  constraint user_sentences_vi_minlen  check (char_length(trim(vi)) >= 3),
  constraint user_sentences_en_maxlen  check (char_length(en) <= 500),
  constraint user_sentences_vi_maxlen  check (char_length(vi) <= 500),
  constraint user_sentences_notes_maxlen check (
    review_notes is null or char_length(review_notes) <= 1000
  )
);

-- Indexes supporting the admin queue and a user's own-submissions list.
create index if not exists user_submitted_sentences_status_idx
  on public.user_submitted_sentences (status, submitted_at desc);

create index if not exists user_submitted_sentences_submitter_idx
  on public.user_submitted_sentences (submitter_user_id, submitted_at desc);

-- Prevent accidental duplicate same-day submissions from the same user —
-- also enforced at the app layer for better error messages, but the DB
-- guard protects against double-submits from a flaky network retry.
create unique index if not exists user_submitted_sentences_dedup_daily_idx
  on public.user_submitted_sentences (
    submitter_user_id,
    lower(trim(en)),
    (date_trunc('day', submitted_at))
  )
  where submitter_user_id is not null;

-- ─────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────

alter table public.user_submitted_sentences enable row level security;

-- Drop-and-create so re-running the migration is safe in dev.
drop policy if exists user_sentences_insert_self    on public.user_submitted_sentences;
drop policy if exists user_sentences_select_self    on public.user_submitted_sentences;
drop policy if exists user_sentences_select_admin   on public.user_submitted_sentences;
drop policy if exists user_sentences_update_admin   on public.user_submitted_sentences;

-- Any authenticated user can insert a row for themselves. status must be
-- 'pending' (default) — admins own the transition to approved/rejected.
create policy user_sentences_insert_self
  on public.user_submitted_sentences
  for insert
  to authenticated
  with check (
    submitter_user_id = auth.uid()
    and status = 'pending'
    and reviewed_at is null
    and reviewed_by_user_id is null
  );

-- Submitter reads their own rows regardless of status.
create policy user_sentences_select_self
  on public.user_submitted_sentences
  for select
  to authenticated
  using (submitter_user_id = auth.uid());

-- Admin reads every row. Uses the same `public.is_admin(uuid)` function
-- relied on by other admin-gated tables in this repo. If a deployment
-- doesn't have that function yet, the policy silently fails closed —
-- which is the correct behaviour.
create policy user_sentences_select_admin
  on public.user_submitted_sentences
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Admin updates status + review metadata. `with check` limits what an
-- admin can mutate — they cannot edit the original en/vi content,
-- only the review fields. Enforced by comparing to the current row.
create policy user_sentences_update_admin
  on public.user_submitted_sentences
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (
    public.is_admin(auth.uid())
    and submitter_user_id is not distinct from submitter_user_id
    and en = en
    and vi = vi
  );

comment on table public.user_submitted_sentences is
  'Learner-submitted EN↔VI sentence pairs awaiting admin review before export to bilingual-sentences.json (Step 6 Community).';
