-- V5-004: Telemetry Events append-only log
-- V5-managed table storing V4-shaped TelemetryEvent data.
-- Feature-gated behind V5_ENABLED.
-- RLS: user-scoped read/write, admin read-all.
-- Idempotent: unique(user_id, event_id).

create table if not exists v4_telemetry_events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  event_id        text not null,
  event_type      text not null,
  occurred_at     timestamptz not null,
  session_id      text,
  payload         jsonb not null,
  created_at      timestamptz not null default now(),

  constraint v4_telemetry_events_user_event_unique unique (user_id, event_id),
  constraint v4_telemetry_events_event_id_length_check
    check (char_length(event_id) <= 128)
);

create index if not exists idx_v4_telemetry_events_user_id
  on v4_telemetry_events (user_id);

create index if not exists idx_v4_telemetry_events_occurred_at
  on v4_telemetry_events (occurred_at);

create index if not exists idx_v4_telemetry_events_event_type
  on v4_telemetry_events (event_type);

alter table v4_telemetry_events enable row level security;

create policy "Users can read own telemetry events"
  on v4_telemetry_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own telemetry events"
  on v4_telemetry_events for insert
  with check (auth.uid() = user_id);

create policy "Admins can read all telemetry events"
  on v4_telemetry_events for select
  using (get_admin_level(auth.uid()) >= 9);
