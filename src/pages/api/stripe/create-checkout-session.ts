// src/pages/api/stripe/create-checkout-session.ts

import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Tier = "VIP1" | "VIP3" | "VIP9";

type CheckoutRequestBody = {
  user_id?: string;
  tier?: Tier;
};

type ExistingSubscription = {
  id: string;
  status: string;
  provider_subscription_id: string | null;
  provider_customer_id: string | null;
};

type ProfileRow = {
  stripe_customer_id: string | null;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  // eslint-disable-next-line no-console
  console.error("[stripe] Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(String(stripeSecretKey || ""), {
  apiVersion: "2026-02-25.clover",
});

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"] as const;
const ACTIVE_SUBSCRIPTION_STATUS_SET = new Set<string>(
  ACTIVE_SUBSCRIPTION_STATUSES,
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  // eslint-disable-next-line no-console
  console.error("[stripe] Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.error("[stripe] Missing SUPABASE_SERVICE_ROLE_KEY");
}

function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getPriceIdForTier(tier: Tier): string | undefined {
  if (tier === "VIP1") return process.env.STRIPE_PRICE_VIP1;
  if (tier === "VIP3") return process.env.STRIPE_PRICE_VIP3;
  if (tier === "VIP9") return process.env.STRIPE_PRICE_VIP9;
  return undefined;
}

function getCanonicalAppUrl(): string | null {
  const raw = process.env.APP_URL;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return null;
  }
}

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim() || null;
}

/**
 * Best practice:
 * - derive the authenticated user from a verified server session / bearer token
 * - do NOT trust a raw user_id from the client body long-term
 *
 * Current behavior:
 * 1) tries verified Supabase bearer token first
 * 2) falls back to body.user_id to remain drop-in compatible
 */
async function getAuthenticatedUserId(
  req: Request,
  body: CheckoutRequestBody,
  supabaseAdmin: SupabaseClient | null,
): Promise<string | null> {
  const token = getBearerToken(req);

  if (token && supabaseAdmin) {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (!error && user?.id) {
      return user.id;
    }

    // eslint-disable-next-line no-console
    console.warn("[stripe] Bearer token auth failed; falling back to body.user_id", {
      error: error?.message ?? null,
    });
  }

  const fallbackUserId =
    typeof body.user_id === "string" ? body.user_id.trim() : "";

  return fallbackUserId || null;
}

/**
 * Checks canonical public.subscriptions for an existing blocking subscription.
 */
async function getActiveSubscription(
  supabaseAdmin: SupabaseClient,
  userId: string,
): Promise<ExistingSubscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(
      "id, status, provider_subscription_id, provider_customer_id",
    )
    .eq("user_id", userId)
    .in("status", [...ACTIVE_SUBSCRIPTION_STATUSES])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<ExistingSubscription>();

  if (error) {
    throw new Error(
      `Failed to check existing subscription: ${error.message}`,
    );
  }

  return data ?? null;
}

async function getOrCreateStripeCustomerId(
  supabaseAdmin: SupabaseClient,
  userId: string,
): Promise<string | undefined> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    // eslint-disable-next-line no-console
    console.warn("[stripe] Failed to read profile stripe_customer_id", {
      userId,
      error: profileError.message,
    });
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
    userId,
  );

  if (userError || !userData.user) {
    // eslint-disable-next-line no-console
    console.warn("[stripe] Failed to load auth user for customer creation", {
      userId,
      error: userError?.message ?? null,
    });
    return undefined;
  }

  const email = userData.user.email;
  if (!email) {
    // eslint-disable-next-line no-console
    console.warn("[stripe] Auth user has no email; creating checkout without customer", {
      userId,
    });
    return undefined;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
    },
  });

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  if (updateError) {
    // eslint-disable-next-line no-console
    console.warn("[stripe] Failed to persist stripe_customer_id to profile", {
      userId,
      customerId: customer.id,
      error: updateError.message,
    });
  }

  return customer.id;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  if (!stripeSecretKey) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return new Response(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const tier = body.tier;

    if (!tier) {
      return new Response("Missing tier", { status: 400 });
    }

    if (tier !== "VIP1" && tier !== "VIP3" && tier !== "VIP9") {
      return new Response("Invalid tier", { status: 400 });
    }

    const userId = await getAuthenticatedUserId(req, body, supabaseAdmin);
    if (!userId) {
      return new Response("Missing or invalid authenticated user", {
        status: 401,
      });
    }

    const appUrl = getCanonicalAppUrl();
    if (!appUrl) {
      return new Response("Missing or invalid APP_URL", { status: 500 });
    }

    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return new Response("Price not configured for tier", { status: 400 });
    }

    const existing = await getActiveSubscription(supabaseAdmin, userId);
    if (
      existing &&
      typeof existing.status === "string" &&
      ACTIVE_SUBSCRIPTION_STATUS_SET.has(existing.status)
    ) {
      return jsonResponse(
        {
          error: "ALREADY_SUBSCRIBED",
          message:
            "User already has a blocking subscription status and cannot create another checkout session.",
          existing_subscription: {
            id: existing.id,
            status: existing.status,
            provider_subscription_id: existing.provider_subscription_id,
            provider_customer_id: existing.provider_customer_id,
          },
        },
        409,
      );
    }

    const customerId = await getOrCreateStripeCustomerId(
      supabaseAdmin,
      userId,
    );

    const metadata = {
      user_id: userId,
      tier,
      price_id: priceId,
      source: "src/pages/api/stripe/create-checkout-session.ts",
    };

    const requestIdempotencyKey =
      req.headers.get("x-idempotency-key")?.trim() || null;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        ...(customerId ? { customer: customerId } : {}),
        client_reference_id: userId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/billing/success?checkout=success`,
        cancel_url: `${appUrl}/billing/cancel`,
        metadata,
        subscription_data: {
          metadata,
        },
      },
      requestIdempotencyKey
        ? { idempotencyKey: requestIdempotencyKey }
        : undefined,
    );

    if (!session.url) {
      // eslint-disable-next-line no-console
      console.error("[stripe] Checkout session created without URL", {
        userId,
        tier,
        sessionId: session.id,
      });

      return new Response("Failed to create checkout URL", { status: 500 });
    }

    return jsonResponse({ checkout_url: session.url }, 200);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Stripe checkout error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}