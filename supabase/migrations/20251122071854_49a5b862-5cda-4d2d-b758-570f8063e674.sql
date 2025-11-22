-- Enable realtime for live user monitoring
ALTER TABLE public.user_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.room_usage_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.feedback REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_usage_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;