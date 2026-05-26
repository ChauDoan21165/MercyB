-- Create feature flags table for safe rollbacks
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Only admins can manage feature flags
CREATE POLICY "Admins can manage feature flags"
  ON public.feature_flags
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can read feature flags
CREATE POLICY "Anyone can read feature flags"
  ON public.feature_flags
  FOR SELECT
  USING (true);

-- Insert default feature flags
INSERT INTO public.feature_flags (flag_key, is_enabled, description) VALUES
  ('ai_chat_enabled', true, 'Enable AI chat functionality'),
  ('tts_enabled', true, 'Enable text-to-speech features'),
  ('matchmaking_enabled', true, 'Enable AI matchmaking'),
  ('paypal_payments_enabled', true, 'Enable PayPal payment processing'),
  ('payment_verification_enabled', true, 'Enable payment screenshot verification')
ON CONFLICT (flag_key) DO NOTHING;

-- Create rate limiting table for more granular control
CREATE TABLE IF NOT EXISTS public.rate_limit_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  max_requests INTEGER NOT NULL,
  window_seconds INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_config ENABLE ROW LEVEL SECURITY;

-- Only admins can manage rate limits
CREATE POLICY "Admins can manage rate limits"
  ON public.rate_limit_config
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can read rate limits
CREATE POLICY "Anyone can read rate limits"
  ON public.rate_limit_config
  FOR SELECT
  USING (true);

-- Insert default rate limit configs
INSERT INTO public.rate_limit_config (endpoint, max_requests, window_seconds, description) VALUES
  ('text-to-speech', 50, 3600, 'TTS requests per hour per user'),
  ('ai-chat', 100, 3600, 'AI chat requests per hour per user'),
  ('paypal-payment', 10, 3600, 'Payment attempts per hour per user'),
  ('verify-payment', 5, 3600, 'Payment verification attempts per hour per user'),
  ('generate-matches', 5, 86400, 'Match generation per day per user')
ON CONFLICT (endpoint) DO NOTHING;

-- Create function to check rate limit with configurable limits
CREATE OR REPLACE FUNCTION public.check_endpoint_rate_limit(
  user_uuid UUID,
  endpoint_name TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  config_record RECORD;
  request_count INTEGER;
BEGIN
  -- Get rate limit config
  SELECT max_requests, window_seconds INTO config_record
  FROM public.rate_limit_config
  WHERE endpoint = endpoint_name;
  
  IF NOT FOUND THEN
    -- Default: 100 requests per hour if no config
    config_record.max_requests := 100;
    config_record.window_seconds := 3600;
  END IF;
  
  -- Count recent requests (you'd need to track these in your edge functions)
  SELECT COUNT(*) INTO request_count
  FROM public.security_events
  WHERE user_id = user_uuid
    AND event_type = 'rate_limit_check'
    AND metadata->>'endpoint' = endpoint_name
    AND created_at > now() - (config_record.window_seconds || ' seconds')::INTERVAL;
  
  RETURN request_count >= config_record.max_requests;
END;
$$;