-- R2 LOGWATCH manual proof seed.
-- Apply after the R2 tables SQL. It creates one non-synthetic fake Pages
-- function failure that selftest/real invoke should group and alert.

insert into public.function_failure_logs (
  source,
  function_name,
  endpoint,
  status,
  error_signature,
  message,
  request_id,
  user_id,
  detail
) values (
  'cf-pages',
  'mercy-ai',
  '/api/mercy-ai',
  502,
  'r2_seed_provider_failed',
  'Seeded fake provider failure for R2 proof',
  'r2-seed-' || extract(epoch from clock_timestamp())::bigint::text,
  null,
  jsonb_build_object('seed', true, 'owner', 'r2-logwatch')
);
