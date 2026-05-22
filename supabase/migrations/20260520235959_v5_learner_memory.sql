-- V5-004: Learner Memory persistence table
-- V5-managed table storing V4-shaped LearnerMemory data.
-- Feature-gated behind V5_ENABLED. No-op when V5 is disabled.
-- RLS: user-scoped read/write, admin read-all.

create table if not exists v4_learner_memory (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  learner_key     text not null,
  schema_version  text not null,
  payload         jsonb not null,
  content_hash    text not null,
  event_count     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint v4_learner_memory_user_id_unique unique (user_id),
  constraint v4_learner_memory_schema_version_check
    check (schema_version = 'placement-v4-learner-memory-v1'),
  constraint v4_learner_memory_learner_key_length_check
    check (char_length(learner_key) <= 128)
);

create index if not exists idx_v4_learner_memory_user_id
  on v4_learner_memory (user_id);

create index if not exists idx_v4_learner_memory_content_hash
  on v4_learner_memory (content_hash);

alter table v4_learner_memory enable row level security;

create policy "Users can read own learner memory"
  on v4_learner_memory for select
  using (auth.uid() = user_id);

create policy "Users can insert own learner memory"
  on v4_learner_memory for insert
  with check (auth.uid() = user_id);

create policy "Users can update own learner memory"
  on v4_learner_memory for update
  using (auth.uid() = user_id);

create policy "Admins can read all learner memory"
  on v4_learner_memory for select
  using (get_admin_level(auth.uid()) >= 9);
