// File: supabase/functions/billing-stripe-change-plan/index.ts

// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "npm:stripe@12.18.0";
import type { Database } from "../_shared/database.types.ts";

const APP_ID = "mercy_blade";
const PROVIDER = "stripe";
const FUNCTION_VERSION = "canceled-fallback-v3";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ProfilesRow = {
  id: string;
  user_id: string | null;
  stripe_customer_id: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AppDatabase = {
  public: {
    Tables: Database["public"]["Tables"] & {
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesRow;
        Update: Partial<ProfilesRow>;
        Relationships: [];
      };
      subscription_tiers: {
        Row: Database["public"]["Tables"]["subscription_tiers"]["Row"] & {
          stripe_price_id: string | null;
          is_active?: boolean | null;
          name?: string | null;
        };
        Insert: Database["public"]["Tables"]["subscription_tiers"]["Insert"] & {
          stripe_price_id?: string | null;
        };
        Update: Database["public"]["Tables"]["subscription_tiers"]["Update"] & {
          stripe_price_id?: string | null;
        };
        Relationships:
          Database["public"]["Tables"]["subscription_tiers"]["Relationships"];
      };
      subscriptions: {
        Row: Database["public"]["Tables"]["subscriptions"]["Row"] & {
          subscription_id?: string | null;
          customer_id?: string | null;
          price_id?: string | null;
          status?: string | null;
          app_id?: string | null;
          provider?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          updated_at?: string | null;
        };
        Insert: Database["public"]["Tables"]["subscriptions"]["Insert"];
        Update: Database["public"]["Tables"]["subscriptions"]["Update"];
        Relationships:
          Database["public"]["Tables"]["subscriptions"]["Relationships"];
      };
    };
    Views: Database["public"]["Views"];
    Functions: Database["public"]["Functions"];
    Enums: Database["public"]["Enums"];
    CompositeTypes: Database["public"]["CompositeTypes"];
  };
};

type AdminClient = ReturnType<typeof createTypedClient>;
type SubscriptionTierRow =
  AppDatabase["public"]["Tables"]["subscription_tiers"]["Row"];
type CanonicalSubscriptionRow =
  AppDatabase["public"]["Tables"]["subscriptions"]["Row"];

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

function getSupabaseUrl(): string {
  return env("SUPABASE_URL").replace(/\/+$/, "");
}

function getAnonKey(): string {
  return env("SUPABASE_ANON_KEY");
}

function getServiceRoleKey(): string {
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

function createTypedClient(supabaseUrl: string, key: string) {
  return createClient<AppDatabase>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function asRecordOrNull(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBooleanOrNull(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function isFreeTier(tier: { name?: string | null }): boolean {
  return normalize(tier.name) === "free";
}

function isStripePriceId(value: string | null): value is string {
  return !!value && /^price_[A-Za-z0-9]+$/.test(value);
}

function isStripeCustomerId(value: string | null): value is string {
  return !!value && /^cus_[A-Za-z0-9]+$/.test(value);
}

function isValidHttpUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function errToObj(error: unknown): Record<string, unknown> {
  const record = asRecordOrNull(error);

  if (error instanceof Stripe.errors.StripeError) {
    return {
      type: error.type ?? error.name,
      message: error.message,
      code: error.code ?? null,
      param: error.param ?? null,
      statusCode: error.statusCode ?? null,
      requestId: error.requestId ?? null,
      decline_code: "decline_code" in error ? error.decline_code ?? null : null,
      ...(record ?? {}),
    };
  }

  if (error instanceof Error) {
    return {
      type: error.name,
      message: error.message,
      stack: error.stack ?? null,
      ...(record ?? {}),
    };
  }

  return {
    message: String(error),
    ...(record ?? {}),
  };
}

function getBearerToken(req: Request): string {
  const authHeader = req.headers.get("authorization") || "";
  return authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
}

function logInfo(message: string, data?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: "info",
      function_version: FUNCTION_VERSION,
      message,
      ...(data ?? {}),
    }),
  );
}

function logError(message: string, data?: Record<string, unknown>) {
  console.error(
    JSON.stringify({
      level: "error",
      function_version: FUNCTION_VERSION,
      message,
      ...(data ?? {}),
    }),
  );
}

function getStringField(
  body: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = asNonEmptyStringOrNull(body[key]);
    if (value) return value;
  }
  return null;
}

function getRequestOrigin(req: Request): string | null {
  const origin = asNonEmptyStringOrNull(req.headers.get("origin"));
  if (origin) return origin.replace(/\/+$/, "");

  const referer = asNonEmptyStringOrNull(req.headers.get("referer"));
  if (referer) {
    try {
      return new URL(referer).origin.replace(/\/+$/, "");
    } catch {
      return null;
    }
  }

  return null;
}

function buildDefaultUrls(req: Request) {
  const origin = getRequestOrigin(req) ?? "http://127.0.0.1:3107";
  return {
    successUrl: `${origin}/billing/success`,
    cancelUrl: `${origin}/pricing`,
  };
}

function isStripeSubscriptionUpdatable(
  subscription: Stripe.Subscription,
): boolean {
  return ["active", "trialing", "past_due", "unpaid"].includes(subscription.status);
}

function shouldForceCheckoutForLifecycle(
  subscription: Stripe.Subscription,
): boolean {
  return (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired" ||
    subscription.canceled_at != null ||
    subscription.ended_at != null
  );
}

function getSubscriptionLifecycleSnapshot(subscription: Stripe.Subscription) {
  return {
    id: subscription.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    cancel_at: subscription.cancel_at ?? null,
    canceled_at: subscription.canceled_at ?? null,
    ended_at: subscription.ended_at ?? null,
    current_period_end: subscription.current_period_end ?? null,
    current_period_start: subscription.current_period_start ?? null,
    collection_method: subscription.collection_method ?? null,
    default_payment_method:
      typeof subscription.default_payment_method === "string"
        ? subscription.default_payment_method
        : subscription.default_payment_method?.id ?? null,
  };
}

function getExistingRecurringItem(
  subscription: Stripe.Subscription,
): Stripe.SubscriptionItem | null {
  return (
    subscription.items.data.find((entry) => {
      const price = entry.price;
      return !!entry.id && !!price && !price.deleted && !!price.recurring;
    }) ?? null
  );
}

async function getAuthenticatedUser(params: {
  req: Request;
  supabaseUrl: string;
  anonKey: string;
}): Promise<
  | { user: { id: string; email: string | null } }
  | { error: Response }
> {
  const token = getBearerToken(params.req);

  if (!token) {
    return { error: json({ error: "Missing Authorization Bearer token" }, 401) };
  }

  try {
    const authClient = createClient(params.supabaseUrl, params.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error,
    } = await authClient.auth.getUser(token);

    if (error || !user?.id) {
      return {
        error: json(
          {
            error: "Invalid JWT",
            detail: error?.message ?? "No user returned from auth",
          },
          401,
        ),
      };
    }

    return {
      user: {
        id: user.id,
        email: asNonEmptyStringOrNull(user.email),
      },
    };
  } catch (error) {
    return {
      error: json(
        {
          error: "Auth lookup failed",
          detail: errToObj(error),
        },
        500,
      ),
    };
  }
}

async function getCanonicalSubscription(params: {
  supabaseAdmin: AdminClient;
  userId: string;
  includeCanceled?: boolean;
}): Promise<
  | { data: CanonicalSubscriptionRow | null }
  | { error: Response }
> {
  let query = params.supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", params.userId)
    .eq("app_id", APP_ID)
    .eq("provider", PROVIDER)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (params.includeCanceled) {
    query = query.in("status", [
      "active",
      "trialing",
      "past_due",
      "unpaid",
      "canceled",
      "incomplete_expired",
      "incomplete",
    ]);
  } else {
    query = query.in("status", ["active", "trialing", "past_due", "unpaid"]);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return {
      error: json(
        {
          error: "Failed to load canonical subscription",
          detail: error.message,
        },
        500,
      ),
    };
  }

  return { data: data ?? null };
}

async function getTierAndPrice(params: {
  supabaseAdmin: AdminClient;
  tierId: string | null;
  directPriceId: string | null;
}): Promise<
  | {
      data: {
        tier: SubscriptionTierRow | null;
        resolvedTierId: string | null;
        resolvedPriceId: string;
      };
    }
  | { error: Response }
> {
  let tier: SubscriptionTierRow | null = null;
  let resolvedTierId = params.tierId;
  let resolvedPriceId = params.directPriceId;

  if (!resolvedPriceId && !resolvedTierId) {
    return {
      error: json({ error: "tier_id/tierId or price_id/priceId is required" }, 400),
    };
  }

  if (!resolvedPriceId) {
    const { data, error } = await params.supabaseAdmin
      .from("subscription_tiers")
      .select("*")
      .eq("id", resolvedTierId!)
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        error: json(
          {
            error: "Tier lookup failed",
            detail: error.message,
          },
          500,
        ),
      };
    }

    tier = data;

    if (!tier) {
      return { error: json({ error: "Unknown tier" }, 400) };
    }

    if ("is_active" in tier && !tier.is_active) {
      return { error: json({ error: "Tier is inactive" }, 400) };
    }

    if (isFreeTier(tier)) {
      return { error: json({ error: "Free tier is not billable" }, 400) };
    }

    resolvedPriceId = asNonEmptyStringOrNull(tier.stripe_price_id);

    if (!resolvedPriceId) {
      return {
        error: json(
          {
            error: "Missing Stripe price id for tier",
            detail: {
              tier_id: resolvedTierId,
              tier_name: tier.name ?? null,
            },
          },
          500,
        ),
      };
    }
  }

  if (!isStripePriceId(resolvedPriceId)) {
    return {
      error: json(
        {
          error: "Invalid Stripe price id",
          detail: { tier_id: resolvedTierId, price_id: resolvedPriceId },
        },
        400,
      ),
    };
  }

  return {
    data: {
      tier,
      resolvedTierId,
      resolvedPriceId,
    },
  };
}

async function validateTargetPrice(params: {
  stripe: Stripe;
  priceId: string;
}): Promise<
  | { ok: true; price: Stripe.Price }
  | { ok: false; response: Response }
> {
  try {
    const price = await params.stripe.prices.retrieve(params.priceId);

    if (!price || price.deleted) {
      return {
        ok: false,
        response: json(
          {
            error: "Stripe price not found",
            detail: { price_id: params.priceId },
          },
          400,
        ),
      };
    }

    if (!price.active) {
      return {
        ok: false,
        response: json(
          {
            error: "Target Stripe price is inactive",
            detail: { price_id: params.priceId },
          },
          400,
        ),
      };
    }

    if (!price.recurring) {
      return {
        ok: false,
        response: json(
          {
            error: "Target Stripe price is not recurring",
            detail: { price_id: params.priceId },
          },
          400,
        ),
      };
    }

    return { ok: true, price };
  } catch (error) {
    return {
      ok: false,
      response: json(
        {
          error: "Unable to retrieve Stripe target price",
          detail: errToObj(error),
        },
        400,
      ),
    };
  }
}

function inferChangeType(params: {
  currentPrice: Stripe.Price;
  targetPrice: Stripe.Price;
}): "upgrade" | "downgrade" | "lateral" {
  const currentAmount = params.currentPrice.unit_amount ?? 0;
  const targetAmount = params.targetPrice.unit_amount ?? 0;

  if (targetAmount > currentAmount) return "upgrade";
  if (targetAmount < currentAmount) return "downgrade";
  return "lateral";
}

async function loadProfileByUserId(params: {
  supabaseAdmin: AdminClient;
  userId: string;
}): Promise<
  | { profile: ProfilesRow | null }
  | { error: Response }
> {
  const { data: profiles, error } = await params.supabaseAdmin
    .from("profiles")
    .select("id,user_id,stripe_customer_id,created_at,updated_at")
    .or(`id.eq.${params.userId},user_id.eq.${params.userId}`)
    .limit(10);

  if (error) {
    return {
      error: json(
        {
          error: "Failed to load profile",
          detail: error.message,
        },
        500,
      ),
    };
  }

  const profile =
    (profiles ?? []).find((p) => asNonEmptyStringOrNull(p?.id) === params.userId) ??
    (profiles ?? []).find((p) => asNonEmptyStringOrNull(p?.user_id) === params.userId) ??
    null;

  return { profile };
}

async function persistStripeCustomerId(params: {
  supabaseAdmin: AdminClient;
  userId: string;
  profile: ProfilesRow | null;
  customerId: string;
}): Promise<{ ok: true } | { error: Response }> {
  const timestamp = new Date().toISOString();

  if (params.profile?.id) {
    const { error } = await params.supabaseAdmin
      .from("profiles")
      .update({
        user_id: params.userId,
        stripe_customer_id: params.customerId,
        updated_at: timestamp,
      })
      .eq("id", params.profile.id);

    if (error) {
      return {
        error: json(
          {
            error: "Failed to update profile with Stripe customer id",
            detail: error.message,
          },
          500,
        ),
      };
    }

    return { ok: true };
  }

  const { error: insertError } = await params.supabaseAdmin
    .from("profiles")
    .insert({
      id: params.userId,
      user_id: params.userId,
      stripe_customer_id: params.customerId,
      updated_at: timestamp,
    });

  if (insertError) {
    const { error: fallbackError } = await params.supabaseAdmin
      .from("profiles")
      .update({
        user_id: params.userId,
        stripe_customer_id: params.customerId,
        updated_at: timestamp,
      })
      .eq("id", params.userId);

    if (fallbackError) {
      return {
        error: json(
          {
            error: "Failed to persist Stripe customer id",
            detail: {
              insert: insertError.message,
              fallbackUpdate: fallbackError.message,
            },
          },
          500,
        ),
      };
    }
  }

  return { ok: true };
}

async function ensureValidStripeCustomer(params: {
  supabaseAdmin: AdminClient;
  stripe: Stripe;
  userId: string;
  email: string | null;
}): Promise<{ customerId: string } | { error: Response }> {
  const loaded = await loadProfileByUserId({
    supabaseAdmin: params.supabaseAdmin,
    userId: params.userId,
  });
  if ("error" in loaded) return loaded;

  const profile = loaded.profile;
  const existingCustomerId = asNonEmptyStringOrNull(profile?.stripe_customer_id);

  if (isStripeCustomerId(existingCustomerId)) {
    try {
      const existingCustomer = await params.stripe.customers.retrieve(existingCustomerId);

      if (!("deleted" in existingCustomer) || existingCustomer.deleted !== true) {
        logInfo("Using existing Stripe customer", {
          user_id: params.userId,
          customer_id: existingCustomerId,
        });
        return { customerId: existingCustomerId };
      }
    } catch (error) {
      logError("Stored Stripe customer id is invalid in current mode", {
        user_id: params.userId,
        customer_id: existingCustomerId,
        detail: errToObj(error),
      });
    }
  }

  try {
    const customer = await params.stripe.customers.create({
      email: params.email ?? undefined,
      metadata: {
        supabase_user_id: params.userId,
        user_id: params.userId,
        app_id: APP_ID,
        provider: PROVIDER,
        ...(params.email ? { email: params.email } : {}),
      },
    });

    const persisted = await persistStripeCustomerId({
      supabaseAdmin: params.supabaseAdmin,
      userId: params.userId,
      profile,
      customerId: customer.id,
    });
    if ("error" in persisted) return persisted;

    logInfo("Created new Stripe customer", {
      user_id: params.userId,
      customer_id: customer.id,
    });

    return { customerId: customer.id };
  } catch (error) {
    return {
      error: json(
        {
          error: "Failed to create Stripe customer",
          detail: errToObj(error),
        },
        500,
      ),
    };
  }
}

async function createCheckoutSessionForFreeUser(params: {
  stripe: Stripe;
  supabaseAdmin: AdminClient;
  userId: string;
  email: string | null;
  resolvedPriceId: string;
  resolvedTierId: string | null;
  tier: SubscriptionTierRow | null;
  successUrl: string;
  cancelUrl: string;
  reason?: string;
  existingSubscriptionId?: string | null;
  existingStatus?: string | null;
}): Promise<Response> {
  const priceValidation = await validateTargetPrice({
    stripe: params.stripe,
    priceId: params.resolvedPriceId,
  });
  if (!priceValidation.ok) return priceValidation.response;

  const customer = await ensureValidStripeCustomer({
    supabaseAdmin: params.supabaseAdmin,
    stripe: params.stripe,
    userId: params.userId,
    email: params.email,
  });
  if ("error" in customer) return customer.error;

  let session: Stripe.Checkout.Session;
  try {
    session = await params.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.customerId,
      line_items: [
        {
          price: params.resolvedPriceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      allow_promotion_codes: true,
      client_reference_id: params.userId,
      metadata: {
        supabase_user_id: params.userId,
        user_id: params.userId,
        app_id: APP_ID,
        provider: PROVIDER,
        price_id: params.resolvedPriceId,
        entry_mode: "change_plan_fallback_checkout",
        ...(params.reason ? { reason: params.reason } : {}),
        ...(params.existingSubscriptionId
          ? { previous_subscription_id: params.existingSubscriptionId }
          : {}),
        ...(params.existingStatus ? { previous_subscription_status: params.existingStatus } : {}),
        ...(params.resolvedTierId ? { tier_id: params.resolvedTierId } : {}),
        ...(params.tier?.name ? { tier_name: String(params.tier.name) } : {}),
        ...(params.email ? { email: params.email } : {}),
      },
      subscription_data: {
        metadata: {
          supabase_user_id: params.userId,
          user_id: params.userId,
          app_id: APP_ID,
          provider: PROVIDER,
          price_id: params.resolvedPriceId,
          entry_mode: "change_plan_fallback_checkout",
          ...(params.reason ? { reason: params.reason } : {}),
          ...(params.existingSubscriptionId
            ? { previous_subscription_id: params.existingSubscriptionId }
            : {}),
          ...(params.existingStatus
            ? { previous_subscription_status: params.existingStatus }
            : {}),
          ...(params.resolvedTierId ? { tier_id: params.resolvedTierId } : {}),
          ...(params.tier?.name ? { tier_name: String(params.tier.name) } : {}),
          ...(params.email ? { email: params.email } : {}),
        },
      },
    });
  } catch (error) {
    logError("Failed to create Stripe checkout session", {
      stage: "checkout.sessions.create",
      user_id: params.userId,
      customer_id: customer.customerId,
      price_id: params.resolvedPriceId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      reason: params.reason ?? null,
      existing_subscription_id: params.existingSubscriptionId ?? null,
      existing_status: params.existingStatus ?? null,
      detail: errToObj(error),
    });

    return json(
      {
        error: "Failed to create Stripe checkout session",
        detail: errToObj(error),
        debug: {
          stage: "checkout.sessions.create",
          user_id: params.userId,
          customer_id: customer.customerId,
          price_id: params.resolvedPriceId,
          reason: params.reason ?? null,
          existing_subscription_id: params.existingSubscriptionId ?? null,
          existing_status: params.existingStatus ?? null,
        },
      },
      500,
    );
  }

  if (!session.url) {
    return json(
      {
        error: "Stripe checkout session created without URL",
        detail: { session_id: session.id },
      },
      500,
    );
  }

  return json({
    ok: true,
    action: "checkout",
    mode: "checkout",
    url: session.url,
    checkout_url: session.url,
    checkoutUrl: session.url,
    requested_price_id: params.resolvedPriceId,
    tier_id: params.resolvedTierId,
    requires_new_subscription: true,
    reason: params.reason ?? null,
    existing_subscription_id: params.existingSubscriptionId ?? null,
    existing_status: params.existingStatus ?? null,
    function_version: FUNCTION_VERSION,
    message:
      params.reason === "canceled_subscription_requires_checkout"
        ? "Existing Stripe subscription is canceled. Created a new checkout session instead of updating the canceled subscription."
        : "Checkout session created successfully.",
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const stripeSecretKey = env("STRIPE_SECRET_KEY");
    const supabaseUrl = getSupabaseUrl();
    const anonKey = getAnonKey();
    const serviceRoleKey = getServiceRoleKey();

    if (!stripeSecretKey) {
      return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
    }

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json(
        {
          error:
            "Supabase not configured (need SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)",
          function_version: FUNCTION_VERSION,
        },
        500,
      );
    }

    logInfo("billing-stripe-change-plan invoked", {
      stripe_mode: stripeSecretKey.startsWith("sk_live_")
        ? "live"
        : stripeSecretKey.startsWith("sk_test_")
          ? "test"
          : "unknown",
    });

    const auth = await getAuthenticatedUser({
      req,
      supabaseUrl,
      anonKey,
    });
    if ("error" in auth) return auth.error;

    const rawBody = await req.json().catch(() => null);
    const body = asRecordOrNull(rawBody);
    if (!body) return json({ error: "Invalid JSON body" }, 400);

    const tierId = getStringField(body, ["tier_id", "tierId"]);
    const directPriceId = getStringField(body, ["price_id", "priceId"]);
    const allowCanceledCheckoutFallback =
      asBooleanOrNull(body["allow_canceled_checkout_fallback"]) ?? true;

    const defaults = buildDefaultUrls(req);
    const requestedSuccessUrl = getStringField(body, ["success_url", "successUrl"]);
    const requestedCancelUrl = getStringField(body, ["cancel_url", "cancelUrl"]);

    const successUrl = isValidHttpUrl(requestedSuccessUrl)
      ? requestedSuccessUrl
      : defaults.successUrl;
    const cancelUrl = isValidHttpUrl(requestedCancelUrl)
      ? requestedCancelUrl
      : defaults.cancelUrl;

    logInfo("Incoming billing payload", {
      user_id: auth.user.id,
      keys: Object.keys(body),
      tier_id: tierId,
      price_id: directPriceId,
      requested_success_url: requestedSuccessUrl,
      requested_cancel_url: requestedCancelUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_canceled_checkout_fallback: allowCanceledCheckoutFallback,
    });

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createTypedClient(supabaseUrl, serviceRoleKey);

    const tierAndPrice = await getTierAndPrice({
      supabaseAdmin,
      tierId,
      directPriceId,
    });
    if ("error" in tierAndPrice) return tierAndPrice.error;

    const { tier, resolvedTierId, resolvedPriceId } = tierAndPrice.data;

    logInfo("Resolved tier/price", {
      user_id: auth.user.id,
      resolved_tier_id: resolvedTierId,
      resolved_price_id: resolvedPriceId,
      tier_name: tier?.name ?? null,
    });

    const canonical = await getCanonicalSubscription({
      supabaseAdmin,
      userId: auth.user.id,
      includeCanceled: true,
    });
    if ("error" in canonical) return canonical.error;

    if (!canonical.data) {
      return await createCheckoutSessionForFreeUser({
        stripe,
        supabaseAdmin,
        userId: auth.user.id,
        email: auth.user.email,
        resolvedPriceId,
        resolvedTierId,
        tier,
        successUrl,
        cancelUrl,
        reason: "no_existing_subscription",
      });
    }

    const subscriptionId = asNonEmptyStringOrNull(canonical.data.subscription_id);
    const currentPriceId = asNonEmptyStringOrNull(canonical.data.price_id);
    const canonicalStatus = asNonEmptyStringOrNull(canonical.data.status);

    if (!subscriptionId) {
      return await createCheckoutSessionForFreeUser({
        stripe,
        supabaseAdmin,
        userId: auth.user.id,
        email: auth.user.email,
        resolvedPriceId,
        resolvedTierId,
        tier,
        successUrl,
        cancelUrl,
        reason: "missing_canonical_subscription_id",
        existingSubscriptionId: null,
        existingStatus: canonicalStatus,
      });
    }

    if (currentPriceId && currentPriceId === resolvedPriceId) {
      return json(
        {
          ok: true,
          changed: false,
          action: "noop",
          subscription_id: subscriptionId,
          current_price_id: currentPriceId,
          requested_price_id: resolvedPriceId,
          function_version: FUNCTION_VERSION,
          message: "User is already on the requested plan price.",
        },
        200,
      );
    }

    const targetPriceValidation = await validateTargetPrice({
      stripe,
      priceId: resolvedPriceId,
    });
    if (!targetPriceValidation.ok) return targetPriceValidation.response;

    let stripeSubscription: Stripe.Subscription;
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price"],
      });
    } catch (error) {
      return json(
        {
          error: "Failed to retrieve Stripe subscription",
          detail: errToObj(error),
          subscription_id: subscriptionId,
          canonical_status: canonicalStatus,
          function_version: FUNCTION_VERSION,
        },
        500,
      );
    }

    const lifecycle = getSubscriptionLifecycleSnapshot(stripeSubscription);

    logInfo("Stripe subscription lifecycle check", {
      user_id: auth.user.id,
      subscription_id: subscriptionId,
      canonical_status: canonicalStatus,
      ...lifecycle,
    });

    const shouldForceCheckout = shouldForceCheckoutForLifecycle(stripeSubscription);

    if (shouldForceCheckout) {
      logInfo("Stripe subscription requires checkout fallback", {
        user_id: auth.user.id,
        subscription_id: subscriptionId,
        canonical_status: canonicalStatus,
        ...lifecycle,
      });

      if (!allowCanceledCheckoutFallback) {
        return json(
          {
            error: "Stripe subscription is canceled and cannot be updated",
            action: "create_checkout_session",
            requires_new_subscription: true,
            subscription_id: subscriptionId,
            canonical_status: canonicalStatus,
            stripe_subscription: lifecycle,
            requested_price_id: resolvedPriceId,
            function_version: FUNCTION_VERSION,
          },
          409,
        );
      }

      return await createCheckoutSessionForFreeUser({
        stripe,
        supabaseAdmin,
        userId: auth.user.id,
        email: auth.user.email,
        resolvedPriceId,
        resolvedTierId,
        tier,
        successUrl,
        cancelUrl,
        reason: "canceled_subscription_requires_checkout",
        existingSubscriptionId: subscriptionId,
        existingStatus: stripeSubscription.status,
      });
    }

    if (!isStripeSubscriptionUpdatable(stripeSubscription)) {
      return json(
        {
          error: "Stripe subscription is not in an updatable state",
          action: "create_checkout_session",
          requires_new_subscription: true,
          subscription_id: subscriptionId,
          canonical_status: canonicalStatus,
          stripe_subscription: lifecycle,
          requested_price_id: resolvedPriceId,
          function_version: FUNCTION_VERSION,
        },
        409,
      );
    }

    const item = getExistingRecurringItem(stripeSubscription);
    if (!item?.id) {
      return json(
        {
          error: "Stripe subscription has no editable recurring subscription item",
          subscription_id: subscriptionId,
          stripe_subscription: lifecycle,
          function_version: FUNCTION_VERSION,
        },
        500,
      );
    }

    const currentStripePrice = item.price;
    const targetStripePrice = targetPriceValidation.price;

    const changeType = inferChangeType({
      currentPrice: currentStripePrice,
      targetPrice: targetStripePrice,
    });

    try {
      await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: item.id,
            price: resolvedPriceId,
          },
        ],
        cancel_at_period_end: false,
        proration_behavior: "create_prorations",
        metadata: {
          ...(stripeSubscription.metadata ?? {}),
          supabase_user_id: auth.user.id,
          user_id: auth.user.id,
          app_id: APP_ID,
          provider: PROVIDER,
          price_id: resolvedPriceId,
          ...(resolvedTierId ? { tier_id: resolvedTierId } : {}),
          ...(tier?.name ? { tier_name: String(tier.name) } : {}),
          ...(auth.user.email ? { email: auth.user.email } : {}),
        },
      });
    } catch (error) {
      logError("Failed to update Stripe subscription plan", {
        stage: "subscriptions.update",
        user_id: auth.user.id,
        subscription_id: subscriptionId,
        requested_price_id: resolvedPriceId,
        canonical_status: canonicalStatus,
        stripe_subscription: lifecycle,
        detail: errToObj(error),
      });

      return json(
        {
          error: "Failed to update Stripe subscription plan",
          detail: errToObj(error),
          subscription_id: subscriptionId,
          canonical_status: canonicalStatus,
          stripe_subscription: lifecycle,
          function_version: FUNCTION_VERSION,
        },
        500,
      );
    }

    return json({
      ok: true,
      changed: true,
      action: "change_plan",
      change_type: changeType,
      subscription_id: subscriptionId,
      previous_price_id: currentPriceId,
      requested_price_id: resolvedPriceId,
      tier_id: resolvedTierId,
      function_version: FUNCTION_VERSION,
      message:
        changeType === "upgrade"
          ? "Subscription upgraded successfully. Webhook will sync the canonical row."
          : changeType === "downgrade"
            ? "Subscription downgraded successfully. Webhook will sync the canonical row."
            : "Subscription updated successfully. Webhook will sync the canonical row.",
    });
  } catch (error) {
    logError("Internal error", {
      detail: errToObj(error),
    });

    return json(
      {
        error: "Internal error",
        detail: errToObj(error),
        function_version: FUNCTION_VERSION,
      },
      500,
    );
  }
});