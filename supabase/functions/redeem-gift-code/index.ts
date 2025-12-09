/**
 * Redeem Gift Code Edge Function
 * 
 * Request: POST { code: string }
 * Response: { ok: boolean, tier?: string, message?: string, error?: string }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please log in to redeem your gift code.' }),
        { headers: corsHeaders, status: 200 } // Return 200 so SDK parses the JSON
      );
    }

    // Create clients
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('[redeem-gift-code] Auth error:', authError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: 'Session expired. Please log in again.' }),
        { headers: corsHeaders, status: 200 }
      );
    }

    console.log('[redeem-gift-code] User:', user.id, user.email);

    // Parse request body
    let body: { code?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid request format.' }),
        { headers: corsHeaders, status: 200 }
      );
    }

    const code = body?.code?.trim()?.toUpperCase();
    if (!code) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please enter a gift code.' }),
        { headers: corsHeaders, status: 200 }
      );
    }

    console.log('[redeem-gift-code] Looking up code:', code);

    // Look up gift code
    const { data: giftCode, error: codeError } = await supabaseAdmin
      .from('gift_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .is('used_at', null)
      .single();

    if (codeError || !giftCode) {
      console.log('[redeem-gift-code] Code not found:', code, codeError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: "Gift code not found. Please check the spelling." }),
        { headers: corsHeaders, status: 200 }
      );
    }

    console.log('[redeem-gift-code] Found code:', giftCode.id, 'tier:', giftCode.tier);

    // Check if expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ ok: false, error: "This gift code has expired." }),
        { headers: corsHeaders, status: 200 }
      );
    }

    // Check if user already has this tier from a gift code
    const { data: existingRedemption } = await supabaseAdmin
      .from('gift_codes')
      .select('id')
      .eq('used_by', user.id)
      .eq('tier', giftCode.tier)
      .single();

    if (existingRedemption) {
      return new Response(
        JSON.stringify({ ok: false, error: `You've already redeemed a ${giftCode.tier} gift code.` }),
        { headers: corsHeaders, status: 200 }
      );
    }

    const now = new Date().toISOString();

    // Update user_tiers
    const { error: tierError } = await supabaseAdmin
      .from('user_tiers')
      .upsert({
        user_id: user.id,
        tier: giftCode.tier,
        updated_at: now,
      }, { onConflict: 'user_id' });

    if (tierError) {
      console.error('[redeem-gift-code] Tier upsert error:', tierError);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to apply gift code. Please try again." }),
        { headers: corsHeaders, status: 200 }
      );
    }

    // Update user_subscriptions for access control
    const { data: tier } = await supabaseAdmin
      .from('subscription_tiers')
      .select('id')
      .eq('name', giftCode.tier)
      .single();

    if (tier) {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tier.id,
          status: 'active',
          current_period_start: now,
          current_period_end: endDate.toISOString(),
          updated_at: now,
        }, { onConflict: 'user_id' });
    }

    // Mark gift code as used
    await supabaseAdmin
      .from('gift_codes')
      .update({
        used_by: user.id,
        used_at: now,
        is_active: false,
        updated_at: now,
      })
      .eq('id', giftCode.id);

    console.log('[redeem-gift-code] Success for user:', user.id);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        tier: giftCode.tier,
        message: `Welcome to ${giftCode.tier}! Your access is now active.`
      }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    console.error('[redeem-gift-code] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }),
      { headers: corsHeaders, status: 200 }
    );
  }
});