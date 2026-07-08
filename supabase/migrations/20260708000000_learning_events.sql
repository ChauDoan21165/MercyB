-- WP-PHASE2-01 v2 — durable learning-event sink.
--
-- OUTPUT ONLY. Apply MANUALLY via the Supabase SQL Editor or the psql pooler.
-- Do NOT run `supabase db push` (CLI migration state is known-drifted for this
-- project — see CLAUDE.md). This file is the reviewed source of truth for the
-- table; applying it is a human step (see the WP report's post-merge steps).
--
-- Stores only safe, sanitized learning events (no raw learner text, audio, or
-- transcripts — the client sanitizes before queueing). RLS restricts every row
-- to its owning learner.

create extension if not exists "pgcrypto";

create table if not exists public.learning_events (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  event_type         text not null,
  rule_or_detector_id text null,
  payload            jsonb not null default '{}'::jsonb,
  client_ts          timestamptz,
  session_id         text,
  app_version        text,
  created_at         timestamptz not null default now(),
  -- Feedback/correction-class events MUST carry provenance (which rule or
  -- detector produced them); other event types may omit it.
  constraint learning_events_provenance_chk check (
    (event_type not like 'feedback_%' and event_type not like 'correction_%')
    or rule_or_detector_id is not null
  )
);

-- Provenance lookups (only the rows that have it).
create index if not exists learning_events_rule_detector_idx
  on public.learning_events (rule_or_detector_id, created_at)
  where rule_or_detector_id is not null;

-- Per-learner timeline reads.
create index if not exists learning_events_user_created_idx
  on public.learning_events (user_id, created_at);

-- Row-level security: a learner may insert and read only their own rows.
alter table public.learning_events enable row level security;

drop policy if exists learning_events_insert_own on public.learning_events;
create policy learning_events_insert_own
  on public.learning_events
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists learning_events_select_own on public.learning_events;
create policy learning_events_select_own
  on public.learning_events
  for select
  to authenticated
  using (user_id = auth.uid());

-- No UPDATE and no DELETE policies are defined. Under RLS that means UPDATE and
-- DELETE are denied for all non-service callers: learning events are immutable
-- from the client. (The service_role key bypasses RLS for any admin cleanup.)
