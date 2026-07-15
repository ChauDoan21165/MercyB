BEGIN;

-- Capture dashboard-only R2 logwatch cron source RPC. This SQL file is
-- output-only; do not apply from automation.

CREATE OR REPLACE FUNCTION public.r2_recent_cron_failures(window_start timestamptz)
RETURNS TABLE (
  job_name text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    COALESCE(j.jobname, d.jobid::text) AS job_name,
    d.status,
    d.return_message,
    d.start_time,
    d.end_time
  FROM cron.job_run_details AS d
  LEFT JOIN cron.job AS j ON j.jobid = d.jobid
  WHERE d.start_time >= window_start
    AND d.status <> 'succeeded'
  ORDER BY d.start_time DESC
  LIMIT 200
$$;

ALTER FUNCTION public.r2_recent_cron_failures(timestamptz) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.r2_recent_cron_failures(timestamptz) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.r2_recent_cron_failures(timestamptz) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.r2_recent_cron_failures(timestamptz) TO service_role;

COMMENT ON FUNCTION public.r2_recent_cron_failures(timestamptz) IS
  'Service-role-only source RPC for r2-logwatch cron failure rows.';

COMMIT;
