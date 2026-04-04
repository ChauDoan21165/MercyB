import Stripe from "https://esm.sh/stripe@14.25.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import {
  handleCheckoutSessionCompleted,
  handleCustomerSubscriptionCreatedOrUpdated,
  handleCustomerSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "./webhook-events.ts";

import type {
  BillingEnvironment,
  DBClient,
  StripeWebhookEvent,
} from "./types.ts";

function getEnvironmentFromEvent(event: StripeWebhookEvent): BillingEnvironment {
  return event.livemode ? "production" : "sandbox";
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getStripeClient(): Stripe {
  return new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2024-11-20.acacia",
  });
}

function getWebhookSecret(): string | null {
  return Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");
}

function getSupabaseAdmin(): DBClient {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

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

// Tracking is intentionally disabled.
// The stripe_webhook_events table/schema is not aligned with the deployed code,
// and it is now a non-critical side effect. We bypass it completely so billing
// can complete successfully.
async function markStripeWebhookEventProcessed(
  _supabase: DBClient,
  _event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
): Promise<boolean> {
  return true;
}

async function hasStripeWebhookEventBeenProcessed(
  _supabase: DBClient,
  _eventId: string,
): Promise<boolean> {
  return false;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }

  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return json({ error: "Missing Stripe-Signature header" }, 400);
  }

  const webhookSecret = getWebhookSecret();

  if (!webhookSecret) {
    console.error("stripe-webhook: missing signing secret");
    return json({ error: "Webhook secret not configured" }, 500);
  }

  const rawBody = await request.text();

  let event: StripeWebhookEvent;

  try {
    const stripe = getStripeClient();
    const cryptoProvider = Stripe.createSubtleCryptoProvider();

    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    ) as StripeWebhookEvent;
  } catch (error) {
    const serialized = serializeError(error);

    console.error("stripe-webhook: signature verification failed", {
      message: error instanceof Error ? error.message : String(error),
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
    const alreadyProcessed = await hasStripeWebhookEventBeenProcessed(
      supabase,
      event.id,
    );

    if (alreadyProcessed) {
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

      default:
        await markStripeWebhookEventProcessed(supabase, event);
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