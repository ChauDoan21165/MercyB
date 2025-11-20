-- Create login attempts tracking for rate limiting
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_login_attempts_email_created ON public.login_attempts(email, created_at DESC);
CREATE INDEX idx_login_attempts_ip_created ON public.login_attempts(ip_address, created_at DESC);

-- Create user security status table
CREATE TABLE IF NOT EXISTS public.user_security_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ,
  blocked_by UUID,
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  last_failed_login TIMESTAMPTZ,
  suspicious_activity_count INTEGER NOT NULL DEFAULT 0,
  last_suspicious_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_user_security_status_user_id ON public.user_security_status(user_id);
CREATE INDEX idx_user_security_status_blocked ON public.user_security_status(is_blocked);

-- Enable RLS
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for login_attempts
CREATE POLICY "Admins can view all login attempts"
  ON public.login_attempts FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert login attempts"
  ON public.login_attempts FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_security_status
CREATE POLICY "Admins can view all security statuses"
  ON public.user_security_status FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage security statuses"
  ON public.user_security_status FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own security status"
  ON public.user_security_status FOR SELECT
  USING (auth.uid() = user_id);

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  blocked BOOLEAN;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is blocked
  SELECT is_blocked INTO blocked 
  FROM public.user_security_status 
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(blocked, false);
END;
$$;

-- Function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  check_email TEXT,
  check_ip TEXT,
  time_window_minutes INTEGER DEFAULT 15,
  max_attempts INTEGER DEFAULT 5
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Count failed attempts in time window
  SELECT COUNT(*) INTO attempt_count
  FROM public.login_attempts
  WHERE (email = check_email OR ip_address = check_ip)
    AND success = false
    AND created_at > now() - (time_window_minutes || ' minutes')::INTERVAL;
  
  RETURN attempt_count >= max_attempts;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_user_security_status_updated_at
  BEFORE UPDATE ON public.user_security_status
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();