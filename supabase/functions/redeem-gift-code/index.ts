/**
 * Redeem Gift Code Edge Function
 * 
 * ARCHITECTURE:
 * - Uses Lovable Cloud auth for user verification
 * - Updates user_tiers table with the redeemed tier
 * - Also creates a user_subscription for access control compatibility
 * 
 * Request: POST { code: string }
 * Response: { ok: boolean, tier?: string, message?: string, error?: string }
 */

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
    
    // Service role client for database operations (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // User client for authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user from Cloud auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[redeem-gift-code] No Authorization header');
      return new Response(
        JSON.stringify({ ok: false, error: 'Please log in to redeem your gift code.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('[redeem-gift-code] Auth error:', authError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: 'Session expired. Please log in again.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[redeem-gift-code] User authenticated:', user.id, user.email);

    // Parse request body
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please enter a gift code.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Normalize code
    const normalizedCode = code.trim().toUpperCase();
    console.log('[redeem-gift-code] Looking up code:', normalizedCode);

    // Look up gift code
    const { data: giftCode, error: codeError } = await supabaseAdmin
      .from('gift_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .is('used_at', null)
      .single();

    if (codeError || !giftCode) {
      console.error('[redeem-gift-code] Code not found:', normalizedCode, codeError);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "I couldn't find that gift code. Check the spelling or send us a screenshot so we can help." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('[redeem-gift-code] Found gift code:', giftCode.id, 'tier:', giftCode.tier);

    // Check if expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "This gift code has expired. If you think this is a mistake, send us a screenshot and we'll check it manually." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if already used by this user
    const { data: existingRedemption } = await supabaseAdmin
      .from('gift_codes')
      .select('id')
      .eq('used_by', user.id)
      .eq('tier', giftCode.tier)
      .single();

    if (existingRedemption) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `You've already redeemed a ${giftCode.tier} gift code.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Upsert user_tiers (the simple tier tracking table)
    const now = new Date();
    const { error: tierError } = await supabaseAdmin
      .from('user_tiers')
      .upsert({
        user_id: user.id,
        tier: giftCode.tier,
        updated_at: now.toISOString(),
      }, { onConflict: 'user_id' });

    if (tierError) {
      console.error('[redeem-gift-code] Tier upsert error:', tierError);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Something went wrong while applying this gift. Please try again or send us a screenshot." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('[redeem-gift-code] User tier updated');

    // Also create/update user_subscription for access control compatibility
    const { data: tier } = await supabaseAdmin
      .from('subscription_tiers')
      .select('id')
      .eq('name', giftCode.tier)
      .single();

    if (tier) {
      const subscriptionEnd = new Date(now);
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1); // 1 year default

      await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tier.id,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: subscriptionEnd.toISOString(),
        }, { onConflict: 'user_id' });

      console.log('[redeem-gift-code] Subscription created');
    }

    // Mark gift code as used
    await supabaseAdmin
      .from('gift_codes')
      .update({
        used_by: user.id,
        used_at: now.toISOString(),
        is_active: false,
      })
      .eq('id', giftCode.id);

    console.log('[redeem-gift-code] Gift code marked as used');

    return new Response(
      JSON.stringify({ 
        ok: true,
        tier: giftCode.tier,
        message: `Gift code applied. Welcome to your new tier 💛`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[redeem-gift-code] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "Something went wrong while applying this gift. Please try again or send us a screenshot." 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
