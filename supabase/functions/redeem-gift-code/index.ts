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
  'Content-Type': 'application/json',
};

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), { headers: corsHeaders, status });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[redeem-gift-code] Starting redemption process');
    
    // Check for Authorization header first
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[redeem-gift-code] No Authorization header');
      return jsonResponse({ ok: false, error: 'Please log in to redeem your gift code.' }, 401);
    }

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
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user from Cloud auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('[redeem-gift-code] Auth error:', authError?.message);
      return jsonResponse({ ok: false, error: 'Session expired. Please log in again.' }, 401);
    }

    console.log('[redeem-gift-code] User authenticated:', user.id, user.email);

    // Parse request body with error handling
    let body: { code?: string };
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('[redeem-gift-code] JSON parse error:', parseError);
      return jsonResponse({ ok: false, error: 'Invalid request format.' }, 400);
    }

    const code = body?.code;

    if (!code || typeof code !== 'string' || !code.trim()) {
      console.error('[redeem-gift-code] Missing or invalid code:', code);
      return jsonResponse({ ok: false, error: 'Please enter a gift code.' }, 400);
    }

    // Normalize code (uppercase, trimmed)
    const normalizedCode = code.trim().toUpperCase();
    console.log('[redeem-gift-code] Looking up code:', normalizedCode);

    // Look up gift code - must be active and not yet used
    const { data: giftCode, error: codeError } = await supabaseAdmin
      .from('gift_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .is('used_at', null)
      .single();

    if (codeError || !giftCode) {
      console.error('[redeem-gift-code] Code not found:', normalizedCode, codeError?.message);
      return jsonResponse({ 
        ok: false, 
        error: "I couldn't find that gift code. Check the spelling or send us a screenshot so we can help." 
      }, 400);
    }

    console.log('[redeem-gift-code] Found gift code:', giftCode.id, 'tier:', giftCode.tier);

    // Check if expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      console.log('[redeem-gift-code] Code expired:', giftCode.code_expires_at);
      return jsonResponse({ 
        ok: false, 
        error: "This gift code has expired. If you think this is a mistake, send us a screenshot and we'll check it manually." 
      }, 400);
    }

    // Check if user already redeemed same tier
    const { data: existingRedemption } = await supabaseAdmin
      .from('gift_codes')
      .select('id')
      .eq('used_by', user.id)
      .eq('tier', giftCode.tier)
      .single();

    if (existingRedemption) {
      console.log('[redeem-gift-code] User already redeemed this tier');
      return jsonResponse({ 
        ok: false, 
        error: `You've already redeemed a ${giftCode.tier} gift code.` 
      }, 400);
    }

    const now = new Date();

    // Upsert user_tiers (the simple tier tracking table)
    const { error: tierError } = await supabaseAdmin
      .from('user_tiers')
      .upsert({
        user_id: user.id,
        tier: giftCode.tier,
        updated_at: now.toISOString(),
      }, { onConflict: 'user_id' });

    if (tierError) {
      console.error('[redeem-gift-code] Tier upsert error:', tierError);
      return jsonResponse({ 
        ok: false, 
        error: "Something went wrong while applying this gift. Please try again or send us a screenshot." 
      }, 500);
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

      const { error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tier.id,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: subscriptionEnd.toISOString(),
          updated_at: now.toISOString(),
        }, { onConflict: 'user_id' });

      if (subError) {
        console.error('[redeem-gift-code] Subscription upsert error:', subError);
        // Don't fail - tier was already updated
      } else {
        console.log('[redeem-gift-code] Subscription created/updated');
      }
    } else {
      console.warn('[redeem-gift-code] No subscription_tiers entry for:', giftCode.tier);
    }

    // Mark gift code as used
    const { error: updateError } = await supabaseAdmin
      .from('gift_codes')
      .update({
        used_by: user.id,
        used_at: now.toISOString(),
        is_active: false,
        updated_at: now.toISOString(),
      })
      .eq('id', giftCode.id);

    if (updateError) {
      console.error('[redeem-gift-code] Failed to mark code as used:', updateError);
    } else {
      console.log('[redeem-gift-code] Gift code marked as used');
    }

    return jsonResponse({ 
      ok: true,
      tier: giftCode.tier,
      message: `Gift code applied! Welcome to ${giftCode.tier} 💛`
    }, 200);

  } catch (error) {
    console.error('[redeem-gift-code] Unexpected error:', error);
    return jsonResponse({ 
      ok: false, 
      error: "Something went wrong while applying this gift. Please try again or send us a screenshot." 
    }, 500);
  }
});
