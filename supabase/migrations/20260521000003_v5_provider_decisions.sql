-- V5-004: Provider Decisions audit trail
-- V5-managed table storing V4-shaped ProviderDecisionRecord data.
-- Feature-gated behind V5_ENABLED.
-- RLS: user-scoped read, admin read-all. No user insert (system-only).
-- Idempotent: unique(decision_id).
-- Secrets redacted at V4 layer before insert.

create table if not exists v4_provider_decisions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  decision_id           text not null,
  capability            text not null,
  status                text not null check (status in ('selected', 'blocked')),
  selected_provider_id  text,
  boundary_mode         text not null,
  trust_score           integer,
  cost_estimate_cents   integer,
  rejection_reasons     jsonb,
  payload               jsonb not null,
  created_at            timestamptz not null default now(),

  constraint v4_provider_decisions_decision_id_unique unique (decision_id),
  constraint v4_provider_decisions_decision_id_length_check
    check (char_length(decision_id) <= 64),
  constraint v4_provider_decisions_no_secrets_check
    check (not (payload::text ~* '(secret|token|key|credential|authorization|password|apikey|api_key|bearer|service_role)'))
);

create index if not exists idx_v4_provider_decisions_user_id
  on v4_provider_decisions (user_id);

create index if not exists idx_v4_provider_decisions_capability
  on v4_provider_decisions (capability);

create index if not exists idx_v4_provider_decisions_status
  on v4_provider_decisions (status);

alter table v4_provider_decisions enable row level security;

create policy "Users can read own provider decisions"
  on v4_provider_decisions for select
  using (auth.uid() = user_id);

create policy "Admins can read all provider decisions"
  on v4_provider_decisions for select
  using (get_admin_level(auth.uid()) >= 9);
