-- WP-CORR-SRC-1 — text-free correction-source counter.
--
-- OUTPUT ONLY. Apply MANUALLY via the Supabase SQL Editor or the psql pooler.
-- Do NOT run `supabase db push`.
--
-- Stores only correction routing metadata. It must never store learner text,
-- message text, prompts, responses, transcripts, request bodies, or error bodies.

create extension if not exists "pgcrypto";

create table if not exists public.correction_source_events (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  source       text not null,
  lang_pair    text null,
  is_synthetic boolean not null default false,

  constraint correction_source_events_source_chk
    check (source in (
      'local_corrected',
      'local_unchanged_server_attempt',
      'server_corrected',
      'server_no_correction',
      'server_failed'
    )),
  constraint correction_source_events_lang_pair_chk
    check (lang_pair is null or (length(lang_pair) <= 17 and lang_pair ~ '^[a-z-]+$'))
);

create index if not exists correction_source_events_created_idx
  on public.correction_source_events (created_at desc);

create index if not exists correction_source_events_source_created_idx
  on public.correction_source_events (source, created_at desc);

create index if not exists correction_source_events_lang_pair_created_idx
  on public.correction_source_events (lang_pair, created_at desc)
  where lang_pair is not null;

comment on table public.correction_source_events is
  'Text-free correction source counter for local-vs-server split measurement. No learner text, message text, prompts, responses, transcripts, request bodies, or error bodies.';

alter table public.correction_source_events enable row level security;

drop policy if exists correction_source_events_anon_insert on public.correction_source_events;
create policy correction_source_events_anon_insert
  on public.correction_source_events
  for insert
  to anon
  with check (true);

drop policy if exists correction_source_events_auth_insert on public.correction_source_events;
create policy correction_source_events_auth_insert
  on public.correction_source_events
  for insert
  to authenticated
  with check (true);

drop policy if exists correction_source_events_admin_select on public.correction_source_events;
create policy correction_source_events_admin_select
  on public.correction_source_events
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

revoke all on public.correction_source_events from anon, authenticated;
grant insert on public.correction_source_events to anon, authenticated;
grant select on public.correction_source_events to authenticated;
