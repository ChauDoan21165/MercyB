-- User testimonial collection — Vietnamese-first stories surface.
--
-- Schema for `user_stories`: pending → approved → published moderation
-- pipeline. Public reads gated to status = 'published'; owners always
-- see their own rows; admin level >= 9 sees everything for moderation.
--
-- Why this lives in its own table (not blog_posts or feedback):
--   - Distinct lifecycle (5-state moderation) and distinct fields
--     (before/after IELTS, profession, photo).
--   - RLS shape is unique: the *owner* keeps read access through every
--     status (so they can see why it was rejected) while *anon* only
--     sees published rows.
--
-- Photos live in the existing `share-cards` bucket under the
-- `stories/<user_id>/` prefix. No new bucket — that pattern already
-- has owner-write + public-read RLS proven by the Facebook score-card
-- feature (see 20260509000000_share_cards_bucket.sql).
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.user_stories;
--   DROP TYPE  IF EXISTS public.story_status;
--   DROP TYPE  IF EXISTS public.story_context;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS story_prompt_email_sent_at;

-- ── Enums ──────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'story_status') then
    create type public.story_status as enum (
      'pending', 'approved', 'rejected', 'published', 'archived'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'story_context') then
    create type public.story_context as enum (
      'before_mercyblade', 'progress_milestone', 'specific_win'
    );
  end if;
end$$;

-- ── Table ──────────────────────────────────────────────────────────────
create table if not exists public.user_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,

  submitted_at  timestamptz not null default now(),
  approved_at   timestamptz,
  published_at  timestamptz,

  status public.story_status not null default 'pending',

  -- Vietnamese is the source of truth (CLAUDE.md non-negotiable #1).
  -- English is optional; if absent, the public page renders VI only.
  story_text_vi text not null check (char_length(story_text_vi) <= 1000),
  story_text_en text check (char_length(story_text_en) <= 1000),

  display_name text not null,
  display_avatar_url text,

  context public.story_context,

  -- Score deltas. Numeric(3,1) handles 0.0..9.9 (IELTS bands). VSTEP is
  -- text because it's a level label (B1, B2, C1) not a number.
  ielts_band_before numeric(3,1),
  ielts_band_after  numeric(3,1),
  vstep_level_before text,
  vstep_level_after  text,

  profession text,

  photo_consent_given boolean not null default false,

  tags text[] not null default '{}',

  rejection_reason text,
  takedown_requested_at timestamptz
);

-- ── Indexes ────────────────────────────────────────────────────────────
-- Partial index on status='published' is the only hot path the public
-- /stories index actually scans; full status index is unnecessary.
create index if not exists user_stories_status_published_idx
  on public.user_stories (status)
  where status = 'published';

create index if not exists user_stories_user_id_idx
  on public.user_stories (user_id);

create index if not exists user_stories_tags_idx
  on public.user_stories using gin (tags);

-- ── RLS ────────────────────────────────────────────────────────────────
alter table public.user_stories enable row level security;

-- Owner can read their own rows at any status (they need to see why a
-- rejection happened, plus their published copy).
drop policy if exists "owner_select" on public.user_stories;
create policy "owner_select"
  on public.user_stories
  for select
  using (auth.uid() = user_id);

-- Public (anon + authenticated) can read only published rows.
drop policy if exists "public_select_published" on public.user_stories;
create policy "public_select_published"
  on public.user_stories
  for select
  using (status = 'published');

-- Owner can insert their own pending story.
drop policy if exists "owner_insert" on public.user_stories;
create policy "owner_insert"
  on public.user_stories
  for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Owner can update their own pending row (edit before approval) OR
-- their own published row (request takedown). The WITH CHECK bars
-- privilege escalation: the row must remain owned by the same user
-- after the update.
drop policy if exists "owner_update_pending" on public.user_stories;
create policy "owner_update_pending"
  on public.user_stories
  for update
  using (auth.uid() = user_id and status in ('pending', 'published'))
  with check (auth.uid() = user_id);

-- Owner can delete only pending rows. Approved / published rows stay
-- in the table for the audit trail; archive is the takedown path.
drop policy if exists "owner_delete_pending" on public.user_stories;
create policy "owner_delete_pending"
  on public.user_stories
  for delete
  using (auth.uid() = user_id and status = 'pending');

-- Admin full access (level >= 9 mirrors other admin policies in this
-- repo; see 20260505000000_public_api_dev_keys.sql).
drop policy if exists "admin_select" on public.user_stories;
create policy "admin_select"
  on public.user_stories
  for select
  using (public.get_admin_level() >= 9);

drop policy if exists "admin_update" on public.user_stories;
create policy "admin_update"
  on public.user_stories
  for update
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- ── Grants ─────────────────────────────────────────────────────────────
grant select on public.user_stories to anon, authenticated;
grant insert, update, delete on public.user_stories to authenticated;

-- ── Email gate column on profiles ──────────────────────────────────────
-- Tracks whether the milestone "you have a story" email has fired for
-- a given user. Once-ever (per user) — never resend even if eligibility
-- bounces. Set by the story-prompt-email edge function.
alter table public.profiles
  add column if not exists story_prompt_email_sent_at timestamptz;
