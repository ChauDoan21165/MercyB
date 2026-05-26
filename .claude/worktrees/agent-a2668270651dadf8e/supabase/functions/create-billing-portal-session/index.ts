// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "npm:stripe@12.18.0";

const APP_ID = "mercy_blade";
const PROVIDER = "stripe";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

function getBearerToken(req: Request): string {
  const authHeader = req.headers.get("authorization") || "";
  return authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
}

function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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
    const supabaseUrl = env("SUPABASE_URL");
    const anonKey = env("SUPABASE_ANON_KEY");
    const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
    const appUrl = env("SITE_URL") || env("FRONTEND_URL") ||
      "http://localhost:5173";

    if (!stripeSecretKey) {
      return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
    }

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json(
        {
          error:
            "Supabase not configured (need SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY)",
        },
        500,
      );
    }

    const token = getBearerToken(req);
    if (!token) {
      return json({ error: "Missing Authorization Bearer token" }, 401);
    }

    const authClient = createClient(supabaseUrl, anonKey, {
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
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user?.id) {
      return json(
        {
          error: "Invalid JWT",
          detail: authError?.message ?? "No user returned from auth",
        },
        401,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("id,status,provider")
      .eq("user_id", user.id)
      .eq("app_id", APP_ID)
      .eq("provider", PROVIDER)
      .in("status", ["active", "trialing", "past_due", "canceled"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      return json(
        {
          error: "Failed to resolve subscription",
          detail: subError.message,
        },
        500,
      );
    }

    if (!subscription) {
      return json({ error: "No Stripe subscription found for user" }, 404);
    }

    const { data: profileById } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle();

    let stripeCustomerId = asNonEmptyStringOrNull(
      profileById?.stripe_customer_id,
    );

    if (!stripeCustomerId) {
      const { data: profileByUserId } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      stripeCustomerId = asNonEmptyStringOrNull(
        profileByUserId?.stripe_customer_id,
      );
    }

    if (!stripeCustomerId) {
      return json({ error: "No Stripe customer found for user" }, 404);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: appUrl,
    });

    return json({ url: session.url });
  } catch (error) {
    return json(
      {
        error: "Internal error",
        detail: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});