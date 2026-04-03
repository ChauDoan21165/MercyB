// supabase/functions/stripe-webhook.ts

import Stripe from "stripe";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_ID = "mercy_blade";

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
  }
);

type StripeStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | "inactive"
  | "revoked"
  | "expired"
  | "grace_period";

type SubscriptionRow = {
  id?: string;
  provider: "stripe";
  app_id: string;
  user_id: string;
  customer_id: string | null;
  subscription_id: string;
  price_id: string | null;
  status: StripeStatus;
  source: "stripe";
  current_period_start: string | null;
  current_period_end: string | null;
  expires_at: string | null;
  cancel_at_period_end: boolean;
  created_at?: string;
  updated_at?: string;
};

type StripeEventRow = {
  id?: string;
  event_id: string;
  event_type: string;
  processed_at?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return json({ error: "Missing stripe-signature header" }, 400);
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      mustGetEnv("STRIPE_WEBHOOK_SECRET")
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
          console.warn(
            `[stripe-webhook] no subscription id for event ${event.type}`,
            event.id
          );

          await markEventProcessed({
            event_id: event.id,
            event_type: event.type,
          });

          return json({ ok: true, ignored: true });
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items.data.price"],
        });

        const userId = await resolveUserId(event, sub);

        if (!userId) {
          throw new Error(
            `[stripe-webhook] cannot resolve user for subscription ${sub.id}`
          );
        }

        const row = buildSubscriptionRow(userId, sub);
        await upsertSubscription(row);

        await markEventProcessed({
          event_id: event.id,
          event_type: event.type,
        });

        break;
      }

      default: {
        console.log("[stripe-webhook] ignoring event type:", event.type);

        await markEventProcessed({
          event_id: event.id,
          event_type: event.type,
        });

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

function toIsoOrNull(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Date(value * 1000).toISOString();
}

function normalizeStatus(status: string | null | undefined): StripeStatus {
  switch (status) {
    case "trialing":
    case "active":
    case "past_due":
    case "canceled":
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return status;
    default:
      return "inactive";
  }
}

function getSubscriptionId(event: Stripe.Event): string | null {
  const obj = event.data.object as any;

  if (typeof obj?.subscription === "string" && obj.subscription.startsWith("sub_")) {
    return obj.subscription;
  }

  if (typeof obj?.id === "string" && obj.id.startsWith("sub_")) {
    return obj.id;
  }

  return null;
}

async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `[stripe-webhook] failed to check processed event: ${error.message}`
    );
  }

  return Boolean(data?.id);
}

async function markEventProcessed(row: StripeEventRow): Promise<void> {
  const { error } = await supabase.from("stripe_events").insert({
    event_id: row.event_id,
    event_type: row.event_type,
    processed_at: new Date().toISOString(),
  });

  if (error) {
    const message = String(error.message || "");
    const isDuplicate =
      message.includes("duplicate key") ||
      message.includes("unique") ||
      message.includes("already exists");

    if (isDuplicate) {
      console.warn(
        "[stripe-webhook] stripe_events duplicate insert ignored:",
        row.event_id
      );
      return;
    }

    throw new Error(
      `[stripe-webhook] failed to mark event processed: ${error.message}`
    );
  }
}

async function resolveUserId(
  event: Stripe.Event,
  sub: Stripe.Subscription
): Promise<string | null> {
  const fromSubscriptionMeta =
    asNonEmptyString(sub.metadata?.supabase_user_id) ||
    asNonEmptyString(sub.metadata?.user_id);

  if (fromSubscriptionMeta) return fromSubscriptionMeta;

  const obj = event.data.object as any;

  const fromEventMeta =
    asNonEmptyString(obj?.metadata?.supabase_user_id) ||
    asNonEmptyString(obj?.metadata?.user_id);

  if (fromEventMeta) return fromEventMeta;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

  if (customerId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("provider", "stripe")
      .eq("app_id", APP_ID)
      .eq("customer_id", customerId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[stripe-webhook] resolve user by customer_id failed:", error);
    } else if (data?.user_id) {
      return String(data.user_id);
    }
  }

  return null;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function buildSubscriptionRow(
  userId: string,
  sub: Stripe.Subscription
): SubscriptionRow {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

  const priceId = sub.items.data[0]?.price?.id ?? null;
  const currentPeriodStart = toIsoOrNull((sub as any).current_period_start);
  const currentPeriodEnd = toIsoOrNull((sub as any).current_period_end);
  const status = normalizeStatus(sub.status);

  return {
    provider: "stripe",
    app_id: APP_ID,
    user_id: userId,
    customer_id: customerId,
    subscription_id: sub.id,
    price_id: priceId,
    status,
    source: "stripe",
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    expires_at: currentPeriodEnd,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
  };
}

async function upsertSubscription(row: SubscriptionRow): Promise<void> {
  const { data: existingRows, error: fetchError } = await supabase
    .from("subscriptions")
    .select("id, subscription_id, status, created_at")
    .eq("provider", "stripe")
    .eq("app_id", APP_ID)
    .eq("user_id", row.user_id)
    .order("created_at", { ascending: false });

  if (fetchError) {
    throw new Error(
      `[stripe-webhook] failed to load existing subscriptions: ${fetchError.message}`
    );
  }

  const rows = Array.isArray(existingRows) ? existingRows : [];

  const exactMatch = rows.find((r) => r.subscription_id === row.subscription_id);
  const canonicalRow = exactMatch ?? rows[0] ?? null;

  if (canonicalRow?.id) {
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        provider: row.provider,
        app_id: row.app_id,
        user_id: row.user_id,
        customer_id: row.customer_id,
        subscription_id: row.subscription_id,
        price_id: row.price_id,
        status: row.status,
        source: row.source,
        current_period_start: row.current_period_start,
        current_period_end: row.current_period_end,
        expires_at: row.expires_at,
        cancel_at_period_end: row.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("id", canonicalRow.id);

    if (updateError) {
      throw new Error(
        `[stripe-webhook] failed to update canonical subscription row: ${updateError.message}`
      );
    }
  } else {
    const { error: insertError } = await supabase.from("subscriptions").insert({
      provider: row.provider,
      app_id: row.app_id,
      user_id: row.user_id,
      customer_id: row.customer_id,
      subscription_id: row.subscription_id,
      price_id: row.price_id,
      status: row.status,
      source: row.source,
      current_period_start: row.current_period_start,
      current_period_end: row.current_period_end,
      expires_at: row.expires_at,
      cancel_at_period_end: row.cancel_at_period_end,
    });

    if (insertError) {
      throw new Error(
        `[stripe-webhook] failed to insert subscription row: ${insertError.message}`
      );
    }
  }

  const duplicateIds = rows
    .filter((r) => r.id && r.id !== canonicalRow?.id)
    .map((r) => r.id);

  if (duplicateIds.length > 0) {
    const { error: dedupeError } = await supabase
      .from("subscriptions")
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .in("id", duplicateIds);

    if (dedupeError) {
      throw new Error(
        `[stripe-webhook] failed to inactivate duplicate rows: ${dedupeError.message}`
      );
    }
  }
}