create table if not exists public.placement_v3_endurance_runs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null unique,
  branch text,
  commit_sha text,
  mode text not null default 'local_session',
  started_at timestamptz not null,
  completed_at timestamptz,
  total_iterations integer not null default 0,
  passed_iterations integer not null default 0,
  failed_iterations integer not null default 0,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_endurance_metrics (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_endurance_runs(run_id) on delete cascade,
  iteration integer not null,
  scenario text not null,
  recorded_at timestamptz not null,
  duration_ms integer not null,
  heap_used_mb numeric,
  heap_total_mb numeric,
  retries integer not null default 0,
  fallbacks integer not null default 0,
  timeouts integer not null default 0,
  cefr_overall text,
  completion_state text,
  browser_state jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (run_id, iteration)
);

create table if not exists public.placement_v3_endurance_failures (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_endurance_runs(run_id) on delete cascade,
  iteration integer,
  scenario text,
  category text not null,
  severity text not null,
  signature text not null,
  message text,
  stack text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_integrity_violations (
  id uuid primary key default gen_random_uuid(),
  run_id text,
  session_id text,
  violation_type text not null,
  severity text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists placement_v3_endurance_metrics_run_idx
  on public.placement_v3_endurance_metrics (run_id, iteration);

create index if not exists placement_v3_endurance_failures_run_idx
  on public.placement_v3_endurance_failures (run_id, category);

create index if not exists placement_v3_integrity_violations_run_idx
  on public.placement_v3_integrity_violations (run_id, violation_type);

alter table public.placement_v3_endurance_runs enable row level security;
alter table public.placement_v3_endurance_metrics enable row level security;
alter table public.placement_v3_endurance_failures enable row level security;
alter table public.placement_v3_integrity_violations enable row level security;

revoke all on table public.placement_v3_endurance_runs from anon, authenticated;
revoke all on table public.placement_v3_endurance_metrics from anon, authenticated;
revoke all on table public.placement_v3_endurance_failures from anon, authenticated;
revoke all on table public.placement_v3_integrity_violations from anon, authenticated;

grant all privileges on table public.placement_v3_endurance_runs to service_role;
grant all privileges on table public.placement_v3_endurance_metrics to service_role;
grant all privileges on table public.placement_v3_endurance_failures to service_role;
grant all privileges on table public.placement_v3_integrity_violations to service_role;
