-- 1) AI usage events table for logging all AI calls
CREATE TABLE IF NOT EXISTS public.ai_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  model text NOT NULL,
  tokens_input integer NOT NULL DEFAULT 0,
  tokens_output integer NOT NULL DEFAULT 0,
  cost_usd numeric(10,6) NOT NULL DEFAULT 0,
  endpoint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Global AI settings (single row)
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_ai_enabled boolean NOT NULL DEFAULT true,
  monthly_budget_usd numeric(10,2) NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure one row exists
INSERT INTO public.ai_settings (is_ai_enabled, monthly_budget_usd)
SELECT true, 50
WHERE NOT EXISTS (SELECT 1 FROM public.ai_settings);

-- 3) Per-user AI switch (add to profiles table)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ai_enabled boolean NOT NULL DEFAULT true;

-- Enable RLS
ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_usage_events
CREATE POLICY "Admins can view all AI usage"
ON public.ai_usage_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert AI usage"
ON public.ai_usage_events
FOR INSERT
WITH CHECK (true);

-- RLS policies for ai_settings
CREATE POLICY "Admins can manage AI settings"
ON public.ai_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read AI settings"
ON public.ai_settings
FOR SELECT
USING (true);

-- Create index for faster monthly queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_created_at 
ON public.ai_usage_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_events_user_id 
ON public.ai_usage_events(user_id);