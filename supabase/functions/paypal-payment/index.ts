import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateInput, paymentActionSchema } from "../shared/validation.ts";
import { checkRateLimit, checkFeatureFlag } from "../shared/rate-limit.ts";
import { auditLog } from "../_shared/audit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Switch between sandbox and production
const PAYPAL_API = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'  // Production for real money
  : 'https://api-m.sandbox.paypal.com'; // Sandbox for testing

// Structured response type for payment operations
type PaymentResult = {
  success: boolean;
  error?: string;
  data?: {
    subscription_id?: string;
    tier_id?: string;
    provider: 'paypal';
    provider_tx_id?: string;
    order_id?: string;
    clientId?: string;
  };
};

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
      const result: PaymentResult = {
        success: true,
        data: {
          clientId: Deno.env.get('PAYPAL_CLIENT_ID'),
          provider: 'paypal',
        },
      };
      return new Response(
        JSON.stringify(result),
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
        console.error('❌ Tier lookup error:', tierError);
        const result: PaymentResult = {
          success: false,
          error: 'Tier not found',
        };
        return new Response(JSON.stringify(result), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
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
        console.error('❌ PayPal order creation failed:', orderData);
        const result: PaymentResult = {
          success: false,
          error: orderData.message || 'Failed to create PayPal order',
        };
        return new Response(JSON.stringify(result), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result: PaymentResult = {
        success: true,
        data: {
          order_id: orderData.id,
          provider: 'paypal',
        },
      };
      return new Response(JSON.stringify(result), {
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

      if (!captureResponse.ok) {
        console.error('❌ PayPal capture failed:', captureData);
        const result: PaymentResult = {
          success: false,
          error: 'Payment capture failed',
        };
        return new Response(JSON.stringify(result), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (captureData.status === 'COMPLETED') {
        console.log('✅ PayPal payment COMPLETED - starting subscription update', {
          user_id: user.id,
          tier_id: tierId,
          order_id: orderId,
          capture_id: captureData.id,
        });

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
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        if (subError || !subscription) {
          console.error('❌ CRITICAL: Subscription update FAILED after successful payment', {
            user_id: user.id,
            tier_id: tierId,
            order_id: orderId,
            error: subError,
          });
          
          // Log critical failure
          await supabase.rpc('log_security_event', {
            _user_id: user.id,
            _event_type: 'payment_subscription_failure',
            _severity: 'high',
            _metadata: {
              order_id: orderId,
              tier_id: tierId,
              error: subError?.message,
            },
          });

          const result: PaymentResult = {
            success: false,
            error: 'CRITICAL: Subscription update FAILED after payment',
          };
          return new Response(JSON.stringify(result), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Log successful payment with structured data
        console.log('✅ SUBSCRIPTION UPDATED SUCCESSFULLY', {
          user_id: user.id,
          user_email: user.email,
          tier: tier?.name,
          tier_id: tierId,
          amount: tier?.price_monthly,
          provider: 'paypal',
          provider_tx_id: captureData.id,
          order_id: orderId,
          subscription_id: subscription.id,
          period_start: subscription.current_period_start,
          period_end: subscription.current_period_end,
          timestamp: new Date().toISOString(),
        });

        // Log security event
        await supabase.rpc('log_security_event', {
          _user_id: user.id,
          _event_type: 'payment_completed',
          _severity: 'low',
          _metadata: {
            provider: 'paypal',
            tier_id: tierId,
            amount: tier?.price_monthly,
            transaction_id: captureData.id,
          },
        });

        // Audit log for payment capture
        await auditLog({
          type: 'PAYPAL_CAPTURE_SUCCESS',
          user_id: user.id,
          metadata: {
            tier_id: tierId,
            tier_name: tier?.name,
            amount: tier?.price_monthly,
            provider_tx_id: captureData.id,
            order_id: orderId,
            subscription_id: subscription.id,
          },
        });

        // Send notification to admin
        const { data: adminUsers } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminUsers && adminUsers.length > 0) {
          const notificationMessage = `🎉 New Payment Received!\n\nUser: ${user.email}\nTier: ${tier?.name || 'Unknown'}\nAmount: $${tier?.price_monthly || 0}\nDate: ${new Date().toLocaleString()}`;
          
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

        const result: PaymentResult = {
          success: true,
          data: {
            subscription_id: subscription.id,
            tier_id: tierId,
            provider: 'paypal',
            provider_tx_id: captureData.id,
          },
        };

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.error('❌ Payment not completed. Status:', captureData.status);
      const result: PaymentResult = {
        success: false,
        error: `Payment not completed. Status: ${captureData.status}`,
      };
      return new Response(JSON.stringify(result), {
        status: 400,
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