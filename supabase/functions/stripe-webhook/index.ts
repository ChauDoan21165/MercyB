// PATH: supabase/functions/stripe-webhook/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import {
  getServiceRoleKey,
  getStripeWebhookSecrets,
  getSupabaseUrl,
  isoNow,
  logWebhook,
} from "./core.ts";
import { isSupportedStripeWebhookEventType } from "./event-types.ts";
import { verifyStripeSignatureOrThrow } from "./stripe-signature.ts";
import {
  handleCheckoutSessionCompleted,
  handleCustomerSubscriptionCreatedOrUpdated,
  handleCustomerSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "./webhook-events.ts";
import {
  claimStripeWebhookEvent,
  isMissingStripeWebhookEventsTable,
  releaseStripeWebhookEventClaim,
} from "./idempotency.ts";
import { captureEdgeError } from "../_shared/sentry.ts";

// Sentry tag schema for billing-webhook observability (see PR).
// All values are low-cardinality + indexed so a future ops dashboard can
// facet by them. `webhook`/`billing` are deliberately provider-stable so
// the same dashboard works once revenuecat/apple webhooks are wired too.
const BILLING_WEBHOOK_TAGS = { webhook: "stripe", billing: "true" } as const;
// No Authorization header on Stripe deliveries (config.toml verify_jwt=false,
// Stripe sends none) — the paying user is inside the event payload, not a
// JWT, so we intentionally do not pass userId here.
async function captureBillingWebhookFailure(
  error: unknown,
  tags: { stage: string; severity: "critical" | "high"; event_type?: string },
): Promise<void> {
  // Awaited by callers BEFORE they return so the short-lived edge isolate
  // does not tear down before Sentry's internal flush (a fire-and-forget
  // capture is routinely lost on Supabase Edge). captureEdgeError never
  // throws (internally guarded) and is a zero-cost no-op when SENTRY_DSN
  // is unset, so the worst case is a ≤2s delay on an ALREADY-failing
  // response that Stripe will retry anyway. Observability only — it does
  // not alter the response body, status code, or the idempotency flow.
  await captureEdgeError(error, {
    functionName: "stripe-webhook",
    extra: { stage: tags.stage },
    tags: {
      ...BILLING_WEBHOOK_TAGS,
      stage: tags.stage,
      severity: tags.severity,
      event_type: tags.event_type ?? "unknown",
    },
  });
}

import type {
  BillingEnvironment,
  Database,
  DBClient,
  StripeWebhookEvent,
} from "./types.ts";

function getEnvironmentFromEvent(event: StripeWebhookEvent): BillingEnvironment {
  return event.livemode ? "production" : "sandbox";
}

function getOptionalEnv(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

function getRequiredSupabaseConfig(): {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
} {
  const supabaseUrl = getOptionalEnv("SUPABASE_URL") || getSupabaseUrl();
  const supabaseServiceRoleKey =
    getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY") || getServiceRoleKey();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing required Supabase config: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY or PROJECT_SUPABASE_URL/PROJECT_SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return { supabaseUrl, supabaseServiceRoleKey };
}

// Reads every supported env var name (STRIPE_WEBHOOK_SECRET,
// SECRET_STRIPE_WEBHOOK_SECRET, STRIPE_SIGNING_SECRET,
// STRIPE_WEBHOOK_SIGNING_SECRET) and parses comma/newline separated
// values, so a webhook with rotated secrets keeps verifying during cutover.
function getWebhookSecrets(): string[] {
  return getStripeWebhookSecrets();
}

function getSupabaseAdmin(): DBClient {
  const { supabaseUrl, supabaseServiceRoleKey } = getRequiredSupabaseConfig();

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
  ) as unknown as DBClient;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      type: "Error",
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    };
  }

  if (typeof error === "object" && error !== null) {
    try {
      return {
        type: "Object",
        ...JSON.parse(JSON.stringify(error)),
      };
    } catch {
      return {
        type: "Object",
        message: String(error),
      };
    }
  }

  return {
    type: typeof error,
    message: String(error),
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }

  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return json({ error: "Missing Stripe-Signature header" }, 400);
  }

  const webhookSecrets = getWebhookSecrets();

  if (webhookSecrets.length === 0) {
    console.error("stripe-webhook: missing signing secret");
    // CRITICAL: not a single failed event — the webhook cannot verify
    // ANY delivery, so every Stripe billing event is being rejected
    // until the secret env var is set. Must page, not sit in logs.
    await captureBillingWebhookFailure(
      new Error("stripe-webhook: missing signing secret (no STRIPE_WEBHOOK_SECRET configured)"),
      { stage: "config_missing_secret", severity: "critical" },
    );
    return json({ error: "Webhook secret not configured" }, 500);
  }

  const rawBodyBytes = new Uint8Array(await request.arrayBuffer());

  let verified = false;
  let event: StripeWebhookEvent | null = null;
  let lastVerificationError: unknown = null;

  for (const candidate of webhookSecrets) {
    try {
      await verifyStripeSignatureOrThrow({
        rawBodyBytes,
        sigHeader: signature,
        webhookSecret: candidate,
      });
      verified = true;
      lastVerificationError = null;
      break;
    } catch (error) {
      lastVerificationError = error;
    }
  }

  if (!verified) {
    const serialized = serializeError(lastVerificationError);

    console.error("stripe-webhook: signature verification failed", {
      attemptedSecrets: webhookSecrets.length,
      message: lastVerificationError instanceof Error
        ? lastVerificationError.message
        : String(lastVerificationError),
      error: serialized,
    });

    return json(
      {
        ok: false,
        stage: "signature_verification",
        error: serialized,
      },
      400,
    );
  }

  try {
    event = JSON.parse(new TextDecoder().decode(rawBodyBytes)) as StripeWebhookEvent;
  } catch (error) {
    const serialized = serializeError(error);

    // The signature ALREADY verified above, so this is a genuine
    // Stripe-signed delivery whose body we cannot parse — a real billing
    // event we are dropping (not scanner noise; that is filtered out at
    // the signature stage, which intentionally does NOT capture).
    await captureBillingWebhookFailure(error, {
      stage: "parse_event",
      severity: "high",
    });

    return json(
      {
        ok: false,
        stage: "parse_event",
        error: serialized,
      },
      400,
    );
  }

  if (!event?.id) {
    // Signature-verified but unusable (no event id) → same dropped-real-
    // event class as parse_event.
    await captureBillingWebhookFailure(
      new Error("stripe-webhook: signature-verified event missing id"),
      {
        stage: "missing_event_id",
        severity: "high",
        event_type: typeof event?.type === "string" ? event.type : undefined,
      },
    );
    return json({ ok: false, error: "Stripe event missing id" }, 400);
  }

  if (!isSupportedStripeWebhookEventType(event.type)) {
    return json(
      {
        ok: true,
        ignored: true,
        eventId: event.id,
        type: event.type,
      },
      200,
    );
  }

  let supabase: DBClient;
  let environment: BillingEnvironment;

  try {
    supabase = getSupabaseAdmin();
    environment = getEnvironmentFromEvent(event);
  } catch (error) {
    const serialized = serializeError(error);

    console.error("stripe-webhook: initialization failed", {
      eventId: event.id,
      eventType: event.type,
      message: error instanceof Error ? error.message : String(error),
      error: serialized,
    });

    // CRITICAL: Supabase admin client / env resolution failed — like the
    // missing-secret case this fails EVERY event, not one, until infra/
    // config is fixed. Returns 500 so Stripe retries.
    await captureBillingWebhookFailure(error, {
      stage: "initialization",
      severity: "critical",
      event_type: event.type,
    });

    return json(
      {
        ok: false,
        stage: "initialization",
        eventId: event.id,
        eventType: event.type,
        error: serialized,
      },
      500,
    );
  }

  try {
    // Atomically claim this event_id BEFORE any side-effect. Exactly one
    // concurrent delivery wins the insert; the rest see the conflict and
    // no-op. (Was a read-then-much-later-mark race — see RECON-stripe-
    // idempotency.md, audit N4.) `table-missing` keeps the prior fail-open
    // behavior: process without the guard rather than drop a real delivery.
    const claim = await claimStripeWebhookEvent(supabase, event);

    if (claim.status === "duplicate") {
      logWebhook("info", "stripe event replay skipped (idempotency claim)", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_duplicate_delivery",
      });
      return json({ ok: true, duplicate: true }, 200);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted({
          supabase,
          event,
          environment,
          markStripeWebhookEventProcessed,
        });
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleCustomerSubscriptionCreatedOrUpdated({
          supabase,
          event,
          environment,
          markStripeWebhookEventProcessed,
        });
        break;

      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted({
          supabase,
          event,
          environment,
          markStripeWebhookEventProcessed,
        });
        break;

      case "invoice.paid":
        await handleInvoicePaid({
          supabase,
          event,
          environment,
          markStripeWebhookEventProcessed,
        });
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed({
          supabase,
          event,
          environment,
          markStripeWebhookEventProcessed,
        });
        break;
    }

    return json({ ok: true, eventId: event.id, type: event.type }, 200);
  } catch (error) {
    const serialized = serializeError(error);

    console.error("stripe-webhook: handler failed", {
      eventType: event.type,
      eventId: event.id,
      message: error instanceof Error ? error.message : String(error),
      error: serialized,
    });

    // PRIMARY billing-observability capture: every throw from the event
    // handlers / billing.ts / idempotency.ts (a genuine DB error during
    // the claim is rethrown here) bubbles to this single catch with the
    // event type in scope, so one capture point covers the whole money
    // path. Returns 500 → Stripe retries; we do NOT capture the
    // best-effort claim-release failure below (secondary error on an
    // already-captured incident — would double-alert one failure).
    await captureBillingWebhookFailure(error, {
      stage: "processing",
      severity: "high",
      event_type: event.type,
    });

    // Option A (locked): release the claim so Stripe's redelivery can
    // re-claim and reprocess. The 500 below makes Stripe retry; leaving the
    // claim row in place would block that legitimate retry forever and
    // silently drop the event. We intentionally do NOT persist an error row
    // here — persisting it would re-block the retry; the failure is captured
    // in the logs above.
    try {
      await releaseStripeWebhookEventClaim(supabase, event.id);
    } catch {
      // best-effort only
    }

    return json(
      {
        ok: false,
        stage: "processing",
        eventId: event.id,
        eventType: event.type,
        error: serialized,
      },
      500,
    );
  }
});
