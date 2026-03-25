// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "npm:stripe@12.18.0";
import type { Database, Json } from "../_shared/database.types.ts";

const APP_ID = "mercy_blade";
const PROVIDER = "stripe";
const DEFAULT_TRIAL_DAYS = 3;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;

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

type ProfilesInsert = {
  id?: string;
  user_id?: string | null;
  stripe_customer_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ProfilesUpdate = ProfilesInsert;

type AppDatabase = {
  public: {
    Tables: Database["public"]["Tables"] & {
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
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
    };
    Views: Database["public"]["Views"];
    Functions: Database["public"]["Functions"];
    Enums: Database["public"]["Enums"];
    CompositeTypes: Database["public"]["CompositeTypes"];
  };
};

type SubscriptionTierRow =
  AppDatabase["public"]["Tables"]["subscription_tiers"]["Row"];
type PaymentTransactionInsert =
  Database["public"]["Tables"]["payment_transactions"]["Insert"];

type ExistingSubscriptionRow = {
  id: string;
  status: string | null;
  provider: string | null;
};

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

function getAnonKey(): string {
  return env("SUPABASE_ANON_KEY");
}

function getServiceRoleKey(): string {
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

function getSupabaseUrl(): string {
  const configured = env("SUPABASE_URL");
  return configured ? configured.replace(/\/+$/, "") : "";
}

function getTrialDays(): number {
  const raw = env("STRIPE_TRIAL_DAYS");
  const parsed = Number.parseInt(raw, 10);
  if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 30) {
    return parsed;
  }
  return DEFAULT_TRIAL_DAYS;
}

function createTypedClient(supabaseUrl: string, key: string) {
  return createClient<AppDatabase>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type AdminClient = ReturnType<typeof createTypedClient>;

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
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

function asPositiveIntOrDefault(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

function clampQuantity(value: number): number {
  if (value < MIN_QUANTITY) return MIN_QUANTITY;
  if (value > MAX_QUANTITY) return MAX_QUANTITY;
  return value;
}

function getBaseUrl(req: Request): string {
  const siteUrl = env("SITE_URL") || env("FRONTEND_URL");
  if (siteUrl) return siteUrl.replace(/\/+$/, "");

  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  try {
    const url = new URL(origin);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://localhost:5173";
  }
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

function isFreeTier(tier: { name?: string | null }): boolean {
  return normalize(tier.name) === "free";
}

function isStripePriceId(value: string | null): value is string {
  return !!value && /^price_[A-Za-z0-9]+$/.test(value);
}

function buildStripeOwnershipMetadata(params: {
  userId: string;
  userEmail: string | null;
  resolvedTierId: string | null;
  tierName: string | null;
  resolvedPriceId: string;
  stripeCustomerId: string | null;
}): Record<string, string> {
  const metadata: Record<string, string> = {
    supabase_user_id: params.userId,
    user_id: params.userId,
    app_id: APP_ID,
    provider: PROVIDER,
    price_id: params.resolvedPriceId,
  };

  if (params.resolvedTierId) metadata.tier_id = params.resolvedTierId;
  if (params.tierName) metadata.tier_name = params.tierName;
  if (params.userEmail) metadata.email = params.userEmail;
  if (params.stripeCustomerId) {
    metadata.stripe_customer_id = params.stripeCustomerId;
  }

  return metadata;
}

function getStripeCustomerOwnerUserId(customer: Stripe.Customer): string | null {
  return asNonEmptyStringOrNull(customer.metadata?.supabase_user_id) ??
    asNonEmptyStringOrNull(customer.metadata?.user_id);
}

async function validateStripeRecurringPrice(params: {
  stripe: Stripe;
  priceId: string;
}): Promise<
  | { ok: true; price: Stripe.Price }
  | { ok: false; response: Response }
> {
  try {
    const price = await params.stripe.prices.retrieve(params.priceId);

    if (!price || typeof price !== "object" || !("id" in price)) {
      return {
        ok: false,
        response: json(
          {
            error: "Stripe price lookup failed",
            detail: "Price was not returned",
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
            error: "Stripe price is inactive",
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
            error: "Stripe price is not recurring",
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
          error: "Unable to retrieve Stripe price",
          detail: {
            price_id: params.priceId,
            stripe: errToObj(error),
          },
        },
        400,
      ),
    };
  }
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

async function readProfileStripeCustomerId(
  supabaseAdmin: AdminClient,
  userId: string,
): Promise<string | null> {
  try {
    const byId = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .limit(1)
      .maybeSingle();

    if (!byId.error) {
      const value = asNonEmptyStringOrNull(byId.data?.stripe_customer_id);
      if (value) return value;
    }

    const byUserId = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (!byUserId.error) {
      const value = asNonEmptyStringOrNull(byUserId.data?.stripe_customer_id);
      if (value) return value;
    }
  } catch {
    // best-effort
  }

  return null;
}

async function persistProfileStripeCustomerId(params: {
  supabaseAdmin: AdminClient;
  userId: string;
  stripeCustomerId: string | null;
}): Promise<void> {
  const patch: ProfilesUpdate = {
    stripe_customer_id: params.stripeCustomerId,
  };

  try {
    const updateById = await params.supabaseAdmin
      .from("profiles")
      .update(patch)
      .eq("id", params.userId);

    if (!updateById.error) return;
  } catch {
    // continue
  }

  try {
    await params.supabaseAdmin
      .from("profiles")
      .update(patch)
      .eq("user_id", params.userId);
  } catch {
    // best-effort
  }
}

async function resolveStripeCustomerId(params: {
  stripe: Stripe;
  supabaseAdmin: AdminClient;
  userId: string;
  userEmail: string | null;
}): Promise<string> {
  let stripeCustomerId = await readProfileStripeCustomerId(
    params.supabaseAdmin,
    params.userId,
  );

  if (stripeCustomerId) {
    try {
      const retrieved = await params.stripe.customers.retrieve(stripeCustomerId);

      if ("deleted" in retrieved && retrieved.deleted) {
        stripeCustomerId = null;
        await persistProfileStripeCustomerId({
          supabaseAdmin: params.supabaseAdmin,
          userId: params.userId,
          stripeCustomerId: null,
        });
      } else {
        const existingCustomer = retrieved as Stripe.Customer;
        const ownerUserId = getStripeCustomerOwnerUserId(existingCustomer);

        if (ownerUserId && ownerUserId !== params.userId) {
          console.warn(
            "Stripe customer ownership mismatch; creating fresh customer",
            {
              current_user_id: params.userId,
              owner_user_id: ownerUserId,
              stripe_customer_id: existingCustomer.id,
            },
          );

          stripeCustomerId = null;
          await persistProfileStripeCustomerId({
            supabaseAdmin: params.supabaseAdmin,
            userId: params.userId,
            stripeCustomerId: null,
          });
        }
      }
    } catch {
      stripeCustomerId = null;
      await persistProfileStripeCustomerId({
        supabaseAdmin: params.supabaseAdmin,
        userId: params.userId,
        stripeCustomerId: null,
      });
    }
  }

  if (!stripeCustomerId) {
    const customer = await params.stripe.customers.create({
      email: params.userEmail ?? undefined,
      metadata: {
        supabase_user_id: params.userId,
        user_id: params.userId,
        app_id: APP_ID,
        provider: PROVIDER,
      },
    });

    stripeCustomerId = String(customer.id);

    await persistProfileStripeCustomerId({
      supabaseAdmin: params.supabaseAdmin,
      userId: params.userId,
      stripeCustomerId,
    });
  } else {
    try {
      await params.stripe.customers.update(stripeCustomerId, {
        email: params.userEmail ?? undefined,
        metadata: {
          supabase_user_id: params.userId,
          user_id: params.userId,
          app_id: APP_ID,
          provider: PROVIDER,
        },
      });
    } catch {
      // best-effort
    }
  }

  return stripeCustomerId;
}

async function getExistingPaidSubscription(params: {
  supabaseAdmin: AdminClient;
  userId: string;
}): Promise<
  | { data: ExistingSubscriptionRow | null }
  | { error: Response }
> {
  const { data, error } = await params.supabaseAdmin
    .from("subscriptions")
    .select("id,status,provider")
    .eq("user_id", params.userId)
    .eq("app_id", APP_ID)
    .eq("provider", PROVIDER)
    .in("status", ["active", "trialing"])
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      error: json(
        {
          error: "Failed to check existing subscription",
          detail: error.message,
        },
        500,
      ),
    };
  }

  return {
    data: (data as ExistingSubscriptionRow | null) ?? null,
  };
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
            "Supabase not configured (need SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY)",
          have: {
            SUPABASE_URL: !!env("SUPABASE_URL"),
            SUPABASE_ANON_KEY: !!env("SUPABASE_ANON_KEY"),
            SUPABASE_SERVICE_ROLE_KEY: !!env("SUPABASE_SERVICE_ROLE_KEY"),
          },
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

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createTypedClient(supabaseUrl, serviceRoleKey);

    const rawBody = await req.json().catch(() => null);
    const body = asRecordOrNull(rawBody);

    if (!body) {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const directPriceId = asNonEmptyStringOrNull(body.price_id);
    const tierId = asNonEmptyStringOrNull(body.tier_id);
    const requestedQuantity = asPositiveIntOrDefault(body.quantity, 1);
    const quantity = clampQuantity(requestedQuantity);

    if (!directPriceId && !tierId) {
      return json({ error: "tier_id or price_id is required" }, 400);
    }

    if (requestedQuantity !== quantity) {
      return json(
        {
          error: "Invalid quantity",
          detail: {
            min: MIN_QUANTITY,
            max: MAX_QUANTITY,
          },
        },
        400,
      );
    }

    let tierRow: SubscriptionTierRow | null = null;
    let resolvedTierId: string | null = tierId ?? null;
    let resolvedPriceId: string | null = directPriceId;

    if (!resolvedPriceId) {
      const { data, error } = await supabaseAdmin
        .from("subscription_tiers")
        .select("*")
        .eq("id", tierId!)
        .limit(1)
        .maybeSingle();

      if (error) {
        return json(
          {
            error: "Tier lookup failed",
            detail: error.message,
          },
          500,
        );
      }

      tierRow = data;

      if (!tierRow) {
        return json({ error: "Unknown tier", detail: "not found" }, 400);
      }

      if (("is_active" in tierRow) && !tierRow.is_active) {
        return json({ error: "Tier is inactive" }, 400);
      }

      if (isFreeTier(tierRow)) {
        return json({ error: "Free tier is not purchasable" }, 400);
      }

      resolvedPriceId = asNonEmptyStringOrNull(tierRow.stripe_price_id);

      if (!resolvedPriceId) {
        return json(
          {
            error: "Missing Stripe price id",
            detail: {
              tier_id: resolvedTierId,
              tier_name: tierRow.name ?? null,
            },
          },
          500,
        );
      }
    }

    if (!isStripePriceId(resolvedPriceId)) {
      return json(
        {
          error: "Invalid Stripe price id",
          detail: {
            tier_id: resolvedTierId,
            price_id: resolvedPriceId,
          },
        },
        400,
      );
    }

    const successUrl = asNonEmptyStringOrNull(body.success_url) ??
      `${getBaseUrl(req)}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = asNonEmptyStringOrNull(body.cancel_url) ??
      `${getBaseUrl(req)}/billing`;

    if (!isAbsoluteHttpUrl(successUrl)) {
      return json(
        {
          error: "Invalid success_url",
          detail: "success_url must be an absolute http(s) URL",
        },
        400,
      );
    }

    if (!isAbsoluteHttpUrl(cancelUrl)) {
      return json(
        {
          error: "Invalid cancel_url",
          detail: "cancel_url must be an absolute http(s) URL",
        },
        400,
      );
    }

    const priceValidation = await validateStripeRecurringPrice({
      stripe,
      priceId: resolvedPriceId,
    });
    if (!priceValidation.ok) {
      return priceValidation.response;
    }

    const existingSubscription = await getExistingPaidSubscription({
      supabaseAdmin,
      userId: auth.user.id,
    });

    if ("error" in existingSubscription) {
      return existingSubscription.error;
    }

    if (existingSubscription.data) {
      return json({
        already_subscribed: true,
      });
    }

    const userEmail = asNonEmptyStringOrNull(auth.user.email);

    let stripeCustomerId: string;
    try {
      stripeCustomerId = await resolveStripeCustomerId({
        stripe,
        supabaseAdmin,
        userId: auth.user.id,
        userEmail,
      });
    } catch (error) {
      return json(
        {
          error: "Unable to resolve Stripe customer id",
          detail: errToObj(error),
        },
        500,
      );
    }

    const trialDays = getTrialDays();

    const metadata = buildStripeOwnershipMetadata({
      userId: auth.user.id,
      userEmail,
      resolvedTierId,
      tierName: asNonEmptyStringOrNull(tierRow?.name),
      resolvedPriceId,
      stripeCustomerId,
    });

    let sessionId: string | null = null;
    let sessionUrl: string | null = null;

    try {
      const createdSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        client_reference_id: auth.user.id,
        line_items: [{ price: resolvedPriceId, quantity }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        subscription_data: {
          metadata,
          ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
        },
      });

      sessionId = String(createdSession.id);
      sessionUrl = asNonEmptyStringOrNull(createdSession.url) ?? null;
    } catch (error) {
      return json(
        {
          error: "Stripe checkout session create failed",
          detail: errToObj(error),
        },
        500,
      );
    }

    if (!sessionId) {
      return json({ error: "Stripe checkout session missing" }, 500);
    }

    if (!sessionUrl) {
      return json({ error: "Stripe checkout session url missing" }, 500);
    }

    if (resolvedTierId) {
      const txPayload: PaymentTransactionInsert = {
        user_id: auth.user.id,
        tier_id: resolvedTierId,
        external_reference: sessionId,
        status: "pending",
        transaction_type: "subscription",
        payment_method: "stripe",
        amount: 0,
        metadata: {
          stripe_customer_id: stripeCustomerId,
          stripe_checkout_session_id: sessionId,
          price_id: resolvedPriceId,
          tier_name: tierRow?.name ?? null,
          trial_days: trialDays,
          user_id: auth.user.id,
          app_id: APP_ID,
          provider: PROVIDER,
        } as Json,
      };

      const { error } = await supabaseAdmin
        .from("payment_transactions")
        .upsert(txPayload, { onConflict: "external_reference" });

      if (error) {
        console.error("Failed to write payment_transactions", {
          message: error.message,
          session_id: sessionId,
          user_id: auth.user.id,
        });
      }
    }

    return json({
      ok: true,
      id: sessionId,
      sessionId,
      session_id: sessionId,
      url: sessionUrl,
      checkout_url: sessionUrl,
      checkoutUrl: sessionUrl,
      tier_id: resolvedTierId,
      price_id: resolvedPriceId,
      trial_days: trialDays,
      vip_key: null,
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