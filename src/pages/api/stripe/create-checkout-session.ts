/**
 * File: create-checkout-session.ts
 * Path: src/pages/api/stripe/create-checkout-session.ts
 */

import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Plan = "monthly" | "yearly";

type CheckoutRequestBody = {
  user_id?: string;
  plan?: Plan;
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
const stripe = new Stripe(String(stripeSecretKey || ""), {
  apiVersion: "2026-02-25.clover",
});

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"] as const;
const ACTIVE_SUBSCRIPTION_STATUS_SET = new Set<string>(
  ACTIVE_SUBSCRIPTION_STATUSES,
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getPriceId(plan: Plan): string | undefined {
  if (plan === "monthly") return process.env.STRIPE_PRICE_ONE_MONTH;
  if (plan === "yearly") return process.env.STRIPE_PRICE_ONE_YEAR;
  return undefined;
}

function getCanonicalAppUrl(): string | null {
  try {
    return new URL(process.env.APP_URL || "").origin;
  } catch {
    return null;
  }
}

async function getActiveSubscription(
  supabaseAdmin: SupabaseClient,
  userId: string,
): Promise<ExistingSubscription | null> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("id, status, provider_subscription_id, provider_customer_id")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_SUBSCRIPTION_STATUSES])
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

async function getOrCreateStripeCustomerId(
  supabaseAdmin: SupabaseClient,
  userId: string,
): Promise<string | undefined> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const { data: userData } =
    await supabaseAdmin.auth.admin.getUserById(userId);

  const email = userData?.user?.email;
  if (!email) return undefined;

  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });

  await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return new Response("Missing Supabase config", { status: 500 });
  }

  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const plan = body.plan;

    if (!plan || (plan !== "monthly" && plan !== "yearly")) {
      return new Response("Invalid plan", { status: 400 });
    }

    const userId = body.user_id;
    if (!userId) {
      return new Response("Missing user", { status: 401 });
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      return new Response("Price not configured", { status: 400 });
    }

    const appUrl = getCanonicalAppUrl();
    if (!appUrl) {
      return new Response("Invalid APP_URL", { status: 500 });
    }

    const existing = await getActiveSubscription(supabaseAdmin, userId);
    if (existing && ACTIVE_SUBSCRIPTION_STATUS_SET.has(existing.status)) {
      return jsonResponse({ error: "ALREADY_SUBSCRIBED" }, 409);
    }

    const customerId = await getOrCreateStripeCustomerId(
      supabaseAdmin,
      userId,
    );

    const metadata = {
      user_id: userId,
      plan,
      price_id: priceId,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(customerId ? { customer: customerId } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata,
      subscription_data: { metadata },
    });

    return jsonResponse({ checkout_url: session.url });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}