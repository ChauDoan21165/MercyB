-- A6 Phase A: security_definer_view hardening for entitlement/user-rank views.
--
-- Scope:
--   public.user_entitlements
--   public.user_entitlements_v
--   public.v_user_ai_monthly_meter
--   public.mb_user_effective_rank
--
-- Phase A is intentionally non-tightening:
--   - convert the four postgres-owned views to SECURITY INVOKER posture
--   - add a self-scoped RPC for the AI monthly meter
--   - preserve existing authenticated read paths
--   - preserve service_role read paths
--
-- Phase B, after production traffic verification, may revoke excess
-- authenticated direct access. That tightening is explicitly not included here.

BEGIN;

ALTER VIEW public.user_entitlements SET (security_invoker = true);
ALTER VIEW public.user_entitlements_v SET (security_invoker = true);
ALTER VIEW public.mb_user_effective_rank SET (security_invoker = true);
ALTER VIEW public.v_user_ai_monthly_meter SET (security_invoker = true);

CREATE OR REPLACE FUNCTION public.get_my_ai_monthly_meter()
RETURNS TABLE (
  user_id uuid,
  tier_id uuid,
  plan_name text,
  status text,
  recognized_monthly_revenue_vnd numeric,
  extra_ai_budget_vnd numeric,
  ai_cost_vnd numeric,
  cutoff_vnd numeric,
  remaining_vnd numeric,
  usage_ratio numeric,
  reset_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.user_id,
    m.tier_id,
    m.plan_name,
    m.status,
    m.recognized_monthly_revenue_vnd,
    m.extra_ai_budget_vnd,
    m.ai_cost_vnd,
    m.cutoff_vnd,
    m.remaining_vnd,
    m.usage_ratio,
    m.reset_at
  FROM public.v_user_ai_monthly_meter AS m
  WHERE m.user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() TO authenticated, service_role;

GRANT SELECT ON public.user_entitlements TO authenticated, service_role;
GRANT SELECT ON public.user_entitlements_v TO authenticated, service_role;
GRANT SELECT ON public.mb_user_effective_rank TO authenticated, service_role;
GRANT SELECT ON public.v_user_ai_monthly_meter TO authenticated, service_role;

COMMENT ON FUNCTION public.get_my_ai_monthly_meter() IS
  'A6 Phase A: self-scoped read RPC for v_user_ai_monthly_meter. Browser-safe via auth.uid() filter; no anon EXECUTE grant.';

COMMIT;
