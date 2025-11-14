-- Create security events table
CREATE TABLE public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast querying
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_ip ON public.security_events(ip_address);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all security events
CREATE POLICY "Admins can view all security events"
ON public.security_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- System can insert security events
CREATE POLICY "System can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (true);

-- Create function to log security event
CREATE OR REPLACE FUNCTION public.log_security_event(
  _user_id UUID,
  _event_type TEXT,
  _severity TEXT,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id,
    event_type,
    severity,
    ip_address,
    user_agent,
    metadata
  )
  VALUES (
    _user_id,
    _event_type,
    _severity,
    _ip_address,
    _user_agent,
    _metadata
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;