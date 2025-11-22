-- Security monitoring configuration table
CREATE TABLE IF NOT EXISTS public.security_monitoring_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_webhook_url TEXT,
  alert_email TEXT,
  uptime_check_enabled BOOLEAN DEFAULT true,
  attack_mode_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Uptime check results table
CREATE TABLE IF NOT EXISTS public.uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  is_up BOOLEAN DEFAULT true,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT now()
);

-- Security incidents table
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_monitoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monitoring config (admin only)
CREATE POLICY "Admins can manage monitoring config"
  ON public.security_monitoring_config
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for uptime checks (admin view)
CREATE POLICY "Admins can view uptime checks"
  ON public.uptime_checks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert uptime checks"
  ON public.uptime_checks
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for incidents (admin view/manage)
CREATE POLICY "Admins can view incidents"
  ON public.security_incidents
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update incidents"
  ON public.security_incidents
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert incidents"
  ON public.security_incidents
  FOR INSERT
  WITH CHECK (true);

-- Insert default config
INSERT INTO public.security_monitoring_config (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_uptime_checks_checked_at ON public.uptime_checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON public.security_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_resolved ON public.security_incidents(resolved, created_at DESC);