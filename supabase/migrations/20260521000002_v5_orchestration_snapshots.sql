-- V5-004: Orchestration Snapshots table
-- V5-managed table storing V4-shaped OrchestrationSnapshot data.
-- Feature-gated behind V5_ENABLED.
-- RLS: user-scoped read/write, admin read-all.
-- Idempotent: unique(user_id, snapshot_id).

create table if not exists v4_orchestration_snapshots (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  snapshot_id     text not null,
  snapshot_type   text not null check (snapshot_type in ('FULL', 'COMPACT')),
  schema_version  text not null,
  content_hash    text not null,
  payload         jsonb not null,
  device_id       text,
  vector_clock    jsonb,
  event_count     integer not null default 0,
  created_at      timestamptz not null default now(),

  constraint v4_orchestration_snapshots_user_snapshot_unique unique (user_id, snapshot_id),
  constraint v4_orchestration_snapshots_snapshot_id_length_check
    check (char_length(snapshot_id) <= 256),
  constraint v4_orchestration_snapshots_schema_version_check
    check (schema_version = 'placement-v4-orchestrator-v1')
);

create index if not exists idx_v4_orchestration_snapshots_user_id
  on v4_orchestration_snapshots (user_id);

create index if not exists idx_v4_orchestration_snapshots_content_hash
  on v4_orchestration_snapshots (content_hash);

alter table v4_orchestration_snapshots enable row level security;

create policy "Users can read own orchestration snapshots"
  on v4_orchestration_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert own orchestration snapshots"
  on v4_orchestration_snapshots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own orchestration snapshots"
  on v4_orchestration_snapshots for update
  using (auth.uid() = user_id);

create policy "Admins can read all orchestration snapshots"
  on v4_orchestration_snapshots for select
  using (get_admin_level(auth.uid()) >= 9);
