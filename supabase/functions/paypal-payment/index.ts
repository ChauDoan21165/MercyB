import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
  checkEndpointRateLimit,
  logAudit,
  getClientIP,
} from '../_shared/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Switch between sandbox and production
const PAYPAL_API = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

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

type Action = 'get-client-id' | 'create-order' | 'capture-order';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const ip = getClientIP(req);

    const body = await req.json().catch(() => ({}));
    const action: Action | undefined = body?.action;

    if (!action) {
      return json({ success: false, error: 'MISSING_ACTION' }, 400);
    }

    // Public endpoint: get-client-id (no auth required)
    if (action === 'get-client-id') {
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      if (!clientId) {
        await logAudit({
          type: 'paypal_get_client_id_missing_env',
          userId: null,
          metadata: { ip },
        });
        return json(
          { success: false, error: 'PAYPAL_CLIENT_ID_NOT_CONFIGURED' },
          500,
        );
      }

      return json({
        success: true,
        data: { clientId, provider: 'paypal' },
      });
    }

    // All other actions require authentication
    const user = await getUserFromAuthHeader(req);
    if (!user) {
      return json({ success: false, error: 'UNAUTHENTICATED' }, 401);
    }

    // Rate limit per user per action
    await checkEndpointRateLimit(`paypal-payment:${action}`, user.id);

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
      const { tierId } = body;
      if (!tierId) {
        return json(
          { success: false, error: 'MISSING_TIER_ID' },
          400,
        );
      }

      // Get tier details
      const { data: tier, error: tierError } = await supabaseAdmin
        .from('subscription_tiers')
        .select('*')
        .eq('id', tierId)
        .single();

      if (tierError || !tier) {
        console.error('Tier lookup error:', tierError);
        return json({ success: false, error: 'TIER_NOT_FOUND' }, 404);
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

      if (!orderResponse.ok || !orderData.id) {
        console.error('PayPal order creation failed:', orderData);
        await logAudit({
          type: 'paypal_create_order_failed',
          userId: user.id,
          metadata: {
            tier_id: tierId,
            error: orderData.message || 'Unknown error',
            ip,
          },
        });
        return json(
          { success: false, error: orderData.message || 'FAILED_TO_CREATE_ORDER' },
          500,
        );
      }

      await logAudit({
        type: 'paypal_create_order',
        userId: user.id,
        metadata: {
          tier_id: tierId,
          order_id: orderData.id,
          amount: tier.price_monthly,
          ip,
        },
      });

      return json({
        success: true,
        data: {
          order_id: orderData.id,
          provider: 'paypal',
        },
      });
    }

    if (action === 'capture-order') {
      const { orderId, tierId } = body;
      if (!orderId || !tierId) {
        return json(
          { success: false, error: 'MISSING_ORDER_ID_OR_TIER_ID' },
          400,
        );
      }

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
        console.error('PayPal capture failed:', captureData);
        await logAudit({
          type: 'paypal_capture_failed',
          userId: user.id,
          metadata: {
            order_id: orderId,
            tier_id: tierId,
            error: captureData.message || 'Unknown error',
            ip,
          },
        });
        return json(
          { success: false, error: 'PAYMENT_CAPTURE_FAILED' },
          500,
        );
      }

      if (captureData.status !== 'COMPLETED') {
        console.error('Payment not completed. Status:', captureData.status);
        return json(
          { success: false, error: `PAYMENT_STATUS_${captureData.status}` },
          400,
        );
      }

      console.log('PayPal payment COMPLETED', {
        user_id: user.id,
        tier_id: tierId,
        order_id: orderId,
        capture_id: captureData.id,
      });

      // Get tier details
      const { data: tier } = await supabaseAdmin
        .from('subscription_tiers')
        .select('name, price_monthly')
        .eq('id', tierId)
        .single();

      // Update user subscription
      const { data: subscription, error: subError } = await supabaseAdmin
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
        console.error('CRITICAL: Subscription update FAILED after successful payment', {
          user_id: user.id,
          tier_id: tierId,
          order_id: orderId,
          error: subError,
        });

        await logAudit({
          type: 'paypal_subscription_update_failed',
          userId: user.id,
          metadata: {
            order_id: orderId,
            tier_id: tierId,
            capture_id: captureData.id,
            error: subError?.message,
            ip,
          },
        });

        return json(
          { success: false, error: 'SUBSCRIPTION_UPDATE_FAILED' },
          500,
        );
      }

      console.log('SUBSCRIPTION UPDATED SUCCESSFULLY', {
        user_id: user.id,
        user_email: user.email,
        tier: tier?.name,
        tier_id: tierId,
        amount: tier?.price_monthly,
        provider: 'paypal',
        provider_tx_id: captureData.id,
        order_id: orderId,
        subscription_id: subscription.id,
      });

      // Audit log for successful payment
      await logAudit({
        type: 'paypal_capture_success',
        userId: user.id,
        metadata: {
          tier_id: tierId,
          tier_name: tier?.name,
          amount: tier?.price_monthly,
          provider_tx_id: captureData.id,
          order_id: orderId,
          subscription_id: subscription.id,
          ip,
        },
      });

      // Log security event
      await supabaseAdmin.rpc('log_security_event', {
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

      // Send notification to admin
      const { data: adminUsers } = await supabaseAdmin
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (adminUsers && adminUsers.length > 0) {
        const notificationMessage = `🎉 New Payment Received!\n\nUser: ${user.email}\nTier: ${tier?.name || 'Unknown'}\nAmount: $${tier?.price_monthly || 0}\nDate: ${new Date().toLocaleString()}`;
        
        for (const admin of adminUsers) {
          await supabaseAdmin
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

      return json({
        success: true,
        data: {
          subscription_id: subscription.id,
          tier_id: tierId,
          provider: 'paypal',
          provider_tx_id: captureData.id,
        },
      });
    }

    return json({ success: false, error: 'UNKNOWN_ACTION' }, 400);
  } catch (err: unknown) {
    console.error('paypal-payment error', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    await logAudit({
      type: 'paypal_function_error',
      userId: null,
      metadata: {
        message: errorMessage,
      },
    });
    return json(
      { success: false, error: 'INTERNAL_ERROR' },
      500,
    );
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
