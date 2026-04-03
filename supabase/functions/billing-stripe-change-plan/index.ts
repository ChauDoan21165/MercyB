// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "npm:stripe@12.18.0";
import type { Database } from "../_shared/database.types.ts";

const APP_ID = "mercy_blade";
const PROVIDER = "stripe";

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

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function isFreeTier(tier: { name?: string | null }): boolean {
  return normalize(tier.name) === "free";
}

function isStripePriceId(value: string | null): value is string {
  return !!value && /^price_[A-Za-z0-9]+$/.test(value);
}

function errToObj(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const cause = asRecordOrNull(error.cause);
    return {
      name: error.name,
      message: error.message,
      cause: cause?.message ?? error.cause ?? null,
    };
  }

  const record = asRecordOrNull(error);
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
}): Promise<
  | { data: CanonicalSubscriptionRow | null }
  | { error: Response }
> {
  const { data, error } = await params.supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", params.userId)
    .eq("app_id", APP_ID)
    .eq("provider", PROVIDER)
    .in("status", ["active", "trialing", "past_due"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

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
      error: json({ error: "tier_id or price_id is required" }, 400),
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

    if (("is_active" in tier) && !tier.is_active) {
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
        },
        500,
      );
    }

    const auth = await getAuthenticatedUser({
      req,
      supabaseUrl,
      anonKey,
    });
    if ("error" in auth) return auth.error;

    const rawBody = await req.json().catch(() => null);
    const body = asRecordOrNull(rawBody);
    if (!body) return json({ error: "Invalid JSON body" }, 400);

    const tierId = asNonEmptyStringOrNull(body.tier_id);
    const directPriceId = asNonEmptyStringOrNull(body.price_id);

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createTypedClient(supabaseUrl, serviceRoleKey);

    const canonical = await getCanonicalSubscription({
      supabaseAdmin,
      userId: auth.user.id,
    });
    if ("error" in canonical) return canonical.error;

    if (!canonical.data) {
      return json(
        {
          error: "No active paid subscription found",
          detail: "User must subscribe before changing plan",
        },
        409,
      );
    }

    const subscriptionId = asNonEmptyStringOrNull(canonical.data.subscription_id);
    const currentPriceId = asNonEmptyStringOrNull(canonical.data.price_id);

    if (!subscriptionId) {
      return json(
        {
          error: "Canonical subscription missing Stripe subscription_id",
        },
        500,
      );
    }

    const tierAndPrice = await getTierAndPrice({
      supabaseAdmin,
      tierId,
      directPriceId,
    });
    if ("error" in tierAndPrice) return tierAndPrice.error;

    const { tier, resolvedTierId, resolvedPriceId } = tierAndPrice.data;

    if (currentPriceId && currentPriceId === resolvedPriceId) {
      return json(
        {
          ok: true,
          changed: false,
          action: "noop",
          subscription_id: subscriptionId,
          current_price_id: currentPriceId,
          requested_price_id: resolvedPriceId,
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
        },
        500,
      );
    }

    const item = stripeSubscription.items.data[0];
    if (!item?.id) {
      return json(
        {
          error: "Stripe subscription has no editable subscription item",
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
      return json(
        {
          error: "Failed to update Stripe subscription plan",
          detail: errToObj(error),
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
      message:
        changeType === "upgrade"
          ? "Subscription upgraded successfully. Webhook will sync the canonical row."
          : changeType === "downgrade"
            ? "Subscription downgraded successfully. Webhook will sync the canonical row."
            : "Subscription updated successfully. Webhook will sync the canonical row.",
    });
  } catch (error) {
    return json(
      {
        error: "Internal error",
        detail: errToObj(error),
      },
      500,
    );
  }
});