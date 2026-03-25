import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  AppleRenewalInfo,
  AppleTransaction,
  CanonicalSubscriptionRecord,
  mapAppleToCanonical,
  shouldProjectIncoming,
} from '../_shared/apple-billing.ts';
import {
  decodeAndValidateRenewalInfo,
  decodeJWSPayload,
  verifyTransactionWithApple,
} from '../_shared/apple-api.ts';

type AppleServerNotificationRequest = {
  signedPayload: string;
};

type AppleServerNotificationResponse = {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
};

type NotificationPayload = {
  notificationType: string;
  subtype?: string;
  notificationUUID?: string;
  data?: {
    appAppleId?: number;
    bundleId?: string;
    bundleVersion?: string;
    environment?: string;
    signedRenewalInfo?: string;
    signedTransactionInfo?: string;
    status?: number;
  };
  signedDate?: number;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json<AppleServerNotificationResponse>({ ok: false, error: 'method_not_allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const body = (await req.json()) as AppleServerNotificationRequest;
  if (!body?.signedPayload) {
    return json<AppleServerNotificationResponse>({ ok: false, error: 'signedPayload_required' }, 400);
  }

  let payload: NotificationPayload;
  try {
    payload = decodeJWSPayload<NotificationPayload>(body.signedPayload, 'invalid_signed_payload');
  } catch (error) {
    return json<AppleServerNotificationResponse>(
      { ok: false, error: error instanceof Error ? error.message : 'invalid_signed_payload' },
      400,
    );
  }

  const dedupeKey = payload.notificationUUID ?? (await sha256Hex(body.signedPayload));
  const { data: eventRow, error: eventError } = await admin
    .from('apple_iap_events')
    .insert({
      provider: 'apple',
      event_source: 'server_notification',
      dedupe_key: dedupeKey,
      raw_payload: payload,
      notification_uuid: payload.notificationUUID ?? null,
      signed_date: payload.signedDate ? new Date(payload.signedDate).toISOString() : null,
    })
    .select('id')
    .single();

  if (eventError && !isUniqueViolation(eventError)) {
    return json<AppleServerNotificationResponse>({ ok: false, error: 'event_insert_failed' }, 500);
  }

  if (!eventRow && eventError && isUniqueViolation(eventError)) {
    return json<AppleServerNotificationResponse>({ ok: true, duplicate: true }, 200);
  }

  try {
    const renewal = payload.data?.signedRenewalInfo
      ? decodeAndValidateRenewalInfo(payload.data.signedRenewalInfo)
      : null;

    const decodedTxId = payload.data?.signedTransactionInfo
      ? tryExtractTransactionId(payload.data.signedTransactionInfo)
      : null;

    if (!decodedTxId) {
      await markProcessed(admin, eventRow.id, null, null, payload.signedDate);
      return json<AppleServerNotificationResponse>({ ok: true }, 200);
    }

    const tx = await verifyTransactionWithApple({
      signedTransactionInfo: payload.data?.signedTransactionInfo,
      transactionId: decodedTxId,
      environmentHint: normalizeEnvironment(payload.data?.environment),
    });

    const canonical = mapAppleToCanonical({
      transaction: tx,
      renewalInfo: applyRenewalHints(renewal, payload),
      raw: {
        source: 'server_notification',
        notificationType: payload.notificationType,
        subtype: payload.subtype ?? null,
        payloadStatus: payload.data?.status ?? null,
      },
    });

    const projected = await projectSubscription(admin, canonical, tx, renewal, payload);
    if (!projected.ok) {
      return json<AppleServerNotificationResponse>({ ok: false, error: projected.error }, 500);
    }

    await markProcessed(
      admin,
      eventRow.id,
      tx.originalTransactionId,
      tx.transactionId,
      payload.signedDate ?? tx.signedDate,
    );
    return json<AppleServerNotificationResponse>({ ok: true }, 200);
  } catch (error) {
    return json<AppleServerNotificationResponse>(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'apple_notification_processing_failed',
      },
      400,
    );
  }
});

async function projectSubscription(
  admin: ReturnType<typeof createClient>,
  canonical: CanonicalSubscriptionRecord,
  tx: AppleTransaction,
  renewal: AppleRenewalInfo | null,
  payload: NotificationPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: existing, error: selectError } = await admin
    .from('public.subscriptions')
    .select('user_id,status,current_period_end,metadata')
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
      apple_signed_date:
        payload.signedDate ?? renewal?.signedDate ?? tx.signedDate ?? Date.now(),
      apple_notification_type: payload.notificationType,
      apple_notification_subtype: payload.subtype ?? null,
      apple_verification_source: 'app_store_server_api',
    },
  };

  if (existing && !shouldProjectIncoming({ current: existing, incoming: incomingWithSignedDate })) {
    return { ok: true };
  }

  const upsertPayload = {
    user_id: existing?.user_id ?? canonical.provider_customer_id,
    ...incomingWithSignedDate,
  };

  const { error: upsertError } = await admin.from('public.subscriptions').upsert(upsertPayload, {
    onConflict: 'provider,provider_subscription_id',
  });

  if (upsertError) {
    return { ok: false, error: 'subscription_upsert_failed' };
  }

  return { ok: true };
}

function applyRenewalHints(
  renewal: AppleRenewalInfo | null,
  payload: NotificationPayload,
): AppleRenewalInfo | null {
  if (!renewal) return null;

  const next: AppleRenewalInfo = { ...renewal };

  if (payload.notificationType === 'DID_CHANGE_RENEWAL_STATUS') {
    if (payload.subtype === 'AUTO_RENEW_DISABLED') {
      next.autoRenewStatus = 0;
    }
    if (payload.subtype === 'AUTO_RENEW_ENABLED') {
      next.autoRenewStatus = 1;
    }
  }

  if (payload.notificationType === 'DID_FAIL_TO_RENEW') {
    next.isInBillingRetryPeriod = true;
  }

  return next;
}

function tryExtractTransactionId(signedTransactionInfo: string): string | null {
  try {
    const tx = decodeJWSPayload<Record<string, unknown>>(
      signedTransactionInfo,
      'invalid_signed_transaction_info',
    );
    return typeof tx.transactionId === 'string' ? tx.transactionId : null;
  } catch {
    return null;
  }
}

function normalizeEnvironment(
  value?: string,
): 'Sandbox' | 'Production' | 'Xcode' | undefined {
  if (value === 'Sandbox' || value === 'Production' || value === 'Xcode') {
    return value;
  }
  return undefined;
}

async function markProcessed(
  admin: ReturnType<typeof createClient>,
  eventId: number,
  originalTransactionId: string | null,
  transactionId: string | null,
  signedDate?: number,
): Promise<void> {
  await admin
    .from('apple_iap_events')
    .update({
      processed_at: new Date().toISOString(),
      original_transaction_id: originalTransactionId,
      transaction_id: transactionId,
      signed_date: signedDate ? new Date(signedDate).toISOString() : null,
    })
    .eq('id', eventId);
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