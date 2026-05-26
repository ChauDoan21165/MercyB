-- Enable realtime for app_settings table
ALTER TABLE public.app_settings REPLICA IDENTITY FULL;

-- Add app_settings to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;