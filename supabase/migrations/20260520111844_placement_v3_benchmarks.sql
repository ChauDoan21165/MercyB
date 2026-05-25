-- Placement V3 production benchmarking harness.
-- Stores operator-run benchmark evidence only; no user-visible product data.

create table if not exists public.placement_v3_benchmark_runs (
  id text primary key,
  suite_id text not null,
  scenario_id text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null check (status in ('success', 'error', 'timeout', 'skipped')),
  total_duration_ms integer not null default 0 check (total_duration_ms >= 0),
  total_tokens_input integer not null default 0 check (total_tokens_input >= 0),
  total_tokens_output integer not null default 0 check (total_tokens_output >= 0),
  estimated_cost_usd numeric(12,6) not null default 0 check (estimated_cost_usd >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_benchmark_steps (
  id text primary key,
  run_id text not null references public.placement_v3_benchmark_runs(id) on delete cascade,
  scenario_id text not null,
  step_id text not null,
  modality text not null,
  provider text not null,
  model text,
  started_at timestamptz not null,
  completed_at timestamptz,
  duration_ms integer not null default 0 check (duration_ms >= 0),
  status text not null check (status in ('success', 'error', 'timeout', 'skipped')),
  tokens_input integer not null default 0 check (tokens_input >= 0),
  tokens_output integer not null default 0 check (tokens_output >= 0),
  estimated_cost_usd numeric(12,6) not null default 0 check (estimated_cost_usd >= 0),
  attempts text[] not null default '{}'::text[],
  failover boolean not null default false,
  error_code text,
  error_message text,
  cefr_estimate text,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_benchmark_provider_usage (
  id bigserial primary key,
  run_id text not null references public.placement_v3_benchmark_runs(id) on delete cascade,
  step_row_id text not null references public.placement_v3_benchmark_steps(id) on delete cascade,
  provider text not null,
  model text,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  latency_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_benchmark_failover_events (
  id bigserial primary key,
  run_id text not null references public.placement_v3_benchmark_runs(id) on delete cascade,
  step_row_id text not null references public.placement_v3_benchmark_steps(id) on delete cascade,
  scenario_id text not null,
  step_id text not null,
  from_provider text,
  to_provider text,
  attempts text[] not null default '{}'::text[],
  recovered boolean not null default false,
  latency_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_benchmark_error_events (
  id bigserial primary key,
  run_id text not null references public.placement_v3_benchmark_runs(id) on delete cascade,
  step_row_id text references public.placement_v3_benchmark_steps(id) on delete cascade,
  scenario_id text not null,
  step_id text,
  modality text,
  provider text,
  error_code text,
  error_message text,
  latency_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists placement_v3_benchmark_runs_suite_idx
  on public.placement_v3_benchmark_runs (suite_id, started_at desc);
create index if not exists placement_v3_benchmark_runs_scenario_idx
  on public.placement_v3_benchmark_runs (scenario_id, started_at desc);
create index if not exists placement_v3_benchmark_steps_run_idx
  on public.placement_v3_benchmark_steps (run_id);
create index if not exists placement_v3_benchmark_steps_modality_idx
  on public.placement_v3_benchmark_steps (modality, started_at desc);
create index if not exists placement_v3_benchmark_steps_provider_idx
  on public.placement_v3_benchmark_steps (provider, started_at desc);
create index if not exists placement_v3_benchmark_failover_run_idx
  on public.placement_v3_benchmark_failover_events (run_id);
create index if not exists placement_v3_benchmark_error_run_idx
  on public.placement_v3_benchmark_error_events (run_id);

alter table public.placement_v3_benchmark_runs enable row level security;
alter table public.placement_v3_benchmark_steps enable row level security;
alter table public.placement_v3_benchmark_provider_usage enable row level security;
alter table public.placement_v3_benchmark_failover_events enable row level security;
alter table public.placement_v3_benchmark_error_events enable row level security;

create policy "admins read placement benchmark runs"
  on public.placement_v3_benchmark_runs
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement benchmark steps"
  on public.placement_v3_benchmark_steps
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement benchmark provider usage"
  on public.placement_v3_benchmark_provider_usage
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement benchmark failovers"
  on public.placement_v3_benchmark_failover_events
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "admins read placement benchmark errors"
  on public.placement_v3_benchmark_error_events
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);
