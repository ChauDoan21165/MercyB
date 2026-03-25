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

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json<AppleIapSyncResponse>({ ok: false, error: 'method_not_allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return json<AppleIapSyncResponse>({ ok: false, error: 'unauthorized' }, 401);
  }

  const body = (await req.json()) as AppleIapSyncRequest;
  if (!body.signedTransactionInfo && !body.transactionId) {
    return json<AppleIapSyncResponse>(
      { ok: false, error: 'signedTransactionInfo_or_transactionId_required' },
      400,
    );
  }

  const dedupeKey = await sha256Hex(
    body.signedTransactionInfo ?? `transaction:${body.transactionId}`,
  );

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

  if (eventError && !isUniqueViolation(eventError)) {
    return json<AppleIapSyncResponse>({ ok: false, error: 'event_insert_failed' }, 500);
  }

  if (!insertedEvent && eventError && isUniqueViolation(eventError)) {
    return json<AppleIapSyncResponse>({ ok: true, entitlement_refresh_required: true }, 200);
  }

  try {
    const transaction = await verifyTransactionWithApple({
      signedTransactionInfo: body.signedTransactionInfo,
      transactionId: body.transactionId,
      environmentHint: body.environmentHint,
    });

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

    const projected = await upsertCanonicalSubscription(admin, canonical, user.id, transaction);
    if (!projected.ok) {
      return json<AppleIapSyncResponse>({ ok: false, error: projected.error }, 500);
    }

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
    });
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
    .from('public.subscriptions')
    .select('status,current_period_end,metadata')
    .eq('provider', 'apple')
    .eq('provider_subscription_id', canonical.provider_subscription_id)
    .maybeSingle();

  if (selectError) {
    return { ok: false, error: 'subscription_select_failed' };
  }

  const incomingWithSignedDate: CanonicalSubscriptionRecord = {
    ...canonical,
    metadata: {
      ...canonical.metadata,
      apple_signed_date: transaction.signedDate ?? Date.now(),
      apple_transaction_id: transaction.transactionId,
      apple_original_transaction_id: transaction.originalTransactionId,
      apple_verification_source: 'app_store_server_api',
    },
  };

  if (existing && !shouldProjectIncoming({ current: existing, incoming: incomingWithSignedDate })) {
    return { ok: true };
  }

  const payload = {
    user_id: userId,
    ...incomingWithSignedDate,
  };

  const { error: upsertError } = await admin.from('public.subscriptions').upsert(payload, {
    onConflict: 'provider,provider_subscription_id',
  });

  if (upsertError) {
    return { ok: false, error: 'subscription_upsert_failed' };
  }

  return { ok: true };
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isUniqueViolation(error: { code?: string | null }): boolean {
  return error.code === '23505';
}

function json<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}