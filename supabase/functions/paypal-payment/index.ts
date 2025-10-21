import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Switch between sandbox and production
const PAYPAL_API = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'  // Production for real money
  : 'https://api-m.sandbox.paypal.com'; // Sandbox for testing

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, orderId, tierId } = await req.json();

    // Public endpoint to retrieve client ID for SDK loading
    if (action === 'get-client-id') {
      return new Response(
        JSON.stringify({ clientId: Deno.env.get('PAYPAL_CLIENT_ID') }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PayPal access token
    const getAccessToken = async () => {
      const auth = btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`);
      const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
      const data = await response.json();
      return data.access_token;
    };

    if (action === 'create-order') {
      // Get tier details
      const { data: tier } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('id', tierId)
        .single();

      if (!tier) {
        throw new Error('Tier not found');
      }

      const accessToken = await getAccessToken();

      // Create PayPal order
      const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: tier.price_monthly.toString(),
            },
            description: `${tier.name} - Monthly Subscription`,
          }],
        }),
      });

      const orderData = await orderResponse.json();
      console.log('PayPal order created:', orderData);

      return new Response(JSON.stringify({ orderId: orderData.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'capture-order') {
      const accessToken = await getAccessToken();

      // Capture PayPal order
      const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const captureData = await captureResponse.json();
      console.log('PayPal order captured:', captureData);

      if (captureData.status === 'COMPLETED') {
        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token!);

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Update user subscription
        const { data: subscription, error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            tier_id: tierId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          })
          .select()
          .single();

        if (subError) {
          console.error('Error updating subscription:', subError);
          throw subError;
        }

        return new Response(JSON.stringify({ 
          success: true, 
          subscription,
          captureData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: false, captureData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PayPal payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
