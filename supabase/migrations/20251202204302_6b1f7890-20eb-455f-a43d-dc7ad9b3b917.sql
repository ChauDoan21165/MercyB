-- Update check_rate_limit function to exempt admin users
CREATE OR REPLACE FUNCTION public.check_rate_limit(check_email text, check_ip text, time_window_minutes integer DEFAULT 15, max_attempts integer DEFAULT 5)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  attempt_count INTEGER;
  user_uuid UUID;
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin - admins bypass rate limit
  SELECT id INTO user_uuid FROM auth.users WHERE email = check_email;
  
  IF user_uuid IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = user_uuid AND role = 'admin'
    ) INTO is_admin;
    
    IF is_admin THEN
      RETURN false; -- Not rate limited for admins
    END IF;
  END IF;

  -- Regular rate limit check for non-admins
  SELECT COUNT(*) INTO attempt_count
  FROM public.login_attempts
  WHERE (email = check_email OR ip_address = check_ip)
    AND success = false
    AND created_at > now() - (time_window_minutes || ' minutes')::INTERVAL;
  
  RETURN attempt_count >= max_attempts;
END;
$function$;