-- Enable realtime for security events monitoring
ALTER TABLE public.security_events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_events;