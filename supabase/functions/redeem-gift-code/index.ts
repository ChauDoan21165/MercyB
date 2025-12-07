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
    console.log('[redeem-gift-code] Starting redemption process');
    
    // Use service role key for database operations to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Use anon key with user's auth for getting the user
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
      console.error('[redeem-gift-code] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - please log in again' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[redeem-gift-code] User authenticated:', user.id);

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Gift code is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().trim();
    console.log('[redeem-gift-code] Looking up code:', normalizedCode);

    // Check if code exists and is valid - use admin client
    const { data: giftCode, error: codeError } = await supabaseAdmin
      .from('gift_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .is('used_at', null)
      .single();

    if (codeError) {
      console.error('[redeem-gift-code] Code lookup error:', codeError);
      return new Response(
        JSON.stringify({ error: 'Invalid or already used gift code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!giftCode) {
      console.error('[redeem-gift-code] Code not found:', normalizedCode);
      return new Response(
        JSON.stringify({ error: 'Invalid or already used gift code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('[redeem-gift-code] Found gift code:', giftCode.id, 'tier:', giftCode.tier);

    // Check if code has expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This gift code has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if user already has this tier via a gift code - use admin client
    const { data: existingRedemption } = await supabaseAdmin
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

    // Get tier_id for the subscription - use admin client
    const { data: tier, error: tierError } = await supabaseAdmin
      .from('subscription_tiers')
      .select('id')
      .eq('name', giftCode.tier)
      .single();

    if (tierError || !tier) {
      console.error('[redeem-gift-code] Tier lookup error:', tierError);
      return new Response(
        JSON.stringify({ error: 'Invalid tier configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('[redeem-gift-code] Found tier:', tier.id);

    const now = new Date();
    const subscriptionEnd = new Date(now);
    
    // Use the gift code's expiry date to calculate subscription duration
    if (giftCode.code_expires_at) {
      const expiryDate = new Date(giftCode.code_expires_at);
      const createdDate = new Date(giftCode.created_at);
      const durationMs = expiryDate.getTime() - createdDate.getTime();
      subscriptionEnd.setTime(now.getTime() + durationMs);
    } else {
      // Default to 1 year
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
    }

    // Format duration for user-friendly message
    const durationDays = Math.round((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let durationLabel = '1 year';
    if (durationDays <= 35) durationLabel = '1 month';
    else if (durationDays <= 100) durationLabel = '3 months';
    else if (durationDays <= 200) durationLabel = '6 months';

    // Create subscription - use admin client
    const { error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        tier_id: tier.id,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: subscriptionEnd.toISOString(),
      });

    if (subscriptionError) {
      console.error('[redeem-gift-code] Subscription creation error:', subscriptionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription: ' + subscriptionError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('[redeem-gift-code] Subscription created successfully');

    // Mark code as used - use admin client
    const { error: updateError } = await supabaseAdmin
      .from('gift_codes')
      .update({
        used_by: user.id,
        used_at: now.toISOString(),
        is_active: false,
      })
      .eq('id', giftCode.id);

    if (updateError) {
      console.error('[redeem-gift-code] Gift code update error:', updateError);
    } else {
      console.log('[redeem-gift-code] Gift code marked as used');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully redeemed ${giftCode.tier} gift code! Access granted for ${durationLabel}.`,
        tier: giftCode.tier,
        duration: durationLabel,
        expires_at: subscriptionEnd.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[redeem-gift-code] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
