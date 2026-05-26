-- Fix search_path for clean_expired_responses function
DROP FUNCTION IF EXISTS public.clean_expired_responses();

CREATE OR REPLACE FUNCTION public.clean_expired_responses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.responses WHERE expires_at < now();
END;
$$;