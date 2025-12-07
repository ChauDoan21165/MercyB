-- Fix get_ai_usage_summary to query from ai_usage_events instead of deprecated ai_usage table
CREATE OR REPLACE FUNCTION public.get_ai_usage_summary(start_date timestamp with time zone DEFAULT (now() - '30 days'::interval), end_date timestamp with time zone DEFAULT now())
 RETURNS TABLE(total_requests bigint, total_tokens bigint, total_cost numeric, avg_tokens numeric, avg_cost numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    COUNT(*)::bigint as total_requests,
    SUM(tokens_input + tokens_output)::bigint as total_tokens,
    SUM(cost_usd)::numeric as total_cost,
    AVG(tokens_input + tokens_output)::numeric as avg_tokens,
    AVG(cost_usd)::numeric as avg_cost
  FROM ai_usage_events
  WHERE created_at BETWEEN start_date AND end_date;
$function$;