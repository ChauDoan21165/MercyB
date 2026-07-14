-- Placement v3 synthetic monitoring marker.
--
-- Additive only. Chau applies this migration via dashboard; do not run
-- supabase db push from agent sessions.

alter table public.placement_v3_sessions
  add column if not exists is_synthetic boolean not null default false;

comment on column public.placement_v3_sessions.is_synthetic is
  'True for automated monitoring placement sessions. Mirrors correction_source_events.is_synthetic so prod monitoring traffic is filterable from learner analytics.';

create index if not exists idx_placement_v3_sessions_is_synthetic_started
  on public.placement_v3_sessions (is_synthetic, started_at desc)
  where is_synthetic = true;
