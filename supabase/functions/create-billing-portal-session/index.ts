// deno-lint-ignore-file no-import-prefix
//
// Deno entrypoint. Keeps the env-presence guards and wires the production
// Supabase + Stripe clients into the pure handler in core.ts. Unit tests
// live in __tests__/core.test.ts and use injected Deps so they don't need
// Deno, Postgres, or a live Stripe key.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "npm:stripe@12.18.0";
import {
  asNonEmptyStringOrNull,
  corsHeaders,
  type Deps,
  handleRequest,
  json,
} from "./core.ts";

const APP_ID = "mercy_blade";
const PROVIDER = "stripe";

function env(name: string): string {
  return (Deno.env.get(name) ?? "").trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

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

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const deps: Deps = {
    async getUserFromToken(token) {
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

      if (authError || !user?.id) return null;
      return { id: user.id };
    },

    async getSubscriptionLookup(userId) {
      const { data: subscription, error: subError } = await supabaseAdmin
        .from("subscriptions")
        .select("id,status,provider")
        .eq("user_id", userId)
        .eq("app_id", APP_ID)
        .eq("provider", PROVIDER)
        .in("status", ["active", "trialing", "past_due", "canceled"])
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) return { ok: false, error: subError.message };
      return { ok: true, hasSubscription: !!subscription };
    },

    async getStripeCustomerId(userId) {
      const { data: profileById } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

      let stripeCustomerId = asNonEmptyStringOrNull(
        profileById?.stripe_customer_id,
      );

      if (!stripeCustomerId) {
        const { data: profileByUserId } = await supabaseAdmin
          .from("profiles")
          .select("stripe_customer_id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        stripeCustomerId = asNonEmptyStringOrNull(
          profileByUserId?.stripe_customer_id,
        );
      }

      return stripeCustomerId;
    },

    async createPortalSession(customerId) {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2022-11-15",
        httpClient: Stripe.createFetchHttpClient(),
      });

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: appUrl,
      });

      return { url: session.url };
    },
  };

  return handleRequest(req, deps);
});
