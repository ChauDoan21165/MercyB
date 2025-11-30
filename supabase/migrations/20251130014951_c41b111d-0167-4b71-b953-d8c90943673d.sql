-- =====================================================
-- AUDIT LOG MODULE - Enhanced Schema
-- =====================================================

-- Drop existing audit_logs if structure doesn't match
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- Create comprehensive audit_logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_id text,
  target_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_target_type ON public.audit_logs(target_type);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can view all audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'::app_role
  )
);

-- RLS Policy: System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (
  auth.uid() = admin_id
);

-- =====================================================
-- AI USAGE MODULE - Complete Schema
-- =====================================================

-- Create comprehensive ai_usage table
CREATE TABLE public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  model text NOT NULL,
  tokens_input integer DEFAULT 0,
  tokens_output integer DEFAULT 0,
  cost_usd numeric(10, 6) DEFAULT 0,
  status text DEFAULT 'success',
  endpoint text,
  request_duration_ms integer,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON public.ai_usage(created_at DESC);
CREATE INDEX idx_ai_usage_model ON public.ai_usage(model);
CREATE INDEX idx_ai_usage_endpoint ON public.ai_usage(endpoint);
CREATE INDEX idx_ai_usage_status ON public.ai_usage(status);

-- Enable RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can view all AI usage
CREATE POLICY "Admins can view all AI usage"
ON public.ai_usage
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'::app_role
  )
);

-- RLS Policy: Users can view their own AI usage
CREATE POLICY "Users can view their own AI usage"
ON public.ai_usage
FOR SELECT
USING (
  auth.uid() = user_id
);

-- RLS Policy: System can insert AI usage logs
CREATE POLICY "System can insert AI usage logs"
ON public.ai_usage
FOR INSERT
WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get AI usage summary by date range
CREATE OR REPLACE FUNCTION public.get_ai_usage_summary(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  total_requests bigint,
  total_tokens bigint,
  total_cost numeric,
  avg_tokens numeric,
  avg_cost numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*)::bigint as total_requests,
    SUM(tokens_input + tokens_output)::bigint as total_tokens,
    SUM(cost_usd)::numeric as total_cost,
    AVG(tokens_input + tokens_output)::numeric as avg_tokens,
    AVG(cost_usd)::numeric as avg_cost
  FROM ai_usage
  WHERE created_at BETWEEN start_date AND end_date;
$$;

-- Function to get audit log summary
CREATE OR REPLACE FUNCTION public.get_audit_summary(
  days_back integer DEFAULT 7
)
RETURNS TABLE (
  action text,
  action_count bigint,
  unique_admins bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    action,
    COUNT(*)::bigint as action_count,
    COUNT(DISTINCT admin_id)::bigint as unique_admins
  FROM audit_logs
  WHERE created_at > now() - (days_back || ' days')::interval
  GROUP BY action
  ORDER BY action_count DESC;
$$;