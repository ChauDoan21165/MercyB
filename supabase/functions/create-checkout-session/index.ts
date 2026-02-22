// PATH: supabase/functions/create-checkout-session/index.ts
// VERSION: v2026-01-06.1 (add user.email to Stripe metadata; keep Stripe customer email in sync best-effort)
//
// CHANGE SUMMARY:
// - Add `email: user.email` to BOTH:
//   - checkout session metadata
//   - subscription_data.metadata
// - Best-effort: set Stripe customer email when creating customer and when reusing existing customer.
//   (Never blocks checkout if update fails.)
//
// PATCH (2026-02-21):
// - ✅ DB-FIRST price mapping for stability:
//   - Prefer subscription_tiers.stripe_price_id IF the column exists & is populated
//   - Otherwise fallback to STRIPE_PRICE_VIP1/3/9 secrets (since your current schema does NOT expose stripe_price_id)
// - Avoid selecting non-existent columns (vip_key / stripe_price_id) which hard-fail in PostgREST.
// - Stronger error messages + logs when no usable price id can be resolved.

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

/**
 * Env mapping (used as fallback when DB does not contain stripe_price_id).
 */
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

function inferVipKeyFromTierRow(tier: any): "vip1" | "vip3" | "vip9" | null {
  // 1) name-based inference (most stable)
  const name = String(tier?.name ?? "").toLowerCase();
  const m = name.match(/\bvip\s*([139])\b/);
  if (m?.[1] === "1") return "vip1";
  if (m?.[1] === "3") return "vip3";
  if (m?.[1] === "9") return "vip9";

  // 2) price-based inference (works with your current visible schema)
  const pm = tier?.price_monthly;
  const n =
    typeof pm === "number"
      ? pm
      : typeof pm === "string"
        ? Number(pm)
        : NaN;
  if (Number.isFinite(n)) {
    // these match your working Stripe checkouts: VIP1=$5, VIP3=$12, VIP9=$25
    if (n === 5) return "vip1";
    if (n === 12) return "vip3";
    if (n === 25) return "vip9";
  }

  // 3) display order heuristic (last resort)
  const d = tier?.display_order;
  const di =
    typeof d === "number" ? d : typeof d === "string" ? Number(d) : NaN;
  if (Number.isFinite(di)) {
    // If you ever used 1/3/9 as display_order
    if (di === 1) return "vip1";
    if (di === 3) return "vip3";
    if (di === 9) return "vip9";
  }

  return null;
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
    // PATCH: also accept tier_key / vip_key (common client payloads)
    const tierId = typeof body?.tier_id === "string" ? body.tier_id : "";

    const tierKeyRaw =
      typeof body?.tier === "string"
        ? normalize(body.tier)
        : typeof body?.tier_key === "string"
          ? normalize(body.tier_key)
          : typeof body?.vip_key === "string"
            ? normalize(body.vip_key)
            : "";

    if (!tierId && !tierKeyRaw) {
      return json({ error: "tier_id or tier/tier_key/vip_key is required" }, 400);
    }

    // Normalize tierKey to vip1/vip3/vip9 if provided
    let vipKey: "vip1" | "vip3" | "vip9" | "" = "";
    if (tierKeyRaw) {
      const k = tierKeyRaw.replace(/^vip\s*/i, "vip");
      if (k === "vip1" || k === "vip3" || k === "vip9") vipKey = k as any;
      else return json({ error: "Tier is not purchasable" }, 400);
    }

    // SERVER TRUTH: tier record comes from DB
    // IMPORTANT: your current schema does NOT include vip_key/stripe_price_id, so do NOT select them.
    // Use select("*") so we can feature-detect optional fields safely across environments.
    const tierQuery = supabaseAdmin.from("subscription_tiers").select("*").limit(1);

    const { data: tier, error: tierErr } = tierId
      ? await tierQuery.eq("id", tierId).maybeSingle()
      : // If client only sends vip_key, we cannot DB-filter by vip_key unless the column exists.
        // So we fall back to matching by name heuristics after fetching active tiers.
        await supabaseAdmin
          .from("subscription_tiers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(50);

    if (tierErr) {
      return json(
        { error: "Tier lookup failed", detail: tierErr?.message ?? "query error" },
        500,
      );
    }

    let tierRow: any = null;
    if (tierId) {
      tierRow = tier;
      if (!tierRow) {
        return json({ error: "Unknown tier", detail: "not found" }, 400);
      }
    } else {
      // We have a list of tiers; pick best match by vipKey inference.
      const rows = Array.isArray(tier) ? tier : [];
      const matches = rows
        .map((r) => ({ r, inferred: inferVipKeyFromTierRow(r) }))
        .filter((x) => x.inferred === vipKey);

      tierRow = matches[0]?.r ?? null;

      if (!tierRow) {
        return json(
          {
            error: "Unknown tier",
            detail:
              "Could not match vip_key to a DB tier row (check subscription_tiers.name/price_monthly/display_order)",
          },
          400,
        );
      }
    }

    // If vipKey not provided by client, infer it from DB tier row
    if (!vipKey) {
      const inferred = inferVipKeyFromTierRow(tierRow);
      if (!inferred) {
        return json(
          {
            error: "Tier is not purchasable",
            detail:
              "Unable to infer vip_key from subscription_tiers row (need VIP1/VIP3/VIP9 name, or price_monthly 5/12/25)",
          },
          400,
        );
      }
      vipKey = inferred;
    }

    // ✅ Price resolution:
    // - Prefer DB field stripe_price_id IF present (some environments may have it)
    // - Fallback to env mapping (current production behavior that we proved works)
    const dbPriceId =
      typeof (tierRow as any)?.stripe_price_id === "string"
        ? (tierRow as any).stripe_price_id.trim()
        : "";

    const envPriceId = vipKeyToEnvPrice(vipKey);

    const priceId = dbPriceId || envPriceId || "";

    if (!priceId) {
      console.error("[create-checkout-session] Missing price id", {
        tier_id: (tierRow as any).id,
        tier_name: (tierRow as any).name,
        vip_key: vipKey,
        db_has_stripe_price_id: "stripe_price_id" in (tierRow as any),
        env_have: {
          STRIPE_PRICE_VIP1: !!env("STRIPE_PRICE_VIP1"),
          STRIPE_PRICE_VIP3: !!env("STRIPE_PRICE_VIP3"),
          STRIPE_PRICE_VIP9: !!env("STRIPE_PRICE_VIP9"),
        },
      });
      return json(
        {
          error: "Missing Stripe price id",
          detail: {
            tier_id: (tierRow as any).id,
            vip_key: vipKey,
            db_has_stripe_price_id: "stripe_price_id" in (tierRow as any),
            have_env_prices: {
              vip1: !!env("STRIPE_PRICE_VIP1"),
              vip3: !!env("STRIPE_PRICE_VIP3"),
              vip9: !!env("STRIPE_PRICE_VIP9"),
            },
          },
        },
        500,
      );
    }

    // Read stripe_customer_id (optional)
    // PATCH: profiles can key by id OR user_id depending on legacy rows
    const { data: prof, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .or(`id.eq.${user.id},user_id.eq.${user.id}`)
      .limit(1)
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
      // PATCH: update row regardless of whether it’s keyed by id or user_id
      const { error: profUpErr } = await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .or(`id.eq.${user.id},user_id.eq.${user.id}`);

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
          tier_id: (tierRow as any).id,
          vip_key: vipKey,
          period: "monthly",
          email: userEmail || undefined,
        },
        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
            tier_id: (tierRow as any).id,
            vip_key: vipKey,
            period: "monthly",
            email: userEmail || undefined,
          },
        },
      });
    } catch (e) {
      console.error(
        "[create-checkout-session] stripe.checkout.sessions.create failed:",
        e,
      );
      return json(
        { error: "Stripe checkout session create failed", detail: errToObj(e) },
        500,
      );
    }

    // Record pending tx (audit/debug)
    const txPayload: Record<string, unknown> = {
      user_id: user.id,
      tier_id: (tierRow as any).id,
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
      console.error(
        "[create-checkout-session] payment_transactions upsert failed:",
        txErr,
      );
      return json(
        { error: "Failed to write payment_transactions", detail: txErr.message },
        500,
      );
    }

    // PATCH: include ok + some useful echo fields, but keep checkout_url for existing clients
    return json({
      ok: true,
      checkout_url: session.url,
      tier_id: (tierRow as any).id,
      vip_key: vipKey,
    });
  } catch (e) {
    // final safety net: never return plain text 500 again
    console.error("[create-checkout-session] UNCAUGHT:", e);
    return json({ error: "Internal error", detail: errToObj(e) }, 500);
  }
});