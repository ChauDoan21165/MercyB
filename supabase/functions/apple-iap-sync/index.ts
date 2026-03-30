/**
 * File: supabase/functions/apple-iap-sync/index.ts
 * Description: Hardened Apple IAP Sync Engine with Account Lockdown.
 * Features: 
 * 1. SHA-256 Event Deduplication (Audit Trail)
 * 2. Original Transaction ID Ownership Check (Anti-Fraud)
 * 3. Canonical Subscription Mapping (Standardized Entitlements)
 * 4. Auth-Guard & Service-Role Isolation
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  AppleEnvironment,
  CanonicalSubscriptionRecord,
  mapAppleToCanonical,
  shouldProjectIncoming,
} from '../_shared/apple-billing.ts';
import { verifyTransactionWithApple } from '../_shared/apple-api.ts';

type AppleIapSyncRequest = {
  signedTransactionInfo?: string;
  transactionId?: string;
  appAccountToken?: string;
  platform?: 'ios';
  environmentHint?: AppleEnvironment;
};

type AppleIapSyncResponse = {
  ok: boolean;
  subscription?: Pick<
    CanonicalSubscriptionRecord,
    | 'provider'
    | 'provider_subscription_id'
    | 'provider_price_id'
    | 'status'
    | 'current_period_start'
    | 'current_period_end'
  >;
  entitlement_refresh_required?: boolean;
  error?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json<AppleIapSyncResponse>({ ok: false, error: 'method_not_allowed' }, 405);
  }

  // 1. Initialize Clients
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const admin = createClient(supabaseUrl, serviceRoleKey);

  // 2. Auth Guard
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) {
    return json<AppleIapSyncResponse>({ ok: false, error: 'unauthorized' }, 401);
  }

  const body = (await req.json()) as AppleIapSyncRequest;
  if (!body.signedTransactionInfo && !body.transactionId) {
    return json<AppleIapSyncResponse>({ ok: false, error: 'signedTransactionInfo_or_transactionId_required' }, 400);
  }

  // 3. Deduplication via SHA-256 (Audit Trail)
  const dedupeKey = await sha256Hex(body.signedTransactionInfo ?? `transaction:${body.transactionId}`);

  const { data: insertedEvent, error: eventError } = await admin
    .from('apple_iap_events')
    .insert({
      provider: 'apple',
      event_source: 'device_sync',
      dedupe_key: dedupeKey,
      raw_payload: body,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (eventError && isUniqueViolation(eventError)) {
    return json<AppleIapSyncResponse>({ ok: true, entitlement_refresh_required: true }, 200);
  }

  if (eventError) {
    return json<AppleIapSyncResponse>({ ok: false, error: 'event_insert_failed' }, 500);
  }

  try {
    // 4. Verify with Apple App Store Server API
    const transaction = await verifyTransactionWithApple({
      signedTransactionInfo: body.signedTransactionInfo,
      transactionId: body.transactionId,
      environmentHint: body.environmentHint,
    });

    // 5. ACCOUNT LOCKDOWN: Ownership Verification
    // We check if this specific Apple Purchase (originalTransactionId) is already owned by someone else
    const { data: existingSub, error: subCheckError } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('provider', 'apple')
      .eq('provider_subscription_id', transaction.originalTransactionId)
      .maybeSingle();

    if (subCheckError) throw new Error("Subscription integrity check failed");

    // BLOCK if the transaction belongs to a different MercyB account
    if (existingSub && existingSub.user_id !== user.id) {
      console.warn(`[LOCKDOWN-BLOCK] User ${user.id} attempted to hijack Transaction ${transaction.originalTransactionId} belonging to ${existingSub.user_id}`);
      return json<AppleIapSyncResponse>({ ok: false, error: 'transaction_bound_to_different_user' }, 403);
    }

    // 6. Map to MercyB Canonical Format
    const canonical = mapAppleToCanonical({
      transaction: {
        ...transaction,
        appAccountToken: body.appAccountToken ?? transaction.appAccountToken,
      },
      providerCustomerId: body.appAccountToken ?? user.id,
      raw: {
        source: 'device_sync',
        signedTransactionInfo_present: Boolean(body.signedTransactionInfo),
        transactionId_arg: body.transactionId ?? null,
      },
    });

    // 7. Upsert to Subscriptions Table
    const projected = await upsertCanonicalSubscription(admin, canonical, user.id, transaction);
    if (!projected.ok) {
      return json<AppleIapSyncResponse>({ ok: false, error: projected.error }, 500);
    }

    // 8. Mark Event as Processed
    await admin
      .from('apple_iap_events')
      .update({
        processed_at: new Date().toISOString(),
        original_transaction_id: transaction.originalTransactionId,
        transaction_id: transaction.transactionId,
        signed_date: transaction.signedDate ? new Date(transaction.signedDate).toISOString() : null,
      })
      .eq('id', insertedEvent.id);

    return json<AppleIapSyncResponse>({
      ok: true,
      subscription: {
        provider: canonical.provider,
        provider_subscription_id: canonical.provider_subscription_id,
        provider_price_id: canonical.provider_price_id,
        status: canonical.status,
        current_period_start: canonical.current_period_start,
        current_period_end: canonical.current_period_end,
      },
      entitlement_refresh_required: true,
    }, 200);

  } catch (error) {
    return json<AppleIapSyncResponse>(
      { ok: false, error: error instanceof Error ? error.message : 'apple_verification_failed' },
      400,
    );
  }
});

async function upsertCanonicalSubscription(
  admin: ReturnType<typeof createClient>,
  canonical: CanonicalSubscriptionRecord,
  userId: string,
  transaction: { signedDate?: number; transactionId: string; originalTransactionId: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: existing, error: selectError } = await admin
    .from('subscriptions')
    .select('status,current_period_end,metadata')
    .eq('provider', 'apple')
    .eq('provider_subscription_id', canonical.provider_subscription_id)
    .maybeSingle();

  if (selectError) return { ok: false, error: 'subscription_select_failed' };

  const incomingWithSignedDate: CanonicalSubscriptionRecord = {
    ...canonical,
    metadata: {
      ...canonical.metadata,
      apple_signed_date: transaction.signedDate ?? Date.now(),
      apple_transaction_id: transaction.transactionId,
      apple_original_transaction_id: transaction.originalTransactionId,
    },
  };

  if (existing && !shouldProjectIncoming({ current: existing, incoming: incomingWithSignedDate })) {
    return { ok: true };
  }

  const { error: upsertError } = await admin.from('subscriptions').upsert({
    user_id: userId,
    ...incomingWithSignedDate,
  }, { onConflict: 'provider,provider_subscription_id' });

  return upsertError ? { ok: false, error: 'subscription_upsert_failed' } : { ok: true };
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isUniqueViolation(error: any): boolean {
  return error.code === '23505';
}

function json<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders },
  });
}