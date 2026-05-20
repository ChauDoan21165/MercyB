-- Placement V3 grading drift replay evidence.
-- Operator-only tables; raw grader output is retained for auditability.

create table if not exists public.placement_v3_replay_runs (
  id text primary key,
  batch_id text not null,
  fixture_version text not null default 'v1',
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null check (status in ('running', 'success', 'error', 'blocked')),
  sample_count integer not null default 0 check (sample_count >= 0),
  success_count integer not null default 0 check (success_count >= 0),
  malformed_count integer not null default 0 check (malformed_count >= 0),
  p95_latency_ms integer not null default 0 check (p95_latency_ms >= 0),
  provider_set text[] not null default '{}'::text[],
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_replay_scores (
  id text primary key,
  run_id text not null references public.placement_v3_replay_runs(id) on delete cascade,
  batch_id text not null,
  sample_id text not null,
  modality text not null check (modality in ('writing', 'reading', 'listening', 'speaking')),
  expected_cefr text not null check (expected_cefr in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  parsed_cefr text check (parsed_cefr in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  provider text not null default 'unknown',
  model text,
  retry_path text[] not null default '{}'::text[],
  taxonomy_tags text[] not null default '{}'::text[],
  latency_ms integer not null default 0 check (latency_ms >= 0),
  tokens_input integer not null default 0 check (tokens_input >= 0),
  tokens_output integer not null default 0 check (tokens_output >= 0),
  status text not null check (status in ('success', 'error', 'timeout', 'malformed')),
  malformed boolean not null default false,
  raw_request jsonb not null default '{}'::jsonb,
  raw_response jsonb not null default '{}'::jsonb,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_drift_alerts (
  id bigserial primary key,
  run_id text references public.placement_v3_replay_runs(id) on delete cascade,
  batch_id text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  scope text not null,
  metric text not null,
  value numeric(12,4) not null default 0,
  threshold numeric(12,4) not null default 0,
  sample_ids text[] not null default '{}'::text[],
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_provider_variance (
  id bigserial primary key,
  run_id text not null references public.placement_v3_replay_runs(id) on delete cascade,
  batch_id text not null,
  provider text not null,
  model text,
  sample_count integer not null default 0 check (sample_count >= 0),
  success_rate numeric(6,4) not null default 0,
  malformed_rate numeric(6,4) not null default 0,
  average_expected_delta numeric(8,4) not null default 0,
  p95_latency_ms integer not null default 0 check (p95_latency_ms >= 0),
  created_at timestamptz not null default now()
);

create index if not exists placement_v3_replay_runs_batch_idx
  on public.placement_v3_replay_runs (batch_id, started_at desc);
create index if not exists placement_v3_replay_scores_run_idx
  on public.placement_v3_replay_scores (run_id);
create index if not exists placement_v3_replay_scores_sample_idx
  on public.placement_v3_replay_scores (sample_id, created_at desc);
create index if not exists placement_v3_replay_scores_modality_idx
  on public.placement_v3_replay_scores (modality, created_at desc);
create index if not exists placement_v3_replay_scores_provider_idx
  on public.placement_v3_replay_scores (provider, created_at desc);
create index if not exists placement_v3_drift_alerts_batch_idx
  on public.placement_v3_drift_alerts (batch_id, created_at desc);
create index if not exists placement_v3_provider_variance_run_idx
  on public.placement_v3_provider_variance (run_id);

alter table public.placement_v3_replay_runs enable row level security;
alter table public.placement_v3_replay_scores enable row level security;
alter table public.placement_v3_drift_alerts enable row level security;
alter table public.placement_v3_provider_variance enable row level security;

create policy "admins read placement replay runs"
  on public.placement_v3_replay_runs
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement replay scores"
  on public.placement_v3_replay_scores
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement drift alerts"
  on public.placement_v3_drift_alerts
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement provider variance"
  on public.placement_v3_provider_variance
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);
