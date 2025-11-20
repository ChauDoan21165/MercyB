import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { code } = await req.json();
    
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code format');
    }

    console.log(`[Redeem] User ${user.id} attempting to redeem code: ${code}`);

    // Get the access code
    const { data: accessCode, error: codeError } = await supabase
      .from('access_codes')
      .select('*, subscription_tiers(*)')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !accessCode) {
      console.error('[Redeem] Code not found or inactive:', codeError);
      throw new Error('Invalid or inactive access code');
    }

    // Check if code has expired
    if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
      console.error('[Redeem] Code has expired');
      throw new Error('This access code has expired');
    }

    // Check if code has reached max uses
    if (accessCode.used_count >= accessCode.max_uses) {
      console.error('[Redeem] Code has reached max uses');
      throw new Error('This access code has been fully redeemed');
    }

    // Check if user already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('access_code_redemptions')
      .select('id')
      .eq('code_id', accessCode.id)
      .eq('user_id', user.id)
      .single();

    if (existingRedemption) {
      console.error('[Redeem] User already redeemed this code');
      throw new Error('You have already redeemed this access code');
    }

    // Get or create user subscription
    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const startDate = existingSub?.current_period_end 
      ? new Date(existingSub.current_period_end)
      : new Date();
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + accessCode.days);

    let subscriptionId = existingSub?.id;

    if (existingSub) {
      // Extend existing subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          tier_id: accessCode.tier_id,
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSub.id);

      if (updateError) {
        console.error('[Redeem] Error updating subscription:', updateError);
        throw updateError;
      }
      console.log(`[Redeem] Extended subscription ${existingSub.id} until ${endDate.toISOString()}`);
    } else {
      // Create new subscription
      const { data: newSub, error: createError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier_id: accessCode.tier_id,
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (createError || !newSub) {
        console.error('[Redeem] Error creating subscription:', createError);
        throw createError;
      }
      subscriptionId = newSub.id;
      console.log(`[Redeem] Created new subscription ${newSub.id}`);
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        tier_id: accessCode.tier_id,
        amount: 0,
        payment_method: 'access_code',
        transaction_type: 'redemption',
        external_reference: code,
        period_days: accessCode.days,
        status: 'completed',
        metadata: {
          code_id: accessCode.id,
          tier_name: accessCode.subscription_tiers?.name
        }
      })
      .select()
      .single();

    if (txError) {
      console.error('[Redeem] Error creating transaction:', txError);
      throw txError;
    }

    // Create redemption record
    const { error: redemptionError } = await supabase
      .from('access_code_redemptions')
      .insert({
        code_id: accessCode.id,
        user_id: user.id,
        subscription_id: subscriptionId,
        transaction_id: transaction.id
      });

    if (redemptionError) {
      console.error('[Redeem] Error creating redemption record:', redemptionError);
      throw redemptionError;
    }

    // Increment used_count
    const { error: updateCodeError } = await supabase
      .from('access_codes')
      .update({ 
        used_count: accessCode.used_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', accessCode.id);

    if (updateCodeError) {
      console.error('[Redeem] Error updating code usage:', updateCodeError);
    }

    console.log(`[Redeem] Successfully redeemed code for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Access code redeemed successfully',
        tier: accessCode.subscription_tiers?.name,
        days: accessCode.days,
        valid_until: endDate.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Redeem] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
