import type { SubscriptionRow } from "./types";

export interface UpsertSubscriptionInput {
  user_id: string;
  provider: "stripe" | "apple" | "google";
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  provider_transaction_id?: string | null;
  provider_original_transaction_id?: string | null;
  product_id?: string | null;
  environment?: "sandbox" | "production" | null;
  status: SubscriptionRow["status"];
  current_period_start?: string | null;
  current_period_end: string | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: string | null;
  ended_at?: string | null;
  raw_payload?: unknown;
}

export interface EntitlementEventInput {
  provider: "stripe" | "apple" | "google";
  event_type: string;
  event_id: string;
  user_id?: string | null;
  payload: unknown;
}

export type SharedSubscriptionStatus = SubscriptionRow["status"];

export interface SharedSubscriptionRecord {
  user_id: string;
  provider: "stripe" | "apple" | "google";
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  provider_transaction_id?: string | null;
  provider_original_transaction_id?: string | null;
  product_id?: string | null;
  environment?: "sandbox" | "production" | null;
  status: SharedSubscriptionStatus;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: string | null;
  ended_at?: string | null;
  raw_payload?: unknown;
}

export interface EntitlementSnapshot {
  status: "active" | "inactive";
  expires_at: string | null;
  source: SharedSubscriptionRecord["provider"] | null;
}

type SupabaseLike = {
  from: (table: string) => {
    select: (columns: string) => any;
    insert: (
      values: unknown,
    ) => Promise<{ data?: unknown; error?: { message: string } | null }>;
    upsert: (
      values: unknown,
      options?: { onConflict?: string },
    ) => Promise<{ data?: unknown; error?: { message: string } | null }>;
  };
};

async function getSupabase(): Promise<SupabaseLike> {
  const dynamicImport = Function("path", "return import(path)") as (
    path: string,
  ) => Promise<unknown>;

  const mod = await dynamicImport("@/integrations/supabase/client");

  return (mod as { supabase: unknown }).supabase as SupabaseLike;
}

function toMillis(value: string | null | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
}

function isEntitlingSubscription(
  subscription: Pick<SharedSubscriptionRecord, "status" | "current_period_end">,
): boolean {
  const status = subscription.status;
  const endMs = toMillis(subscription.current_period_end ?? null);
  const now = Date.now();

  if (
    status === "active" ||
    status === "trialing" ||
    status === "past_due"
  ) {
    return true;
  }

  if (status === "canceled" && endMs > now) {
    return true;
  }

  return false;
}

export function deriveEntitlementFromSubscriptions(
  subscriptions: Array<
    Pick<SharedSubscriptionRecord, "status" | "current_period_end" | "provider">
  >,
): EntitlementSnapshot {
  let winner:
    | Pick<
        SharedSubscriptionRecord,
        "status" | "current_period_end" | "provider"
      >
    | null = null;

  for (const subscription of subscriptions) {
    if (!isEntitlingSubscription(subscription)) continue;

    if (
      !winner ||
      toMillis(subscription.current_period_end ?? null) >
        toMillis(winner.current_period_end ?? null)
    ) {
      winner = subscription;
    }
  }

  if (!winner) {
    return {
      status: "inactive",
      expires_at: null,
      source: null,
    };
  }

  return {
    status: "active",
    expires_at: winner.current_period_end ?? null,
    source: winner.provider,
  };
}

export async function getSubscriptionsByUserId(
  userId: string,
): Promise<SubscriptionRow[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "user_id, provider, status, current_period_end, cancel_at_period_end, ended_at",
    )
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to load subscriptions: ${error.message}`);
  }

  return (data ?? []) as SubscriptionRow[];
}

export async function hasProcessedEvent(
  provider: "stripe" | "apple" | "google",
  eventId: string,
): Promise<boolean> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("entitlement_events")
    .select("id")
    .eq("provider", provider)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed checking event idempotency: ${error.message}`);
  }

  return !!data;
}

export async function insertEntitlementEvent(
  input: EntitlementEventInput,
): Promise<void> {
  const supabase = await getSupabase();

  const { error } = await supabase.from("entitlement_events").insert({
    provider: input.provider,
    event_type: input.event_type,
    event_id: input.event_id,
    user_id: input.user_id ?? null,
    payload: input.payload,
  });

  if (error) {
    throw new Error(`Failed to insert entitlement event: ${error.message}`);
  }
}

export async function upsertSubscription(
  input: UpsertSubscriptionInput,
): Promise<void> {
  const supabase = await getSupabase();

  const row = {
    user_id: input.user_id,
    provider: input.provider,
    provider_customer_id: input.provider_customer_id ?? null,
    provider_subscription_id: input.provider_subscription_id ?? null,
    provider_transaction_id: input.provider_transaction_id ?? null,
    provider_original_transaction_id:
      input.provider_original_transaction_id ?? null,
    product_id: input.product_id ?? null,
    environment: input.environment ?? null,
    status: input.status,
    current_period_start: input.current_period_start ?? null,
    current_period_end: input.current_period_end,
    cancel_at_period_end: input.cancel_at_period_end ?? false,
    canceled_at: input.canceled_at ?? null,
    ended_at: input.ended_at ?? null,
    raw_payload: input.raw_payload ?? null,
  };

  const onConflict =
    input.provider_subscription_id != null
      ? "provider,provider_subscription_id"
      : "provider,provider_transaction_id";

  const { error } = await supabase
    .from("subscriptions")
    .upsert(row, { onConflict });

  if (error) {
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }
}