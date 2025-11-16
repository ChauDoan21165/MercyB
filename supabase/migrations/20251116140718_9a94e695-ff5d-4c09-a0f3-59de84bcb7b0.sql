-- Fix 1: Update functions to have proper search_path
-- These functions need search_path set to 'public' for security

-- Update cleanup_old_sessions function
DROP FUNCTION IF EXISTS public.cleanup_old_sessions() CASCADE;
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Delete sessions older than 7 days
  DELETE FROM public.user_sessions
  WHERE last_activity < now() - interval '7 days';
  
  RETURN NEW;
END;
$function$;

-- Update purge_old_payment_proofs function
DROP FUNCTION IF EXISTS public.purge_old_payment_proofs() CASCADE;
CREATE OR REPLACE FUNCTION public.purge_old_payment_proofs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Delete payment submissions older than 90 days
  DELETE FROM public.payment_proof_submissions
  WHERE created_at < now() - interval '90 days';
  
  -- Delete audit logs older than 1 year
  DELETE FROM public.payment_proof_audit_log
  WHERE created_at < now() - interval '1 year';
END;
$function$;

-- Update handle_updated_at function
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$function$;

-- Update trigger_registry_regeneration function
DROP FUNCTION IF EXISTS public.trigger_registry_regeneration() CASCADE;
CREATE OR REPLACE FUNCTION public.trigger_registry_regeneration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Update handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$function$;

-- Update handle_room_updated_at function
DROP FUNCTION IF EXISTS public.handle_room_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_room_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update notify_admins_on_new_feedback function
DROP FUNCTION IF EXISTS public.notify_admins_on_new_feedback() CASCADE;
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_feedback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Insert notification for each admin who has notifications enabled
  INSERT INTO public.admin_notifications (admin_user_id, feedback_id)
  SELECT ur.user_id, NEW.id
  FROM public.user_roles ur
  LEFT JOIN public.admin_notification_preferences anp ON ur.user_id = anp.admin_user_id
  WHERE ur.role = 'admin'
    AND (anp.feedback_notifications_enabled IS NULL OR anp.feedback_notifications_enabled = true);
  
  RETURN NEW;
END;
$function$;

-- Update update_private_chat_request_timestamp function
DROP FUNCTION IF EXISTS public.update_private_chat_request_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION public.update_private_chat_request_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;