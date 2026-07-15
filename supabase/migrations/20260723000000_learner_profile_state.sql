-- WP-LEARNER-PROFILE-1A: durable server-side learner profile spine.
-- Additive only. Chau applies this migration via Supabase dashboard; do not
-- apply with supabase db push.

do $$
begin
  create type public.learner_skill as enum (
    'pronunciation',
    'grammar',
    'vocabulary',
    'listening',
    'speaking',
    'reading',
    'writing'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.learner_skill_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill public.learner_skill not null,
  score numeric,
  cefr_estimate text,
  confidence numeric,
  evidence_count integer not null default 0,
  last_assessed_at timestamptz,
  is_synthetic boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint learner_skill_state_pk primary key (user_id, skill),
  constraint learner_skill_state_score_chk check (score is null or (score >= 0 and score <= 100)),
  constraint learner_skill_state_confidence_chk check (confidence is null or (confidence >= 0 and confidence <= 1)),
  constraint learner_skill_state_evidence_count_chk check (evidence_count >= 0),
  constraint learner_skill_state_cefr_chk check (
    cefr_estimate is null or cefr_estimate in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
  )
);

create table if not exists public.learner_error_patterns (
  user_id uuid not null references auth.users(id) on delete cascade,
  pattern_code text not null,
  l1 text not null,
  occurrence_count integer not null default 0,
  resolved_count integer not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  trend text not null default 'stable',
  example_unit_ids uuid[] not null default '{}'::uuid[],
  is_synthetic boolean not null default false,
  constraint learner_error_patterns_pk primary key (user_id, pattern_code, l1),
  constraint learner_error_patterns_pattern_code_chk check (
    pattern_code in (
      'missing-article',
      'tense-omission',
      'subj-verb-agreement',
      'preposition-calque',
      'word-order',
      'zero-copula',
      'double-negation',
      'word_choice',
      'sentence_structure',
      'pronunciation',
      'politeness_register'
    )
  ),
  constraint learner_error_patterns_counts_chk check (
    occurrence_count >= 0 and resolved_count >= 0 and resolved_count <= occurrence_count
  ),
  constraint learner_error_patterns_l1_chk check (l1 ~ '^[a-z][a-z0-9_-]{1,11}$'),
  constraint learner_error_patterns_trend_chk check (trend in ('improving', 'stable', 'worsening'))
);

create index if not exists learner_skill_state_user_updated_idx
  on public.learner_skill_state (user_id, updated_at desc);

create index if not exists learner_skill_state_synthetic_updated_idx
  on public.learner_skill_state (is_synthetic, updated_at desc)
  where is_synthetic = true;

create index if not exists learner_error_patterns_user_last_seen_idx
  on public.learner_error_patterns (user_id, last_seen_at desc);

create index if not exists learner_error_patterns_pattern_idx
  on public.learner_error_patterns (pattern_code, l1, last_seen_at desc);

create index if not exists learner_error_patterns_synthetic_last_seen_idx
  on public.learner_error_patterns (is_synthetic, last_seen_at desc)
  where is_synthetic = true;

alter table public.learner_skill_state enable row level security;
alter table public.learner_error_patterns enable row level security;

revoke all on table public.learner_skill_state from anon, authenticated;
revoke all on table public.learner_error_patterns from anon, authenticated;

grant select on table public.learner_skill_state to authenticated;
grant select on table public.learner_error_patterns to authenticated;
grant all privileges on table public.learner_skill_state to service_role;
grant all privileges on table public.learner_error_patterns to service_role;

drop policy if exists learner_skill_state_select_own on public.learner_skill_state;
create policy learner_skill_state_select_own
  on public.learner_skill_state
  as permissive
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists learner_skill_state_admin_select on public.learner_skill_state;
create policy learner_skill_state_admin_select
  on public.learner_skill_state
  as permissive
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

drop policy if exists learner_error_patterns_select_own on public.learner_error_patterns;
create policy learner_error_patterns_select_own
  on public.learner_error_patterns
  as permissive
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists learner_error_patterns_admin_select on public.learner_error_patterns;
create policy learner_error_patterns_admin_select
  on public.learner_error_patterns
  as permissive
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

comment on table public.learner_skill_state is
  'Durable per-learner skill profile. Written only by learner-profile-write service-role edge function; no raw learner text.';

comment on table public.learner_error_patterns is
  'Durable per-learner error pattern counts using the existing tutor interference/weakness taxonomy. No raw learner text; example_unit_ids are UUID refs only.';
