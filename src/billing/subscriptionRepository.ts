import type {
  BillingEnvironment,
  BillingProvider,
  SharedSubscriptionStatus,
  SubscriptionRow,
} from "./types";

export interface UpsertSubscriptionInput {
  user_id: string;
  provider: BillingProvider;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;

  /**
   * Provider-scoped identifier for the concrete billing transaction/update
   * represented by this row version.
   *
   * Examples:
   * - Stripe: invoice id or checkout session id when available
   * - Apple: current transaction id
   * - Google: concrete purchase / renewal transaction identifier
   */
  provider_transaction_id?: string | null;

  /**
   * Provider-scoped stable chain/root identifier across renewals.
   *
   * Examples:
   * - Stripe: subscription id
   * - Apple: original transaction id
   * - Google: original purchase token / stable subscription root identifier
   */
  provider_original_transaction_id?: string | null;

  product_id?: string | null;
  environment?: BillingEnvironment | null;
  status: SharedSubscriptionStatus;
  current_period_start?: string | null;
  current_period_end: string | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: string | null;
  ended_at?: string | null;
  raw_payload?: unknown;
}

export interface EntitlementEventInput {
  provider: BillingProvider;
  event_type: string;
  event_id: string;
  user_id?: string | null;
  payload: unknown;
}

export interface EntitlementSnapshot {
  status: "active" | "inactive";
  expires_at: string | null;
  source: SubscriptionRow["provider"] | null;
}

export type SupabaseLike = {
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
  subscription: Pick<SubscriptionRow, "status" | "current_period_end">,
): boolean {
  const status = subscription.status;

  if (
    status === "active" ||
    status === "trialing" ||
    status === "grace_period" ||
    status === "past_due"
  ) {
    return true;
  }

  return false;
}

export function deriveEntitlementFromSubscriptions(
  subscriptions: Array<
    Pick<SubscriptionRow, "status" | "current_period_end" | "provider">
  >,
): EntitlementSnapshot {
  let winner:
    | Pick<SubscriptionRow, "status" | "current_period_end" | "provider">
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

/**
 * Load subscriptions for a user.
 *
 * @param client Optional injected Supabase-like client. Defaults to the
 *   real browser singleton via `getSupabase()` — existing callers pass
 *   only `userId` and are unaffected (zero behavior change). The param
 *   exists purely as a test seam (same pattern as
 *   `recomputeAndPersistEntitlement.ts` line 30-45): the default path
 *   goes through `Function("path","return import(path)")(...)`, a
 *   runtime-constructed import that vitest's `vi.mock` cannot intercept,
 *   so injecting the client is the only way to unit-test the read path.
 */
export async function getSubscriptionsByUserId(
  userId: string,
  client?: SupabaseLike,
): Promise<SubscriptionRow[]> {
  const supabase = client ?? (await getSupabase());

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

/**
 * Idempotency check: has this provider+event_id already been recorded?
 *
 * @param client Optional injected Supabase-like client (test seam — see
 *   `getSubscriptionsByUserId` for the full rationale; same pattern).
 */
export async function hasProcessedEvent(
  provider: BillingProvider,
  eventId: string,
  client?: SupabaseLike,
): Promise<boolean> {
  const supabase = client ?? (await getSupabase());

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

/**
 * Record an entitlement event (idempotency-paired with hasProcessedEvent).
 *
 * @param client Optional injected Supabase-like client (test seam — see
 *   `getSubscriptionsByUserId` for the full rationale; same pattern).
 */
export async function insertEntitlementEvent(
  input: EntitlementEventInput,
  client?: SupabaseLike,
): Promise<void> {
  const supabase = client ?? (await getSupabase());

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

/**
 * Upsert a subscription row. Conflict resolution uses
 * `provider,provider_subscription_id` when subscription id is present;
 * otherwise falls back to `provider,provider_transaction_id`.
 *
 * @param client Optional injected Supabase-like client (test seam — see
 *   `getSubscriptionsByUserId` for the full rationale; same pattern).
 */
export async function upsertSubscription(
  input: UpsertSubscriptionInput,
  client?: SupabaseLike,
): Promise<void> {
  const supabase = client ?? (await getSupabase());

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