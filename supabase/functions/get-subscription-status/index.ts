import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Getting subscription status for user: ${user.id}`);

    // Get active subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_tiers (
          id,
          name,
          name_vi,
          price_monthly,
          room_access_per_day,
          custom_topics_allowed,
          priority_support
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    const isAdmin = !!adminRole;

    // Get usage stats
    const { data: usage } = await supabase
      .from('subscription_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('usage_date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    // Get kids subscription if any
    const { data: kidsSubscription } = await supabase
      .from('kids_subscriptions')
      .select(`
        *,
        kids_levels (
          id,
          name_en,
          name_vi,
          price_monthly
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    const result = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      subscription: subscription || null,
      kidsSubscription: kidsSubscription || null,
      isAdmin: isAdmin,
      tier: subscription?.subscription_tiers?.name?.toLowerCase() || 'free',
      usage: {
        roomsAccessed: usage?.rooms_accessed || 0,
        customTopicsRequested: usage?.custom_topics_requested || 0,
        limits: {
          roomsPerDay: subscription?.subscription_tiers?.room_access_per_day || 0,
          customTopics: subscription?.subscription_tiers?.custom_topics_allowed || 0,
        },
      },
      benefits: {
        prioritySupport: subscription?.subscription_tiers?.priority_support || false,
        unlimitedAccess: isAdmin,
      },
    };

    console.log(`Subscription status retrieved: tier=${result.tier}, isAdmin=${isAdmin}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in get-subscription-status:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
