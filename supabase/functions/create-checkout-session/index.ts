// PATH: supabase/functions/create-checkout-session/index.ts
// VERSION: v2026-01-06.1 (add user.email to Stripe metadata; keep Stripe customer email in sync best-effort)
//
// CHANGE SUMMARY:
// - Add `email: user.email` to BOTH:
//   - checkout session metadata
//   - subscription_data.metadata
// - Best-effort: set Stripe customer email when creating customer and when reusing existing customer.
//   (Never blocks checkout if update fails.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno&no-dts";

// ---------------------------
// CORS
// ---------------------------
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function env(name: string) {
  return (Deno.env.get(name) ?? "").trim();
}

function normalize(x: unknown) {
  return String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function vipKeyToEnvPrice(vipKey: string): string | null {
  const k = normalize(vipKey);
  if (k === "vip1") return env("STRIPE_PRICE_VIP1") || null;
  if (k === "vip3") return env("STRIPE_PRICE_VIP3") || null;
  if (k === "vip9") return env("STRIPE_PRICE_VIP9") || null;
  return null;
}

function getBaseUrl(req: Request): string {
  const siteUrl = env("SITE_URL") || env("FRONTEND_URL");
  if (siteUrl) return siteUrl.replace(/\/+$/, "");

  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  try {
    const u = new URL(origin);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "http://localhost:5173";
  }
}

function errToObj(e: unknown) {
  const anyE = e as any;
  return {
    name: anyE?.name,
    message: anyE?.message ?? String(e),
    stack: anyE?.stack,
    cause: anyE?.cause,
  };
}

Deno.serve(async (req) => {
  // Always answer CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const stripeSecretKey = env("STRIPE_SECRET_KEY");
    const supabaseUrl = env("SUPABASE_URL");

    // IMPORTANT:
    // Supabase Edge Functions does NOT allow setting secrets starting with SUPABASE_ in CLI.
    // Store anon key as ANON_KEY (you already did: supabase secrets set ANON_KEY=...)
    const anonKey = env("ANON_KEY");
    const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json(
        {
          error:
            "Supabase not configured (need SUPABASE_URL, ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)",
          have: {
            SUPABASE_URL: !!supabaseUrl,
            ANON_KEY: !!anonKey,
            SUPABASE_SERVICE_ROLE_KEY: !!serviceRoleKey,
          },
        },
        500,
      );
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) return json({ error: "Missing Bearer JWT" }, 401);

    // Stripe client (wrap in try in case Stripe lib breaks in runtime)
    let stripe: Stripe;
    try {
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
        httpClient: Stripe.createFetchHttpClient(),
      });
    } catch (e) {
      console.error("[create-checkout-session] Stripe init failed:", e);
      return json({ error: "Stripe init failed", detail: errToObj(e) }, 500);
    }

    // ✅ Client A: verify user JWT using anon key
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(
      token,
    );

    const user = userData?.user;
    if (userErr || !user?.id) {
      return json(
        { error: "Invalid JWT", detail: userErr?.message ?? "No user" },
        401,
      );
    }

    // ✅ Client B: service role for DB reads/writes
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    // Accept either tier_id OR tier (VIP1/VIP3/VIP9)
    const tierId = typeof body?.tier_id === "string" ? body.tier_id : "";
    const tierKey = typeof body?.tier === "string" ? normalize(body.tier) : "";

    if (!tierId && !tierKey) {
      return json({ error: "tier_id or tier is required" }, 400);
    }

    // SERVER TRUTH: tier record comes from DB
    const tierQuery = supabaseAdmin
      .from("subscription_tiers")
      .select("id, name, vip_key, stripe_price_id")
      .limit(1);

    const { data: tier, error: tierErr } = tierId
      ? await tierQuery.eq("id", tierId).maybeSingle()
      : await tierQuery.eq("vip_key", tierKey).maybeSingle();

    if (tierErr || !tier) {
      return json(
        { error: "Unknown tier", detail: tierErr?.message ?? "not found" },
        400,
      );
    }

    const vipKey = normalize((tier as any).vip_key);
    if (vipKey !== "vip1" && vipKey !== "vip3" && vipKey !== "vip9") {
      return json({ error: "Tier is not purchasable" }, 400);
    }

    const dbPriceId =
      typeof (tier as any).stripe_price_id === "string"
        ? (tier as any).stripe_price_id
        : "";
    const priceId = dbPriceId || vipKeyToEnvPrice(vipKey);

    if (!priceId) {
      return json(
        { error: "Tier missing stripe_price_id (and no env fallback)" },
        500,
      );
    }

    // Read stripe_customer_id (optional)
    const { data: prof, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    // If profiles table/column missing, DO NOT crash — just treat as no customer.
    if (profErr) {
      console.warn(
        "[create-checkout-session] profiles read warning:",
        profErr.message,
      );
    }

    let stripeCustomerId =
      typeof (prof as any)?.stripe_customer_id === "string"
        ? (prof as any).stripe_customer_id
        : null;

    const userEmail =
      typeof user.email === "string" && user.email.trim() ? user.email.trim() : "";

    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: userEmail || undefined,
          metadata: { supabase_user_id: user.id },
        });
        stripeCustomerId = customer.id;
      } catch (e) {
        console.error("[create-checkout-session] stripe.customers.create failed:", e);
        return json(
          { error: "Stripe customer create failed", detail: errToObj(e) },
          500,
        );
      }

      // best-effort store it (do not fail checkout if this write fails)
      const { error: profUpErr } = await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (profUpErr) {
        console.warn(
          "[create-checkout-session] profiles update warning:",
          profUpErr.message,
        );
      }
    } else {
      // Best-effort: keep Stripe customer email in sync (never block checkout)
      if (userEmail) {
        try {
          await stripe.customers.update(stripeCustomerId, { email: userEmail });
        } catch (e) {
          console.warn(
            "[create-checkout-session] stripe.customers.update email warning:",
            e,
          );
        }
      }
    }

    const baseUrl = getBaseUrl(req);
    const success_url =
      typeof body?.success_url === "string" && body.success_url
        ? body.success_url
        : `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url =
      typeof body?.cancel_url === "string" && body.cancel_url
        ? body.cancel_url
        : `${baseUrl}/billing`;

    let session: any;
    try {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        client_reference_id: user.id,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url,
        cancel_url,
        metadata: {
          supabase_user_id: user.id,
          tier_id: (tier as any).id,
          vip_key: vipKey,
          period: "monthly",
          email: userEmail || undefined,
        },
        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
            tier_id: (tier as any).id,
            vip_key: vipKey,
            period: "monthly",
            email: userEmail || undefined,
          },
        },
      });
    } catch (e) {
      console.error("[create-checkout-session] stripe.checkout.sessions.create failed:", e);
      return json(
        { error: "Stripe checkout session create failed", detail: errToObj(e) },
        500,
      );
    }

    // Record pending tx (audit/debug)
    const txPayload: Record<string, unknown> = {
      user_id: user.id,
      tier_id: (tier as any).id,
      external_reference: session.id, // used for onConflict
      status: "pending",
      transaction_type: "subscription",
      payment_method: "stripe",
      amount: 0,
      currency: "usd",
      metadata: {
        vip_key: vipKey,
        stripe_customer_id: stripeCustomerId,
        stripe_checkout_session_id: session.id,
        price_id: priceId,
      },
    };

    const { error: txErr } = await supabaseAdmin
      .from("payment_transactions")
      .upsert(txPayload, { onConflict: "external_reference" });

    if (txErr) {
      console.error("[create-checkout-session] payment_transactions upsert failed:", txErr);
      return json(
        { error: "Failed to write payment_transactions", detail: txErr.message },
        500,
      );
    }

    return json({ checkout_url: session.url });
  } catch (e) {
    // final safety net: never return plain text 500 again
    console.error("[create-checkout-session] UNCAUGHT:", e);
    return json({ error: "Internal error", detail: errToObj(e) }, 500);
  }
});
