/**
 * File: supabase/functions/apple-iap-sync/index.ts
 * Description: Hardened Apple IAP Sync Engine with Ironclad Financial Interlock.
 * Features: 
 * 1. SHA-256 Event Deduplication (Audit Trail)
 * 2. Environment Auto-Router (Production vs Sandbox Root Store)
 * 3. 1:1 Account Lockdown (Anti-Sharing Fraud)
 * 4. VND/CAD Settlement Logging (Canadian Tax Compliance)
 * 5. VIP 1-9 Escalation Trigger
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyTransactionWithApple } from '../_shared/apple-api.ts';
import { 
  mapProductToVipLevel, 
  mapAppleToCanonical, 
  shouldProjectIncoming 
} from '../_shared/apple-billing.ts';

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
    return json({ ok: false, error: 'method_not_allowed' }, 405);
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
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  try {
    const body = await req.json();
    const { signedTransactionInfo, transactionId } = body;

    if (!signedTransactionInfo && !transactionId) {
      return json({ ok: false, error: 'signedTransactionInfo_or_transactionId_required' }, 400);
    }

    // 3. AUDIT TRAIL: Deduplication via SHA-256
    const dedupeKey = await sha256Hex(signedTransactionInfo ?? `transaction:${transactionId}`);
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

    // Handle duplicate processing
    if (eventError && isUniqueViolation(eventError)) {
      return json({ ok: true, entitlement_refresh_required: true }, 200);
    }
    if (eventError) return json({ ok: false, error: 'event_insert_failed' }, 500);

    // 4. HARDENING: Production/Sandbox Auto-Router
    const transaction = await verifyTransactionWithApple({
      signedTransactionInfo,
      transactionId,
      environmentHint: body.environmentHint
    });

    // 5. HARDENING: The 'One-ID' Lockdown (Anti-Fraud)
    const { data: existingOwnership } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('provider', 'apple')
      .eq('provider_subscription_id', transaction.originalTransactionId)
      .maybeSingle();

    if (existingOwnership && existingOwnership.user_id !== user.id) {
      console.error(`[SECURITY] Account Sharing Blocked: User ${user.id} tried to claim Apple ID ${transaction.originalTransactionId}`);
      return json({ ok: false, error: 'forbidden_account_sharing' }, 403);
    }

    // 6. HARDENING: Currency & Settlement Logging (Tax Compliance)
    const canonical = mapAppleToCanonical({
      transaction,
      raw: {
        currency: transaction.currency, // Capture VND or CAD
        price: transaction.price,
        environment: transaction.environment
      }
    });

    // 7. HARDENING: VIP 1-9 Escalation
    const vipLevel = mapProductToVipLevel(transaction.productId);

    // Atomic Sync: Transaction Log + VIP Tier Update + Content Access Mask
    const { error: syncError } = await admin.rpc('ironclad_sync_v1', {
      target_user_id: user.id,
      target_vip_level: vipLevel,
      sub_payload: canonical,
      settlement_data: {
        amount: transaction.price,
        currency: transaction.currency,
        env: transaction.environment,
        original_tx_id: transaction.originalTransactionId
      }
    });

    if (syncError) throw syncError;

    // 8. Finalize Audit Trail
    await admin
      .from('apple_iap_events')
      .update({
        processed_at: new Date().toISOString(),
        original_transaction_id: transaction.originalTransactionId,
        transaction_id: transaction.transactionId,
        signed_date: transaction.signedDate ? new Date(transaction.signedDate).toISOString() : null,
      })
      .eq('id', insertedEvent.id);

    return json({
      ok: true,
      vip_level: vipLevel,
      subscription: {
        status: canonical.status,
        provider_price_id: canonical.provider_price_id,
        current_period_end: canonical.current_period_end
      }
    }, 200);

  } catch (error) {
    console.error('[IRONCLAD-ERROR]', error instanceof Error ? error.message : error);
    return json({ ok: false, error: 'verification_failed' }, 400);
  }
});

/**
 * UTILS
 */
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isUniqueViolation(error: any): boolean {
  return error.code === '23505';
}

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders }
  });
}