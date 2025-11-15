-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to regenerate registry via edge function
CREATE OR REPLACE FUNCTION public.trigger_registry_regeneration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Call the regenerate-registry edge function in the background
  -- Using pg_net to make async HTTP request
  PERFORM net.http_post(
    url := 'https://vpkchobbrennozdvhgaw.supabase.co/functions/v1/regenerate-registry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwa2Nob2JicmVubm96ZHZoZ2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjM4ODQsImV4cCI6MjA3NjQzOTg4NH0.j9fUrdiHQPpdfAxd1d7RVGqZMBfWbw7cq7q1MQBlewY'
    ),
    body := jsonb_build_object(
      'timestamp', now(),
      'trigger_type', TG_OP,
      'room_id', COALESCE(NEW.id, OLD.id)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on rooms table for INSERT and UPDATE
DROP TRIGGER IF EXISTS on_room_change_regenerate_registry ON public.rooms;
CREATE TRIGGER on_room_change_regenerate_registry
  AFTER INSERT OR UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_registry_regeneration();