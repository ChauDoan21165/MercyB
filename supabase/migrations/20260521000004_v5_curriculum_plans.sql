-- V5-004: Curriculum Plans table
-- V5-managed table storing V4-shaped CurriculumPlan data.
-- Feature-gated behind V5_ENABLED.
-- RLS: user-scoped read/write, admin read-all.
-- Idempotent: unique(user_id, deterministic_key).

create table if not exists v4_curriculum_plans (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  plan_version      integer not null,
  plan_length_days  integer not null check (plan_length_days in (7, 28, 90)),
  generated_at      timestamptz not null,
  deterministic_key text not null,
  fatigue_score     real not null check (fatigue_score >= 0 and fatigue_score <= 1),
  focus_skills      jsonb,
  payload           jsonb not null,
  superseded_at     timestamptz,
  created_at        timestamptz not null default now(),

  constraint v4_curriculum_plans_user_key_unique unique (user_id, deterministic_key),
  constraint v4_curriculum_plans_plan_version_check check (plan_version >= 1)
);

create index if not exists idx_v4_curriculum_plans_user_id
  on v4_curriculum_plans (user_id);

create index if not exists idx_v4_curriculum_plans_superseded_at
  on v4_curriculum_plans (superseded_at)
  where superseded_at is null;

alter table v4_curriculum_plans enable row level security;

create policy "Users can read own curriculum plans"
  on v4_curriculum_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own curriculum plans"
  on v4_curriculum_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own curriculum plans"
  on v4_curriculum_plans for update
  using (auth.uid() = user_id);

create policy "Admins can read all curriculum plans"
  on v4_curriculum_plans for select
  using (get_admin_level(auth.uid()) >= 9);
