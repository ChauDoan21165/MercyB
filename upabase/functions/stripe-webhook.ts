// supabase/functions/stripe-webhook.ts

import Stripe from "stripe";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROVIDER = "stripe";
const APP_ENVIRONMENT = "production";

const stripe = new Stripe(mustGetEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  getEnv("PROJECT_SUPABASE_URL") ||
    getEnv("SUPABASE_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_URL") ||
    mustGetEnv("PROJECT_SUPABASE_URL"),
  getEnv("PROJECT_SUPABASE_SERVICE_ROLE_KEY") ||
    getEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    mustGetEnv("PROJECT_SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type CanonicalSubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked";

type SubscriptionRow = {
  user_id: string;
  provider: "stripe";
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  provider_transaction_id: string | null;
  provider_original_transaction_id: string | null;
  product_id: string | null;
  environment: "production" | "sandbox";
  status: CanonicalSubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
  raw_payload: Record<string, unknown>;
  updated_at?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return json({ error: "Missing stripe-signature header" }, 400);
  }

  let event: Stripe.Event;
  let rawBody = "";

  try {
    rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      mustGetEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return json({ error: "Invalid signature" }, 400);
  }

  try {
    const alreadyProcessed = await isEventProcessed(event.id);
    if (alreadyProcessed) {
      console.log("[stripe-webhook] duplicate event ignored:", event.id, event.type);
      return json({ ok: true, duplicate: true });
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.paid":
      case "invoice.payment_failed": {
        const subscriptionId = getSubscriptionId(event);

        if (!subscriptionId) {
          await recordEntitlementEvent({
            provider: PROVIDER,
            event_id: event.id,
            event_type: event.type,
            user_id: null,
            payload: safeJsonParse(rawBody),
          });

          return json({ ok: true, ignored: true, reason: "no_subscription_id" });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items.data.price.product"],
        });

        const userId = await resolveProfileUserId(event, subscription);
        if (!userId) {
          throw new Error(
            `[stripe-webhook] cannot resolve profiles.id for subscription ${subscription.id}`,
          );
        }

        const row = buildSubscriptionRow(userId, subscription);
        await upsertSubscription(row);

        await recordEntitlementEvent({
          provider: PROVIDER,
          event_id: event.id,
          event_type: event.type,
          user_id: userId,
          payload: safeJsonParse(rawBody),
        });

        break;
      }

      default: {
        await recordEntitlementEvent({
          provider: PROVIDER,
          event_id: event.id,
          event_type: event.type,
          user_id: null,
          payload: safeJsonParse(rawBody),
        });

        console.log("[stripe-webhook] ignoring event type:", event.type);
        break;
      }
    }

    return json({ ok: true });
  } catch (err) {
    console.error("[stripe-webhook] unhandled error:", err);
    return json({ error: "Webhook error" }, 500);
  }
});

function getEnv(name: string): string | undefined {
  try {
    const value = Deno.env.get(name);
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  } catch {
    return undefined;
  }
}

function mustGetEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeJsonParse(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : { raw };
  } catch {
    return { raw };
  }
}

function toIsoOrNull(unixSeconds: number | null | undefined): string | null {
  if (typeof unixSeconds !== "number" || !Number.isFinite(unixSeconds)) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

function normalizeStripeStatus(
  status: Stripe.Subscription.Status | null | undefined,
): CanonicalSubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "paused":
      return "paused";
    case "canceled":
      return "expired";
    case "unpaid":
      return "revoked";
    case "incomplete":
      return "grace_period";
    case "incomplete_expired":
      return "expired";
    default:
      return "expired";
  }
}

function getSubscriptionId(event: Stripe.Event): string | null {
  const obj = event.data.object as Record<string, unknown>;

  const directSub = asNonEmptyString(obj?.subscription);
  if (directSub?.startsWith("sub_")) return directSub;

  const objectId = asNonEmptyString(obj?.id);
  if (objectId?.startsWith("sub_")) return objectId;

  return null;
}

async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("entitlement_events")
    .select("id")
    .eq("provider", PROVIDER)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `[stripe-webhook] failed to check entitlement_events idempotency: ${error.message}`,
    );
  }

  return Boolean(data?.id);
}

async function recordEntitlementEvent(params: {
  provider: "stripe";
  event_id: string;
  event_type: string;
  user_id: string | null;
  payload: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase.from("entitlement_events").insert({
    provider: params.provider,
    event_id: params.event_id,
    event_type: params.event_type,
    user_id: params.user_id,
    payload: params.payload,
  });

  if (!error) return;

  const msg = String(error.message || "");
  const duplicate =
    msg.includes("duplicate") || msg.includes("unique") || msg.includes("already");

  if (duplicate) {
    console.warn(
      "[stripe-webhook] entitlement_events duplicate ignored:",
      params.event_id,
    );
    return;
  }

  throw new Error(
    `[stripe-webhook] failed to write entitlement_events row: ${error.message}`,
  );
}

async function resolveProfileUserId(
  event: Stripe.Event,
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const subscriptionMetaUserId =
    asNonEmptyString(subscription.metadata?.supabase_user_id) ||
    asNonEmptyString(subscription.metadata?.user_id);

  if (subscriptionMetaUserId) return subscriptionMetaUserId;

  const obj = event.data.object as Record<string, any>;
  const eventMetaUserId =
    asNonEmptyString(obj?.metadata?.supabase_user_id) ||
    asNonEmptyString(obj?.metadata?.user_id);

  if (eventMetaUserId) return eventMetaUserId;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  if (customerId) {
    const { data: subRow, error: subError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("provider", PROVIDER)
      .eq("provider_customer_id", customerId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subError && subRow?.user_id) {
      return String(subRow.user_id);
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (!profileError && profileRow?.id) {
      return String(profileRow.id);
    }
  }

  return null;
}

function buildSubscriptionRow(
  userId: string,
  subscription: Stripe.Subscription,
): SubscriptionRow {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  const firstItem = subscription.items.data[0];
  const price = firstItem?.price;
  const productId =
    typeof price?.product === "string"
      ? price.product
      : price?.product?.id ?? null;

  const currentPeriodStart = toIsoOrNull(
    (subscription as Stripe.Subscription & {
      current_period_start?: number;
    }).current_period_start,
  );

  const currentPeriodEnd = toIsoOrNull(
    (subscription as Stripe.Subscription & {
      current_period_end?: number;
    }).current_period_end,
  );

  const canceledAt = toIsoOrNull(subscription.canceled_at ?? undefined);
  const endedAt = toIsoOrNull(subscription.ended_at ?? undefined);

  return {
    user_id: userId,
    provider: PROVIDER,
    provider_customer_id: customerId,
    provider_subscription_id: subscription.id,
    provider_transaction_id: null,
    provider_original_transaction_id: null,
    product_id: productId,
    environment: APP_ENVIRONMENT,
    status: normalizeStripeStatus(subscription.status),
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    canceled_at: canceledAt,
    ended_at: endedAt,
    raw_payload: subscription as unknown as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  };
}

async function upsertSubscription(row: SubscriptionRow): Promise<void> {
  const { error } = await supabase.from("subscriptions").upsert(row, {
    onConflict: "provider,provider_subscription_id",
  });

  if (error) {
    throw new Error(
      `[stripe-webhook] failed to upsert canonical subscription row: ${error.message}`,
    );
  }

  const profilePatch = deriveProfilePremiumPatch(row);

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profilePatch)
    .eq("id", row.user_id);

  if (profileError) {
    throw new Error(
      `[stripe-webhook] failed to sync derived profile premium fields: ${profileError.message}`,
    );
  }

  if (row.provider === "stripe" && row.provider_customer_id) {
    const { error: stripeCustomerError } = await supabase
      .from("profiles")
      .update({
        stripe_customer_id: row.provider_customer_id,
      })
      .eq("id", row.user_id);

    if (stripeCustomerError) {
      throw new Error(
        `[stripe-webhook] failed to sync profiles.stripe_customer_id: ${stripeCustomerError.message}`,
      );
    }
  }
}

function deriveProfilePremiumPatch(row: SubscriptionRow): {
  premium_status: "active" | "inactive";
  premium_expires_at: string | null;
  premium_source: "stripe" | null;
} {
  const activeStatuses = new Set<CanonicalSubscriptionStatus>([
    "active",
    "trialing",
    "grace_period",
    "past_due",
  ]);

  const isPremium = activeStatuses.has(row.status);

  return {
    premium_status: isPremium ? "active" : "inactive",
    premium_expires_at: isPremium ? row.current_period_end : null,
    premium_source: isPremium ? "stripe" : null,
  };
}