-- User-generated mock-interview prompts (community-curated).
--
-- Two tables:
--   1. user_interview_prompts — submission state (pending → approved →
--      published OR rejected). One row per submitted question.
--   2. user_interview_prompt_votes — append-only per-user vote ledger.
--      A row per (user_id, prompt_id, vote_type) — PK enforces "one
--      vote per user per kind". Triggers keep the parent row's
--      upvotes_count / flag_count cached for cheap sort-by-popular.
--
-- Workflow:
--   - Submitter INSERTs a prompt with status='pending'. Submitter sees
--     own at any status (so they can read rejection_reason).
--   - Public sees only status='published' rows.
--   - Admin (>= 9) flips status to 'approved' or 'published' (we treat
--     approve+publish as the canonical action; 'approved' exists for
--     two-step workflows / future scheduling).
--   - 5 flags auto-pulls the prompt to status='rejected' via trigger.
--   - Self-upvotes blocked at the trigger layer.
--
-- Mirrors the user_stories pattern (20260523000000_user_stories.sql)
-- and the teacher-feedback shape (20260427000002_teacher_feedback.sql)
-- so reviewers can grok this in 60 seconds.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.user_interview_prompt_votes;
--   DROP TABLE IF EXISTS public.user_interview_prompts;
--   DROP TYPE  IF EXISTS public.interview_prompt_vote_type;
--   DROP TYPE  IF EXISTS public.interview_prompt_question_type;
--   DROP TYPE  IF EXISTS public.interview_prompt_difficulty;
--   DROP TYPE  IF EXISTS public.interview_prompt_status;

-- ── Enums ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'interview_prompt_status') then
    create type public.interview_prompt_status as enum (
      'pending', 'approved', 'published', 'rejected'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'interview_prompt_difficulty') then
    create type public.interview_prompt_difficulty as enum (
      'easy', 'medium', 'hard'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'interview_prompt_question_type') then
    create type public.interview_prompt_question_type as enum (
      'behavioral', 'technical', 'situational', 'culture_fit', 'salary', 'open_ended'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'interview_prompt_vote_type') then
    create type public.interview_prompt_vote_type as enum ('up', 'flag');
  end if;
end$$;

-- ── user_interview_prompts ───────────────────────────────────────────
create table if not exists public.user_interview_prompts (
  id uuid primary key default gen_random_uuid(),
  submitter_user_id uuid not null references public.profiles(id) on delete cascade,
  question_text_en text not null check (char_length(question_text_en) between 5 and 500),
  question_text_vi text check (char_length(question_text_vi) <= 500),
  profession text not null check (profession in
    ('nail-tech','restaurant','customer-service','healthcare','tech-worker','hospitality','drivers')),
  context text check (char_length(context) <= 200),
  difficulty public.interview_prompt_difficulty not null default 'medium',
  question_type public.interview_prompt_question_type not null default 'behavioral',
  status public.interview_prompt_status not null default 'pending',
  upvotes_count int not null default 0,
  flag_count int not null default 0,
  submitter_anonymous boolean not null default true,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz,
  rejection_reason text
);

comment on table public.user_interview_prompts is
  'Community-curated mock-interview questions. Pending until admin '
  'approves; auto-rejected at 5+ flags. Public sees only published.';

-- Hot read paths: the public community page filters status='published'
-- (often combined with profession). Partial indexes keep the index
-- tiny since pending/rejected rows are admin-only.
create index if not exists user_interview_prompts_status_idx
  on public.user_interview_prompts (status)
  where status = 'published';

create index if not exists user_interview_prompts_profession_idx
  on public.user_interview_prompts (profession)
  where status = 'published';

create index if not exists user_interview_prompts_submitter_idx
  on public.user_interview_prompts (submitter_user_id, submitted_at desc);

-- ── user_interview_prompt_votes ──────────────────────────────────────
create table if not exists public.user_interview_prompt_votes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.user_interview_prompts(id) on delete cascade,
  vote_type public.interview_prompt_vote_type not null,
  voted_at timestamptz not null default now(),
  primary key (user_id, prompt_id, vote_type)
);

create index if not exists user_interview_prompt_votes_prompt_idx
  on public.user_interview_prompt_votes (prompt_id);

-- Daily-cap window query — tightly bounded by user_id + voted_at.
create index if not exists user_interview_prompt_votes_user_voted_idx
  on public.user_interview_prompt_votes (user_id, voted_at desc);

-- ── Triggers ─────────────────────────────────────────────────────────

-- Block self-upvotes. Flagging your own row is allowed (you might want
-- to retract a submission you regret) but inflating your own count is
-- not.
create or replace function public.user_interview_prompt_votes_block_self_upvote()
returns trigger
language plpgsql
as $$
declare
  v_submitter uuid;
begin
  if new.vote_type = 'up' then
    select submitter_user_id into v_submitter
      from public.user_interview_prompts
      where id = new.prompt_id;
    if v_submitter is not null and v_submitter = new.user_id then
      raise exception 'cannot upvote your own prompt'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_block_self_upvote on public.user_interview_prompt_votes;
create trigger trg_block_self_upvote
  before insert on public.user_interview_prompt_votes
  for each row execute function public.user_interview_prompt_votes_block_self_upvote();

-- Recompute counts on parent. Cheap because the partial index above
-- means we can re-aggregate from the votes table in O(votes_for_prompt)
-- and we only do it when a vote is added or removed.
create or replace function public.user_interview_prompt_votes_recount()
returns trigger
language plpgsql
as $$
declare
  v_prompt uuid;
  v_up int;
  v_flag int;
begin
  v_prompt := coalesce(new.prompt_id, old.prompt_id);
  select
    count(*) filter (where vote_type = 'up'),
    count(*) filter (where vote_type = 'flag')
    into v_up, v_flag
    from public.user_interview_prompt_votes
    where prompt_id = v_prompt;

  update public.user_interview_prompts
     set upvotes_count = v_up,
         flag_count = v_flag,
         status = case
           when status = 'published' and v_flag >= 5 then 'rejected'::public.interview_prompt_status
           else status
         end,
         rejection_reason = case
           when status = 'published' and v_flag >= 5 then coalesce(rejection_reason, 'auto-pulled (5+ flags)')
           else rejection_reason
         end
   where id = v_prompt;

  return null;
end;
$$;

drop trigger if exists trg_votes_recount on public.user_interview_prompt_votes;
create trigger trg_votes_recount
  after insert or delete on public.user_interview_prompt_votes
  for each row execute function public.user_interview_prompt_votes_recount();

-- ── RLS ──────────────────────────────────────────────────────────────
alter table public.user_interview_prompts enable row level security;
alter table public.user_interview_prompt_votes enable row level security;

-- Public can read only published rows. Anon role hits this.
drop policy if exists "public_select_published" on public.user_interview_prompts;
create policy "public_select_published"
  on public.user_interview_prompts
  for select
  using (status = 'published');

-- Submitter can read own at any status (so they see rejection reasons).
drop policy if exists "submitter_select_own" on public.user_interview_prompts;
create policy "submitter_select_own"
  on public.user_interview_prompts
  for select
  using (auth.uid() = submitter_user_id);

-- Submitter can INSERT their own pending row. status MUST be 'pending'
-- on insert; admin transitions afterwards.
drop policy if exists "submitter_insert_pending" on public.user_interview_prompts;
create policy "submitter_insert_pending"
  on public.user_interview_prompts
  for insert
  with check (
    auth.uid() = submitter_user_id
    and status = 'pending'
  );

-- Submitter can DELETE own pending (cancel before review). Once
-- approved/rejected the row is admin-managed.
drop policy if exists "submitter_delete_pending" on public.user_interview_prompts;
create policy "submitter_delete_pending"
  on public.user_interview_prompts
  for delete
  using (
    auth.uid() = submitter_user_id
    and status = 'pending'
  );

-- Admin (>= 9) full access for moderation.
drop policy if exists "admin_all" on public.user_interview_prompts;
create policy "admin_all"
  on public.user_interview_prompts
  for all
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- Votes: any authenticated user can read counts (the public page needs
-- this to know which prompts the current user already voted on);
-- INSERTs and DELETEs are scoped to the calling user.
drop policy if exists "votes_select_all" on public.user_interview_prompt_votes;
create policy "votes_select_all"
  on public.user_interview_prompt_votes
  for select
  using (true);

drop policy if exists "votes_insert_own" on public.user_interview_prompt_votes;
create policy "votes_insert_own"
  on public.user_interview_prompt_votes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "votes_delete_own" on public.user_interview_prompt_votes;
create policy "votes_delete_own"
  on public.user_interview_prompt_votes
  for delete
  using (auth.uid() = user_id);

-- ── Grants ──────────────────────────────────────────────────────────
grant select on public.user_interview_prompts to anon, authenticated;
grant insert, delete on public.user_interview_prompts to authenticated;
grant select, insert, delete on public.user_interview_prompt_votes to authenticated;
