// supabase/functions/stripe-webhook/index.ts
// deno-lint-ignore-file no-import-prefix

import {
  createClient,
} from "https://esm.sh/@supabase/supabase-js@2.39.3";

import {
  decodeJwtPayload,
  getServiceRoleKey,
  getStripeWebhookSecrets,
  getSupabaseUrl,
  json,
  logWebhook,
  NonRetryableWebhookError,
  ok200,
  stripeEnvironmentFromEvent,
  isoNow,
} from "./core.ts";
import { verifyStripeSignatureOrThrow } from "./stripe-signature.ts";
import type {
  Database,
  DBClient,
  StripeWebhookEvent,
  SupportedEventType,
} from "./types.ts";
import { hasProcessedEntitlementEvent } from "./billing.ts";
import {
  handleCheckoutSessionCompleted,
  handleCustomerSubscriptionCreatedOrUpdated,
  handleCustomerSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "./webhook-events.ts";

/* ============================================================================
 * Stripe event helpers
 * ========================================================================== */

function isSupportedEventType(value: string): value is SupportedEventType {
  return (
    value === "checkout.session.completed" ||
    value === "invoice.paid" ||
    value === "invoice.payment_failed" ||
    value === "customer.subscription.created" ||
    value === "customer.subscription.updated" ||
    value === "customer.subscription.deleted"
  );
}

/* ============================================================================
 * Webhook idempotency helpers
 * ========================================================================== */

function isMissingStripeWebhookEventsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybe = error as { code?: string; message?: unknown };

  return (
    maybe.code === "PGRST205" &&
    String(maybe.message ?? "").includes("public.stripe_webhook_events")
  );
}

async function hasProcessedStripeWebhookEvent(
  supabase: DBClient,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .select("event_id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    if (isMissingStripeWebhookEventsTable(error)) {
      console.warn(
        "stripe-webhook stripe_webhook_events table missing; skipping replay short-circuit",
        error,
      );
      return false;
    }

    throw error;
  }

  return !!data?.event_id;
}

async function upsertStripeWebhookEventResult(params: {
  supabase: DBClient;
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">;
  processed: boolean;
  errorMessage?: string | null;
}): Promise<boolean> {
  const payload: Database["public"]["Tables"]["stripe_webhook_events"]["Insert"] = {
    event_id: params.event.id,
    type: params.event.type,
    livemode: typeof params.event.livemode === "boolean"
      ? params.event.livemode
      : null,
    processed_at: params.processed ? isoNow() : null,
    error: params.errorMessage ?? null,
  };

  const { error } = await params.supabase
    .from("stripe_webhook_events")
    .upsert(payload, { onConflict: "event_id" });

  if (!error) return true;

  if (isMissingStripeWebhookEventsTable(error)) {
    console.warn(
      "stripe-webhook stripe_webhook_events table missing; skipping result mark",
      error,
    );
    return true;
  }

  logWebhook("error", "failed to upsert stripe webhook event result", {
    event_id: params.event.id,
    event_type: params.event.type,
    processed: params.processed,
    error_message: params.errorMessage ?? null,
    error,
  });

  throw error;
}

async function markStripeWebhookEventProcessed(
  supabase: DBClient,
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
): Promise<boolean> {
  return await upsertStripeWebhookEventResult({
    supabase,
    event,
    processed: true,
    errorMessage: null,
  });
}

/* ============================================================================
 * Request handler
 * ========================================================================== */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok200();

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const webhookSecrets = getStripeWebhookSecrets();
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getServiceRoleKey();

  const serviceKeyPayload = decodeJwtPayload(serviceKey);
  logWebhook("info", "runtime supabase target", {
    supabase_url: supabaseUrl || null,
    service_role_ref: serviceKeyPayload?.ref ?? null,
    service_role_role: serviceKeyPayload?.role ?? null,
  });

  if (!webhookSecrets.length) {
    return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  }

  if (!supabaseUrl || !serviceKey) {
    return json(
      {
        error:
          "Missing hosted Supabase config (PROJECT_SUPABASE_URL/VITE_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or PROJECT_SUPABASE_SERVICE_ROLE_KEY)",
      },
      500,
    );
  }

  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader) {
    return json({ error: "Missing signature" }, 400);
  }

  const rawBuf = await req.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuf);

  try {
    let verified = false;
    let lastError: unknown = null;

    for (const webhookSecret of webhookSecrets) {
      try {
        await verifyStripeSignatureOrThrow({
          rawBodyBytes: rawBytes,
          sigHeader: signatureHeader,
          webhookSecret,
        });
        verified = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!verified) {
      throw lastError ?? new Error("Stripe signature mismatch");
    }
  } catch (error) {
    logWebhook("warn", "invalid stripe signature", {
      details: error instanceof Error ? error.message : String(error),
    });
    return json({ error: "Invalid signature" }, 400);
  }

  let event: StripeWebhookEvent;

  try {
    const rawText = new TextDecoder().decode(rawBytes);
    event = JSON.parse(rawText) as StripeWebhookEvent;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!event?.id) {
    return json({ error: "Stripe event missing id" }, 400);
  }

  if (!isSupportedEventType(event.type)) {
    return ok200();
  }

  logWebhook("info", "received stripe webhook", {
    event_id: event.id,
    event_type: event.type,
    livemode: typeof event.livemode === "boolean" ? event.livemode : null,
  });

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const alreadyProcessedStripeWebhookEvent =
      await hasProcessedStripeWebhookEvent(
        supabase,
        event.id,
      );

    if (alreadyProcessedStripeWebhookEvent) {
      logWebhook("info", "stripe event replay skipped", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_replayed_event",
      });
      return ok200();
    }

    const alreadyProcessed = await hasProcessedEntitlementEvent(
      supabase,
      event.id,
    );

    if (alreadyProcessed) {
      logWebhook("info", "entitlement event already processed", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_already_processed",
      });
      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    const environment = stripeEnvironmentFromEvent(event);

    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted({
        supabase,
        event,
        environment,
        markStripeWebhookEventProcessed,
      });
      return ok200();
    }

    if (event.type === "invoice.paid") {
      await handleInvoicePaid({
        supabase,
        event,
        environment,
        markStripeWebhookEventProcessed,
      });
      return ok200();
    }

    if (event.type === "invoice.payment_failed") {
      await handleInvoicePaymentFailed({
        supabase,
        event,
        environment,
        markStripeWebhookEventProcessed,
      });
      return ok200();
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      await handleCustomerSubscriptionCreatedOrUpdated({
        supabase,
        event,
        environment,
        markStripeWebhookEventProcessed,
      });
      return ok200();
    }

    if (event.type === "customer.subscription.deleted") {
      await handleCustomerSubscriptionDeleted({
        supabase,
        event,
        environment,
        markStripeWebhookEventProcessed,
      });
      return ok200();
    }

    await markStripeWebhookEventProcessed(supabase, event);
    return ok200();
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : typeof error === "object" && error !== null
          ? JSON.parse(JSON.stringify(error))
          : { message: String(error) };

    logWebhook("error", "webhook processing failed", {
      event_id: event?.id ?? null,
      event_type: event?.type ?? null,
      details,
    });

    try {
      await upsertStripeWebhookEventResult({
        supabase,
        event,
        processed: error instanceof NonRetryableWebhookError,
        errorMessage: error instanceof Error
          ? error.message
          : String(error ?? "unknown error"),
      });
    } catch {
      // best-effort only
    }

    if (error instanceof NonRetryableWebhookError) {
      return ok200();
    }

    return json({ error: "Webhook processing failed" }, 500);
  }
});
