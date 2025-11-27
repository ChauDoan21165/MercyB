import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  tier_id: string;
  payment_method: 'paypal' | 'stripe';
  period: 'monthly' | 'yearly';
  success_url?: string;
  cancel_url?: string;
}

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

    const { tier_id, payment_method, period, success_url, cancel_url }: CheckoutRequest = await req.json();
    console.log(`Creating checkout session for user ${user.id}: tier=${tier_id}, method=${payment_method}, period=${period}`);

    // Get tier details
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tier_id)
      .single();

    if (tierError || !tier) {
      console.error('Tier not found:', tierError);
      return new Response(
        JSON.stringify({ error: 'Invalid tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amount = period === 'yearly' && tier.price_yearly ? tier.price_yearly : tier.price_monthly;

    if (payment_method === 'paypal') {
      // PayPal checkout
      const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      const paypalMode = Deno.env.get('PAYPAL_MODE') || 'sandbox';
      const paypalBaseUrl = paypalMode === 'live' 
        ? 'https://api-m.paypal.com' 
        : 'https://api-m.sandbox.paypal.com';

      // Get PayPal access token
      const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      const authData = await authResponse.json();

      // Create PayPal order
      const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
            },
            description: `${tier.name} - ${period} subscription`,
            custom_id: JSON.stringify({
              user_id: user.id,
              tier_id: tier_id,
              period: period,
            }),
          }],
          application_context: {
            return_url: success_url || `${Deno.env.get('SUPABASE_URL')}/payment-success`,
            cancel_url: cancel_url || `${Deno.env.get('SUPABASE_URL')}/payment-cancel`,
          },
        }),
      });

      const orderData = await orderResponse.json();
      const approveLink = orderData.links?.find((link: any) => link.rel === 'approve')?.href;

      // Log transaction
      await supabase.from('payment_transactions').insert({
        user_id: user.id,
        tier_id: tier_id,
        amount: amount,
        payment_method: 'paypal',
        transaction_type: 'subscription',
        status: 'pending',
        external_reference: orderData.id,
        period_days: period === 'yearly' ? 365 : 30,
        metadata: { order_id: orderData.id, period },
      });

      console.log(`PayPal checkout session created: ${orderData.id}`);

      return new Response(
        JSON.stringify({
          success: true,
          checkout_url: approveLink,
          session_id: orderData.id,
          payment_method: 'paypal',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (payment_method === 'stripe') {
      // Stripe checkout (placeholder - requires Stripe integration)
      console.error('Stripe not yet implemented');
      return new Response(
        JSON.stringify({ error: 'Stripe integration coming soon. Please use PayPal or USDT.' }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid payment method' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-checkout-session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
