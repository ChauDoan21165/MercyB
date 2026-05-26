-- V5-004: Admin read-all views for C5 dashboard
-- These views allow admins (get_admin_level >= 9) to query across all users.
-- Views inherit RLS from the base tables; the admin policies on each table
-- already allow admin read-all.

-- Learner memory summary (for admin dashboard)
create or replace view v4_admin_learner_memory_summary as
select
  user_id,
  learner_key,
  schema_version,
  content_hash,
  event_count,
  created_at,
  updated_at,
  pg_column_size(payload) as payload_bytes
from v4_learner_memory;

-- Telemetry event counts by type and day (for admin analytics)
create or replace view v4_admin_telemetry_daily as
select
  user_id,
  event_type,
  occurred_at::date as event_date,
  count(*) as event_count
from v4_telemetry_events
group by user_id, event_type, occurred_at::date;

-- Provider decision summary (for admin provider health dashboard)
create or replace view v4_admin_provider_decisions_summary as
select
  user_id,
  capability,
  status,
  selected_provider_id,
  boundary_mode,
  trust_score,
  cost_estimate_cents,
  created_at
from v4_provider_decisions;

-- Curriculum plan summary (for admin cohort analysis)
create or replace view v4_admin_curriculum_plans_summary as
select
  user_id,
  plan_version,
  plan_length_days,
  generated_at,
  fatigue_score,
  superseded_at,
  created_at,
  pg_column_size(payload) as payload_bytes
from v4_curriculum_plans;
