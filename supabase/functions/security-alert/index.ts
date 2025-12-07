import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate secret token to prevent spam attacks
    const secretToken = req.headers.get('x-alert-secret');
    const expectedToken = Deno.env.get('SECURITY_ALERT_TOKEN');
    
    if (!expectedToken || secretToken !== expectedToken) {
      console.error('Security alert: Invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: AlertPayload = await req.json();

    // Log incident to database
    const { data: incident, error: incidentError } = await supabaseAdmin
      .from('security_incidents')
      .insert({
        incident_type: payload.incident_type,
        severity: payload.severity,
        description: payload.description,
        metadata: payload.metadata || {},
      })
      .select()
      .single();

    if (incidentError) throw incidentError;

    // Get monitoring config
    const { data: config } = await supabaseAdmin
      .from('security_monitoring_config')
      .select('*')
      .single();

    const alerts = [];

    // Send Discord webhook if configured
    if (config?.discord_webhook_url) {
      const discordPayload = {
        embeds: [{
          title: `🚨 Security Alert: ${payload.incident_type}`,
          description: payload.description,
          color: payload.severity === 'critical' ? 15158332 : 
                 payload.severity === 'high' ? 16744272 : 
                 payload.severity === 'medium' ? 16776960 : 3447003,
          fields: [
            { name: 'Severity', value: payload.severity.toUpperCase(), inline: true },
            { name: 'Time', value: new Date().toISOString(), inline: true },
          ],
          timestamp: new Date().toISOString(),
        }]
      };

      try {
        const discordResponse = await fetch(config.discord_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload),
        });
        alerts.push({ channel: 'discord', success: discordResponse.ok });
      } catch (error) {
        console.error('Discord webhook failed:', error);
        alerts.push({ channel: 'discord', success: false, error: String(error) });
      }
    }

    // Send email if configured (using Resend if RESEND_API_KEY is set)
    if (config?.alert_email && Deno.env.get('RESEND_API_KEY')) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Security Alert <security@mercyblade.link>',
            to: [config.alert_email],
            subject: `🚨 Security Alert: ${payload.incident_type}`,
            html: `
              <h2>Security Alert</h2>
              <p><strong>Type:</strong> ${payload.incident_type}</p>
              <p><strong>Severity:</strong> ${payload.severity}</p>
              <p><strong>Description:</strong> ${payload.description}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              ${payload.metadata ? `<p><strong>Details:</strong> ${JSON.stringify(payload.metadata, null, 2)}</p>` : ''}
            `,
          }),
        });
        alerts.push({ channel: 'email', success: emailResponse.ok });
      } catch (error) {
        console.error('Email alert failed:', error);
        alerts.push({ channel: 'email', success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        incident_id: incident.id,
        alerts_sent: alerts 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security alert error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
