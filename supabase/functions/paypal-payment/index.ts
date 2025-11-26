import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateInput, paymentActionSchema } from "../shared/validation.ts";
import { checkRateLimit, checkFeatureFlag } from "../shared/rate-limit.ts";

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

    // Validate input
    const body = await req.json();
    const validatedData = validateInput(paymentActionSchema, body);
    const { action, tierId, orderId } = validatedData;

    // Public endpoint to retrieve client ID for SDK loading (no auth required)
    if (action === 'get-client-id') {
      return new Response(
        JSON.stringify({ clientId: Deno.env.get('PAYPAL_CLIENT_ID') }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate user for all other actions
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check feature flag
    const isPayPalEnabled = await checkFeatureFlag(supabase, "paypal_payments_enabled");
    if (!isPayPalEnabled) {
      return new Response(
        JSON.stringify({ error: "PayPal payments are temporarily disabled" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting check for payments
    const rateLimitCheck = await checkRateLimit(supabase, user.id, "paypal-payment");
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('id', tierId)
        .single();

      if (tierError || !tier) {
        console.error('Tier lookup error:', tierError);
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
          application_context: {
            landing_page: 'LOGIN', // Force PayPal login instead of guest card form
            user_action: 'PAY_NOW', // Show Pay Now for clarity
          },
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
      
      console.log('PayPal order response:', orderData);

      if (!orderResponse.ok || !orderData.id) {
        console.error('PayPal order creation failed:', orderData);
        throw new Error(orderData.message || 'Failed to create PayPal order');
      }

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

      if (captureData.status === 'COMPLETED') {
        // User already authenticated earlier in the function

        // Get tier details for notification
        const { data: tier } = await supabase
          .from('subscription_tiers')
          .select('name, price_monthly')
          .eq('id', tierId)
          .single();

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

        // Send notification to admin
        const { data: adminUsers } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminUsers && adminUsers.length > 0) {
          const notificationMessage = `🎉 New Payment Received!\n\nUser: ${user.email}\nTier: ${tier?.name || 'Unknown'}\nAmount: $${tier?.price_monthly || 0}\nDate: ${new Date().toLocaleString()}`;
          
          // Create a feedback entry for admin notification
          for (const admin of adminUsers) {
            await supabase
              .from('feedback')
              .insert({
                user_id: admin.user_id,
                category: 'payment_notification',
                message: notificationMessage,
                priority: 'high',
                status: 'new'
              });
          }
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
    
    // Map errors to safe messages
    let errorMessage = 'Payment processing failed';
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('validation')) errorMessage = 'Invalid payment information';
      else if (msg.includes('tier not found')) errorMessage = 'Invalid subscription tier';
      else if (msg.includes('rate limit')) errorMessage = 'Too many requests, please try again later';
      else if (msg.includes('authentication')) errorMessage = 'Authentication required';
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});