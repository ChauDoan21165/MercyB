import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = 'https://mercyblade.link';
    const startTime = Date.now();
    
    let statusCode = 0;
    let isUp = false;
    let errorMessage = null;

    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      statusCode = response.status;
      isUp = statusCode >= 200 && statusCode < 400;
    } catch (error) {
      errorMessage = String(error);
      isUp = false;
    }

    const responseTime = Date.now() - startTime;

    // Log the check
    const { error: logError } = await supabaseAdmin
      .from('uptime_checks')
      .insert({
        url,
        status_code: statusCode || null,
        response_time_ms: responseTime,
        is_up: isUp,
        error_message: errorMessage,
      });

    if (logError) throw logError;

    // If site is down, trigger alert
    if (!isUp) {
      await supabaseAdmin.functions.invoke('security-alert', {
        body: {
          incident_type: 'site_down',
          severity: 'critical',
          description: `mercyblade.link is DOWN! Status: ${statusCode || 'timeout'}, Error: ${errorMessage || 'Unknown'}`,
          metadata: {
            url,
            status_code: statusCode,
            response_time_ms: responseTime,
            error: errorMessage,
          }
        }
      });
    }

    // Check for suspicious status codes
    if (statusCode === 403 || statusCode === 500 || statusCode === 503) {
      await supabaseAdmin.functions.invoke('security-alert', {
        body: {
          incident_type: 'suspicious_status',
          severity: 'high',
          description: `mercyblade.link returned suspicious status code: ${statusCode}`,
          metadata: {
            url,
            status_code: statusCode,
            response_time_ms: responseTime,
          }
        }
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        url,
        is_up: isUp,
        status_code: statusCode,
        response_time_ms: responseTime,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Uptime monitor error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
