/**
 * Redeem Gift Code Edge Function
 * 
 * Request: POST { code: string }
 * Response: { ok: boolean, tier?: string, message?: string, error?: string }
 * 
 * Status codes:
 * - 200: Success
 * - 400: Bad request (missing/invalid code, code not found, expired, already used)
 * - 401: Not authenticated
 * - 409: Already redeemed this tier
 * - 500: Server error
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

function jsonResponse(data: object) {
  // Always return 200 to avoid Supabase SDK throwing FunctionsHttpError
  return new Response(JSON.stringify(data), { headers: corsHeaders, status: 200 });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ ok: false, error: 'Please log in to redeem your gift code.' });
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
      return jsonResponse({ ok: false, error: 'Session expired. Please log in again.' });
    }

    console.log('[redeem-gift-code] User:', user.id, user.email);

    // Parse request body
    let body: { code?: string };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid request format.' });
    }

    const code = body?.code?.trim()?.toUpperCase();
    if (!code) {
      return jsonResponse({ ok: false, error: 'Please enter a gift code.' });
    }

    console.log('[redeem-gift-code] Looking up code:', code);

    // Look up gift code using admin client (bypasses RLS)
    const { data: giftCode, error: codeError } = await supabaseAdmin
      .from('gift_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .is('used_at', null)
      .single();

    if (codeError || !giftCode) {
      console.log('[redeem-gift-code] Code not found:', code, codeError?.message);
      return jsonResponse({ ok: false, error: 'Gift code not found. Please check the spelling.' });
    }

    console.log('[redeem-gift-code] Found code:', giftCode.id, 'tier:', giftCode.tier);

    // Check if expired
    if (giftCode.code_expires_at && new Date(giftCode.code_expires_at) < new Date()) {
      return jsonResponse({ ok: false, error: 'This gift code has expired.' });
    }

    // Check if user already redeemed this tier
    const { data: existingRedemption } = await supabaseAdmin
      .from('gift_codes')
      .select('id')
      .eq('used_by', user.id)
      .eq('tier', giftCode.tier)
      .single();

    if (existingRedemption) {
      return jsonResponse({ ok: false, error: `You've already redeemed a ${giftCode.tier} gift code.` });
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
      return jsonResponse({ ok: false, error: 'Failed to apply gift code. Please try again.' });
    }

    // Update user_subscriptions for access control
    const { data: tierData } = await supabaseAdmin
      .from('subscription_tiers')
      .select('id')
      .eq('name', giftCode.tier)
      .single();

    if (tierData) {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tierData.id,
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

    return jsonResponse({ 
      ok: true, 
      tier: giftCode.tier,
      message: `Welcome to ${giftCode.tier}! Your access is now active.`
    });

  } catch (error) {
    console.error('[redeem-gift-code] Error:', error);
    return jsonResponse({ ok: false, error: 'Something went wrong. Please try again.' });
  }
});