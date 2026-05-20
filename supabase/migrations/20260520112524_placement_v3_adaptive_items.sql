create table if not exists public.placement_v3_generated_items (
  id uuid primary key default gen_random_uuid(),
  batch_id text not null,
  cycle integer not null default 0,
  prompt_version text not null,
  modality text not null check (modality in ('reading', 'writing', 'listening', 'speaking')),
  target_cefr text not null check (target_cefr in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  learner_l1 text not null default 'vi',
  target_language text not null default 'en',
  skill_focus text not null,
  difficulty_constraints jsonb not null default '[]'::jsonb,
  item jsonb not null,
  raw_provider_response jsonb not null default '{}'::jsonb,
  provider text not null,
  model text not null,
  latency_ms integer not null default 0,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  estimated_cost_usd numeric(12, 6) not null default 0,
  final_decision text not null default 'pending' check (final_decision in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_item_validation_runs (
  id uuid primary key default gen_random_uuid(),
  generated_item_id uuid not null references public.placement_v3_generated_items(id) on delete cascade,
  batch_id text not null,
  cycle integer not null default 0,
  prompt_version text not null,
  validation jsonb not null,
  raw_validator_response jsonb not null default '{}'::jsonb,
  final_decision text not null check (final_decision in ('accepted', 'rejected')),
  cefr_fit_score numeric(4, 3) not null default 0 check (cefr_fit_score >= 0 and cefr_fit_score <= 1),
  safety_score numeric(4, 3) not null default 0 check (safety_score >= 0 and safety_score <= 1),
  l1_relevance_score numeric(4, 3) not null default 0 check (l1_relevance_score >= 0 and l1_relevance_score <= 1),
  rubric_compatibility_score numeric(4, 3) not null default 0 check (rubric_compatibility_score >= 0 and rubric_compatibility_score <= 1),
  duplicate_risk_score numeric(4, 3) not null default 1 check (duplicate_risk_score >= 0 and duplicate_risk_score <= 1),
  provider text not null,
  model text not null,
  latency_ms integer not null default 0,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  estimated_cost_usd numeric(12, 6) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_v3_item_rejection_reasons (
  id uuid primary key default gen_random_uuid(),
  validation_run_id uuid not null references public.placement_v3_item_validation_runs(id) on delete cascade,
  generated_item_id uuid not null references public.placement_v3_generated_items(id) on delete cascade,
  code text not null check (
    code in (
      'too_easy',
      'too_hard',
      'culturally_awkward',
      'unsafe',
      'age_inappropriate',
      'boring',
      'poor_vietnamese_l1_relevance',
      'not_gradable',
      'duplicate',
      'rubric_mismatch',
      'malformed',
      'model_unavailable'
    )
  ),
  severity text not null check (severity in ('low', 'medium', 'high')),
  message text not null,
  evidence text,
  created_at timestamptz not null default now()
);

create index if not exists placement_v3_generated_items_batch_idx
  on public.placement_v3_generated_items (batch_id, cycle, final_decision);

create index if not exists placement_v3_generated_items_modality_level_idx
  on public.placement_v3_generated_items (modality, target_cefr);

create index if not exists placement_v3_item_validation_runs_item_idx
  on public.placement_v3_item_validation_runs (generated_item_id, created_at desc);

create index if not exists placement_v3_item_rejection_reasons_code_idx
  on public.placement_v3_item_rejection_reasons (code, severity);

alter table public.placement_v3_generated_items enable row level security;
alter table public.placement_v3_item_validation_runs enable row level security;
alter table public.placement_v3_item_rejection_reasons enable row level security;

create policy "Admins can read placement v3 generated items"
  on public.placement_v3_generated_items
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "Admins can read placement v3 validation runs"
  on public.placement_v3_item_validation_runs
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

create policy "Admins can read placement v3 rejection reasons"
  on public.placement_v3_item_rejection_reasons
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

grant select on public.placement_v3_generated_items to authenticated;
grant select on public.placement_v3_item_validation_runs to authenticated;
grant select on public.placement_v3_item_rejection_reasons to authenticated;
