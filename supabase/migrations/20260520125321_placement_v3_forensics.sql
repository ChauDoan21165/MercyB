create table if not exists public.placement_v3_forensic_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  correlation_id text not null,
  occurred_at timestamptz not null default now(),
  sequence integer not null check (sequence >= 0),
  event_type text not null check (
    event_type in (
      'session_event',
      'provider_event',
      'retry_event',
      'fallback_event',
      'latency_event',
      'orchestration_transition',
      'recoverability_state',
      'degraded_result',
      'feature_flag_snapshot',
      'taxonomy_trigger',
      'recommendation_event'
    )
  ),
  severity text not null check (severity in ('debug', 'info', 'warn', 'error', 'fatal')),
  step text not null,
  message text not null,
  feature_flags jsonb not null default '{}'::jsonb,
  failure_snapshot jsonb not null default '{}'::jsonb,
  event jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_failure_timelines (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  correlation_id text not null,
  timeline jsonb not null,
  event_count integer not null default 0,
  recoverability text not null default 'unknown',
  degraded boolean not null default false,
  deterministic text not null default 'unknown',
  missing_sequence_count integer not null default 0,
  provider_switch_count integer not null default 0,
  retry_count integer not null default 0,
  fallback_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_runtime_alerts (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  correlation_id text,
  severity text not null check (severity in ('warn', 'error', 'fatal')),
  alert_type text not null,
  message text not null,
  source_event_id uuid references public.placement_v3_forensic_events(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists placement_v3_forensic_events_session_idx
  on public.placement_v3_forensic_events (session_id, sequence);

create index if not exists placement_v3_forensic_events_correlation_idx
  on public.placement_v3_forensic_events (correlation_id, occurred_at);

create index if not exists placement_v3_forensic_events_type_idx
  on public.placement_v3_forensic_events (event_type, severity, occurred_at desc);

create index if not exists placement_v3_failure_timelines_session_idx
  on public.placement_v3_failure_timelines (session_id, created_at desc);

create index if not exists placement_v3_runtime_alerts_open_idx
  on public.placement_v3_runtime_alerts (severity, alert_type, created_at desc)
  where acknowledged_at is null;

alter table public.placement_v3_forensic_events enable row level security;
alter table public.placement_v3_failure_timelines enable row level security;
alter table public.placement_v3_runtime_alerts enable row level security;

create policy "Admins can read placement v3 forensic events"
  on public.placement_v3_forensic_events
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "Admins can read placement v3 failure timelines"
  on public.placement_v3_failure_timelines
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "Admins can read placement v3 runtime alerts"
  on public.placement_v3_runtime_alerts
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

grant select on public.placement_v3_forensic_events to authenticated;
grant select on public.placement_v3_failure_timelines to authenticated;
grant select on public.placement_v3_runtime_alerts to authenticated;
