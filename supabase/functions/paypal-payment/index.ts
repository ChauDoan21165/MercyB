// supabase/functions/paypal-payment/index.ts
// Deno Edge Function

import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
  checkEndpointRateLimit,
  logAudit,
  getClientIP,
} from '../_shared/security.ts';
import type { Json } from '../_shared/database.types.ts';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_API_BASE =
  Deno.env.get('PAYPAL_MODE') === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn(
    '[paypal-payment] Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET env vars',
  );
}

type BillingPeriod = 'monthly' | 'yearly';

type Action = 'get-client-id' | 'create-order' | 'capture-order';

interface BaseBody {
  action: Action;
}

interface CreateOrderBody extends BaseBody {
  action: 'create-order';
  tier_id: string;
  period: BillingPeriod;
}

interface CaptureOrderBody extends BaseBody {
  action: 'capture-order';
  order_id: string;
  tier_id: string;
  period: BillingPeriod;
}

interface GetClientIdBody extends BaseBody {
  action: 'get-client-id';
}

type RequestBody = CreateOrderBody | CaptureOrderBody | GetClientIdBody;

const ENDPOINT_NAME = 'paypal-payment';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal environment variables not configured');
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[paypal] getAccessToken failed', res.status, text);
    throw new Error('Failed to obtain PayPal access token');
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Missing access_token from PayPal response');
  }
  return data.access_token;
}

async function createPayPalOrder(
  accessToken: string,
  params: {
    amount: string;
    currency: string;
    userId: string;
    tierId: string;
    period: BillingPeriod;
  },
) {
  const { amount, currency, userId, tierId, period } = params;

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          custom_id: `${userId}:${tierId}:${period}`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[paypal] createOrder failed', res.status, text);
    throw new Error('Failed to create PayPal order');
  }

  return (await res.json()) as { id?: string };
}

async function capturePayPalOrder(accessToken: string, orderId: string) {
  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error('[paypal] captureOrder failed', res.status, text);
    throw new Error('Failed to capture PayPal order');
  }

  return (await res.json()) as { status?: string; id?: string; [k: string]: unknown };
}

Deno.serve(async (req) => {
  const ip = getClientIP(req);
  let user: { id: string } | null = null;

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
    }

    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return jsonResponse({ error: 'INVALID_JSON' }, 400);
    }

    const action = body.action;
    if (!action) {
      return jsonResponse({ error: 'MISSING_ACTION' }, 400);
    }

    // 1) Public action: get-client-id (no auth required)
    if (action === 'get-client-id') {
      if (!PAYPAL_CLIENT_ID) {
        return jsonResponse(
          { success: false, error: 'PAYPAL_NOT_CONFIGURED' },
          500,
        );
      }

      await logAudit({
        type: 'paypal_get_client_id',
        userId: null,
        metadata: {
          ip,
        },
      });

      return jsonResponse({
        success: true,
        data: { clientId: PAYPAL_CLIENT_ID },
      });
    }

    // 2) Authenticated actions
    user = await getUserFromAuthHeader(req);
    if (!user) {
      return jsonResponse({ error: 'UNAUTHORIZED' }, 401);
    }

    await checkEndpointRateLimit(ENDPOINT_NAME, user.id);

    const supabase = createSupabaseAdminClient();

    // 2a) Create order
    if (action === 'create-order') {
      const { tier_id, period } = body as CreateOrderBody;

      if (!tier_id || !period) {
        return jsonResponse({ error: 'MISSING_PARAMETERS' }, 400);
      }

      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('id', tier_id)
        .eq('is_active', true)
        .single();

      if (tierError || !tier) {
        console.error('[paypal] Tier lookup failed', tierError);
        return jsonResponse({ error: 'INVALID_TIER' }, 400);
      }

      const priceNumber =
        period === 'yearly'
          ? tier.price_yearly
          : tier.price_monthly;

      if (!priceNumber || priceNumber <= 0) {
        return jsonResponse({ error: 'INVALID_PRICE' }, 400);
      }

      const amount = priceNumber.toFixed(2);
      const currency = 'USD';

      const accessToken = await getPayPalAccessToken();
      const order = await createPayPalOrder(accessToken, {
        amount,
        currency,
        userId: user.id,
        tierId: tier_id,
        period,
      });

      if (!order.id) {
        throw new Error('Missing order ID from PayPal create-order response');
      }

      // Optionally insert a pending payment_transactions record
      await supabase.from('payment_transactions').insert({
        user_id: user.id,
        tier_id: tier_id,
        amount: priceNumber,
        payment_method: 'paypal',
        period_days: period === 'yearly' ? 365 : 30,
        status: 'pending',
        transaction_type: 'subscription',
        external_reference: order.id,
        metadata: {
          ip,
          period,
        } as Json,
      });

      await logAudit({
        type: 'paypal_create_order',
        userId: user.id,
        metadata: {
          ip,
          tier_id,
          period,
          amount,
          currency,
          paypal_order_id: order.id,
        },
      });

      return jsonResponse({
        success: true,
        data: { order_id: order.id },
      });
    }

    // 2b) Capture order
    if (action === 'capture-order') {
      const { order_id, tier_id, period } = body as CaptureOrderBody;

      if (!order_id || !tier_id || !period) {
        return jsonResponse({ error: 'MISSING_PARAMETERS' }, 400);
      }

      const accessToken = await getPayPalAccessToken();
      const capture = await capturePayPalOrder(accessToken, order_id);

      const status = capture.status ?? 'UNKNOWN';

      if (status !== 'COMPLETED') {
        await logAudit({
          type: 'paypal_capture_failed',
          userId: user.id,
          metadata: {
            ip,
            order_id,
            tier_id,
            period,
            status,
            capture,
          } as Json,
        });

        return jsonResponse(
          {
            success: false,
            error: 'PAYMENT_NOT_COMPLETED',
            data: { status, order_id },
          },
          400,
        );
      }

      // Mark transaction as completed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          metadata: {
            ip,
            period,
            capture,
          } as Json,
        })
        .eq('external_reference', order_id)
        .eq('user_id', user.id);

      // Upsert user_subscriptions
      const now = new Date();
      const periodDays = period === 'yearly' ? 365 : 30;
      const end = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);

      await supabase
        .from('user_subscriptions')
        .upsert(
          {
            user_id: user.id,
            tier_id,
            status: 'active',
            current_period_start: now.toISOString(),
            current_period_end: end.toISOString(),
            updated_at: now.toISOString(),
          },
          { onConflict: 'user_id' },
        );

      await logAudit({
        type: 'paypal_capture_order',
        userId: user.id,
        metadata: {
          ip,
          order_id,
          tier_id,
          period,
          status,
        },
      });

      return jsonResponse({
        success: true,
        data: {
          order_id,
          tier_id,
          period,
          status,
        },
      });
    }

    // Unknown action
    return jsonResponse({ error: 'UNKNOWN_ACTION' }, 400);
  } catch (err) {
    if (err instanceof Response) {
      // thrown by helpers (assertAdmin, checkEndpointRateLimit, etc.)
      return err;
    }

    console.error('[paypal-payment] Unhandled error', err);

    await logAudit({
      type: 'paypal_internal_error',
      userId: user?.id ?? null,
      metadata: {
        ip,
        message: err instanceof Error ? err.message : String(err),
      },
    });

    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }
});
