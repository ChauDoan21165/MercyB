import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { rateLimit, getClientIP } from "../_shared/rateLimit.ts";
import { auditLog } from "../_shared/audit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetTierRequest {
  user_id: string;
  tier_name: string;
  days: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify authentication and admin role
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      console.error('Admin access denied');
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit admin actions
    try {
      const clientIP = getClientIP(req);
      await rateLimit(`admin-set-tier:${user.id}:${clientIP}`, 30, 60_000); // 30 calls per minute
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return new Response(
          JSON.stringify({ error: 'Too many admin actions. Please slow down.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { user_id, tier_name, days }: SetTierRequest = await req.json();
    console.log(`Admin setting tier for user ${user_id}: ${tier_name} for ${days} days`);

    // Get tier ID
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('id')
      .eq('name', tier_name)
      .maybeSingle();

    if (tierError || !tier) {
      console.error('Tier not found:', tierError);
      return new Response(
        JSON.stringify({ error: 'Tier not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or update subscription
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + days);

    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id,
        tier_id: tier.id,
        status: 'active',
        current_period_start: currentDate.toISOString(),
        current_period_end: endDate.toISOString(),
        updated_at: currentDate.toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error('Error updating subscription:', subError);
      return new Response(
        JSON.stringify({ error: subError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log admin action
    await supabase.rpc('log_admin_access', {
      _accessed_table: 'user_subscriptions',
      _accessed_record_id: subscription.id,
      _action: 'set_tier',
      _metadata: { user_id, tier_name, days },
    });

    // Log security event
    await supabase.rpc('log_security_event', {
      _user_id: user_id,
      _event_type: 'tier_changed',
      _severity: 'info',
      _metadata: { tier_name, days, changed_by: user.id },
    });

    // Audit log for admin tier change
    await auditLog({
      type: 'ADMIN_SET_TIER',
      user_id: user.id,
      metadata: {
        target_user_id: user_id,
        tier_name: tier_name,
        days: days,
        subscription_id: subscription.id,
      },
    });

    console.log(`Tier set successfully for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        subscription,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in admin-set-tier:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
