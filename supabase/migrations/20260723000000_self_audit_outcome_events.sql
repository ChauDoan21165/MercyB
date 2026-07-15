-- WP-AUDIT-TELEMETRY-1 - text-free MercySelfAudit outcome counter.
--
-- OUTPUT ONLY. Apply MANUALLY via the Supabase SQL Editor or the psql pooler.
-- Do NOT run `supabase db push`.
--
-- Stores only self-audit routing metadata. It must never store learner text,
-- correction text, prompts, responses, transcripts, request bodies, or error bodies.

create extension if not exists "pgcrypto";

create table if not exists public.self_audit_outcome_events (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  decision      text not null,
  deciding_gate text null,
  failed_rule   text null,
  reason_code   text null,
  lang_pair     text null,
  is_synthetic  boolean not null default false,

  constraint self_audit_outcome_events_decision_chk
    check (decision in ('SHOW', 'SHOW_WITH_CAUTION', 'REVISE', 'BLOCK')),
  constraint self_audit_outcome_events_deciding_gate_chk
    check (deciding_gate is null or (length(deciding_gate) <= 64 and deciding_gate ~ '^[A-Za-z0-9_:-]+$')),
  constraint self_audit_outcome_events_failed_rule_chk
    check (failed_rule is null or (length(failed_rule) <= 96 and failed_rule ~ '^[A-Za-z0-9_:-]+$')),
  constraint self_audit_outcome_events_reason_code_chk
    check (reason_code is null or (length(reason_code) <= 96 and reason_code ~ '^[A-Za-z0-9_:-]+$')),
  constraint self_audit_outcome_events_lang_pair_chk
    check (lang_pair is null or (length(lang_pair) <= 17 and lang_pair ~ '^[a-z-]+$'))
);

create index if not exists self_audit_outcome_events_created_idx
  on public.self_audit_outcome_events (created_at desc);

create index if not exists self_audit_outcome_events_decision_created_idx
  on public.self_audit_outcome_events (decision, created_at desc);

create index if not exists self_audit_outcome_events_lang_pair_created_idx
  on public.self_audit_outcome_events (lang_pair, created_at desc)
  where lang_pair is not null;

create index if not exists self_audit_outcome_events_synthetic_created_idx
  on public.self_audit_outcome_events (is_synthetic, created_at desc);

comment on table public.self_audit_outcome_events is
  'Text-free MercySelfAudit pass/block counter. No learner text, correction text, prompts, responses, transcripts, request bodies, or error bodies.';

alter table public.self_audit_outcome_events enable row level security;

drop policy if exists self_audit_outcome_events_anon_insert on public.self_audit_outcome_events;
create policy self_audit_outcome_events_anon_insert
  on public.self_audit_outcome_events
  for insert
  to anon
  with check (true);

drop policy if exists self_audit_outcome_events_auth_insert on public.self_audit_outcome_events;
create policy self_audit_outcome_events_auth_insert
  on public.self_audit_outcome_events
  for insert
  to authenticated
  with check (true);

drop policy if exists self_audit_outcome_events_admin_select on public.self_audit_outcome_events;
create policy self_audit_outcome_events_admin_select
  on public.self_audit_outcome_events
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

revoke all on public.self_audit_outcome_events from anon, authenticated;
grant insert on public.self_audit_outcome_events to anon, authenticated;
grant select on public.self_audit_outcome_events to authenticated;
