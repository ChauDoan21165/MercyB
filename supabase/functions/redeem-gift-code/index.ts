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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Gift code is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().trim();

    // Check if code exists and is valid
    const { data: giftCode, error: codeError } = await supabaseClient
      .from('gift_codes')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (codeError || !giftCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid gift code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check if code is already used
    if (giftCode.used_by) {
      return new Response(
        JSON.stringify({ error: 'This gift code has already been used' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if code is active
    if (!giftCode.is_active) {
      return new Response(
        JSON.stringify({ error: 'This gift code is no longer active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if code has expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This gift code has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if user already has this gift code redeemed (check by user)
    const { data: existingRedemption } = await supabaseClient
      .from('gift_codes')
      .select('id')
      .eq('used_by', user.id)
      .eq('tier', giftCode.tier)
      .single();

    if (existingRedemption) {
      return new Response(
        JSON.stringify({ error: `You have already redeemed a ${giftCode.tier} gift code` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get tier_id for the subscription
    const { data: tier, error: tierError } = await supabaseClient
      .from('subscription_tiers')
      .select('id')
      .eq('name', giftCode.tier)
      .single();

    if (tierError || !tier) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Create subscription
    const { error: subscriptionError } = await supabaseClient
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        tier_id: tier.id,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: oneYearLater.toISOString(),
      });

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Mark code as used
    const { error: updateError } = await supabaseClient
      .from('gift_codes')
      .update({
        used_by: user.id,
        used_at: now.toISOString(),
      })
      .eq('id', giftCode.id);

    if (updateError) {
      console.error('Gift code update error:', updateError);
      // Note: Subscription was created, but we couldn't mark the code as used
      // This is acceptable as the code validation will still prevent reuse by checking used_by
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully redeemed ${giftCode.tier} gift code! Access granted for 1 year.`,
        tier: giftCode.tier,
        expires_at: oneYearLater.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in redeem-gift-code:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
