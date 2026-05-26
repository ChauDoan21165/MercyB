-- Vocabulary SRS — spaced repetition for words the learner encounters.
--
-- Two tables. user_vocabulary holds the live SM-2 state per (user, word).
-- review_log is append-only audit so we can recompute / replay if SM-2
-- tunables change later.
--
-- Why two tables: keeping the live state separate from the log lets us
-- mutate user_vocabulary in place on every review (cheap index-only
-- query: `where user_id = $1 and next_review_at <= now()`) while still
-- preserving the per-rating history for analytics and recovery.
--
-- pgcrypto: we always qualify with the `extensions` schema. Bare
-- `gen_random_uuid()` resolves on Supabase prod today, but the qualified
-- form is what survives local supabase-cli rebuilds without
-- search_path config tweaks.
--
-- Reversibility:
--   drop trigger if exists user_vocabulary_set_updated_at on public.user_vocabulary;
--   drop function if exists public.user_vocabulary_set_updated_at();
--   drop table if exists public.review_log;
--   drop table if exists public.user_vocabulary;

-- ── user_vocabulary ─────────────────────────────────────────────────────

create table if not exists public.user_vocabulary (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  ipa text,
  definition_vi text not null default '',
  definition_en text not null default '',
  example_sentence text,
  -- "phoneme:th", "ielts:reading:passage_42", "profession:nail-tech:lesson_5"
  source text,
  -- SM-2 state ----------------------------------------------------------
  -- repetitions: count of consecutive successful reviews. Reset to 0 on
  -- rating 0 (lapse), incremented on 3/4/5.
  repetitions integer not null default 0,
  -- interval_days: days until next review. 0 means "lapsed; revisit
  -- tomorrow" — see next_review_at for the actual schedule, since the
  -- two can diverge for the lapse case (interval=0, next=tomorrow).
  interval_days integer not null default 0,
  -- ease: 1.3..3.0+. Lower bound enforced by the SM-2 algorithm, no
  -- DB-level CHECK so we don't break old rows after tuning changes.
  ease numeric(4,2) not null default 2.5,
  last_rating smallint,
  next_review_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, word)
);

-- Hot-path index for the daily review query
-- (`where user_id = $1 and next_review_at <= now() order by next_review_at`).
create index if not exists user_vocabulary_due_idx
  on public.user_vocabulary (user_id, next_review_at);

-- ── review_log ──────────────────────────────────────────────────────────

create table if not exists public.review_log (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid not null references public.user_vocabulary(id) on delete cascade,
  rating smallint not null check (rating in (0, 3, 4, 5)),
  prev_repetitions integer not null,
  new_repetitions integer not null,
  prev_interval_days integer not null,
  new_interval_days integer not null,
  prev_ease numeric(4,2) not null,
  new_ease numeric(4,2) not null,
  reviewed_at timestamptz not null default now()
);

create index if not exists review_log_user_idx
  on public.review_log (user_id, reviewed_at desc);

create index if not exists review_log_vocab_idx
  on public.review_log (vocabulary_id, reviewed_at desc);

-- ── RLS ─────────────────────────────────────────────────────────────────

alter table public.user_vocabulary enable row level security;
alter table public.review_log enable row level security;

drop policy if exists "user_vocabulary_select_own" on public.user_vocabulary;
create policy "user_vocabulary_select_own"
  on public.user_vocabulary
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_vocabulary_insert_own" on public.user_vocabulary;
create policy "user_vocabulary_insert_own"
  on public.user_vocabulary
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_vocabulary_update_own" on public.user_vocabulary;
create policy "user_vocabulary_update_own"
  on public.user_vocabulary
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_vocabulary_delete_own" on public.user_vocabulary;
create policy "user_vocabulary_delete_own"
  on public.user_vocabulary
  for delete
  using (auth.uid() = user_id);

drop policy if exists "review_log_select_own" on public.review_log;
create policy "review_log_select_own"
  on public.review_log
  for select
  using (auth.uid() = user_id);

drop policy if exists "review_log_insert_own" on public.review_log;
create policy "review_log_insert_own"
  on public.review_log
  for insert
  with check (auth.uid() = user_id);

-- ── updated_at trigger ──────────────────────────────────────────────────

create or replace function public.user_vocabulary_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_vocabulary_set_updated_at on public.user_vocabulary;
create trigger user_vocabulary_set_updated_at
  before update on public.user_vocabulary
  for each row
  execute function public.user_vocabulary_set_updated_at();
