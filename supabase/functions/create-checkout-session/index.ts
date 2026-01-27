// PATH: supabase/functions/create-checkout-session/index.ts
// VERSION: v2026-01-06.3+auth-by-service-role-jwt-tolerant-url-safe +OBS-2026-01-27
//
// OBSERVABILITY PATCH (LOCKED INTENT):
// - Add request_id (x-mb-request-id) to every response + console logs.
// - Add Access-Control-Expose-Headers so browser can read x-mb-request-id.
// - Optional debug payload returned ONLY when body.debug===true/"1" (safe: no secrets).
// - Keep existing auth + URL safety + Stripe session creation behavior.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno&no-dts";

// ---------------------------
// CORS
// ---------------------------
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-mb-user-jwt, x-mb-request-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  // ✅ allow browser to read our correlation id header
  "Access-Control-Expose-Headers": "x-mb-request-id",
};

function json(payload: unknown, status = 200, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, ...(extraHeaders || {}), "Content-Type": "application/json" },
  });
}

function env(name: string) {
  return (Deno.env.get(name) ?? "").trim();
}

function normalize(x: unknown) {
  return String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * JWT extraction (tolerant)
 */
function extractJwt(req: Request): string {
  const auth = req.headers.get("authorization") || "";
  const raw = req.headers.get("x-mb-user-jwt") || "";

  if (/^bearer\s+/i.test(auth)) return auth.replace(/^bearer\s+/i, "").trim();
  if (auth.split(".").length === 3) return auth.trim();
  if (raw.split(".").length === 3) return raw.trim();

  return "";
}

function vipKeyToEnvPrice(vipKey: string): string | null {
  const k = normalize(vipKey);
  if (k === "vip1") return env("STRIPE_PRICE_VIP1") || null;
  if (k === "vip3") return env("STRIPE_PRICE_VIP3") || null;
  if (k === "vip9") return env("STRIPE_PRICE_VIP9") || null;
  return null;
}

function getBaseUrl(req: Request): string {
  const site = env("SITE_URL") || env("FRONTEND_URL");
  if (site) return site.replace(/\/+$/, "");

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
  };
}

function isDebugFlag(x: unknown): boolean {
  if (x === true) return true;
  const s = String(x ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function safeMaskId(x: unknown): string {
  const s = String(x ?? "");
  if (!s) return "";
  if (s.length <= 8) return `${s.slice(0, 2)}…${s.slice(-2)}`;
  return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

Deno.serve(async (req) => {
  // ✅ correlation id (client can optionally send one; we always respond with one)
  const requestId =
    (req.headers.get("x-mb-request-id") || "").trim() ||
    (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `mb_${Date.now()}_${Math.random()}`);

  const withRid = { "x-mb-request-id": requestId };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { ...corsHeaders, ...withRid } });
  }

  const t0 = Date.now();

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed", request_id: requestId }, 405, withRid);
    }

    const stripeSecretKey = env("STRIPE_SECRET_KEY");
    const supabaseUrl = env("SUPABASE_URL");
    const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey) {
      console.error("[create-checkout-session]", requestId, "Missing STRIPE_SECRET_KEY");
      return json({ error: "Missing STRIPE_SECRET_KEY", request_id: requestId }, 500, withRid);
    }
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[create-checkout-session]", requestId, "Supabase not configured");
      return json({ error: "Supabase not configured", request_id: requestId }, 500, withRid);
    }

    // --- Body ---
    let body: any;
    try {
      body = await req.json();
    } catch {
      console.warn("[create-checkout-session]", requestId, "Invalid JSON body");
      return json({ error: "Invalid JSON body", request_id: requestId }, 400, withRid);
    }

    const debug = isDebugFlag(body?.debug);

    // --- JWT verify ---
    const token = extractJwt(req);
    if (!token) {
      console.warn("[create-checkout-session]", requestId, "Missing JWT");
      return json(
        {
          error: "Missing JWT",
          request_id: requestId,
          ...(debug
            ? {
                debug: {
                  got_auth_header: Boolean(req.headers.get("authorization")),
                  got_x_mb_user_jwt: Boolean(req.headers.get("x-mb-user-jwt")),
                },
              }
            : {}),
        },
        401,
        withRid,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !userData?.user?.id) {
      console.warn("[create-checkout-session]", requestId, "Invalid JWT", userErr?.message || "");
      return json(
        {
          error: "Invalid JWT",
          request_id: requestId,
          ...(debug
            ? {
                debug: {
                  userErr: userErr ? errToObj(userErr) : null,
                },
              }
            : {}),
        },
        401,
        withRid,
      );
    }

    const user = userData.user;

    const tierKey = typeof body?.tier === "string" ? normalize(body.tier) : "";
    const tierId = typeof body?.tier_id === "string" ? body.tier_id : "";

    if (!tierKey && !tierId) {
      console.warn("[create-checkout-session]", requestId, "tier or tier_id required");
      return json({ error: "tier or tier_id required", request_id: requestId }, 400, withRid);
    }

    const { data: tier } = tierId
      ? await supabaseAdmin.from("subscription_tiers").select("*").eq("id", tierId).maybeSingle()
      : await supabaseAdmin
          .from("subscription_tiers")
          .select("*")
          .eq("vip_key", tierKey)
          .maybeSingle();

    if (!tier) {
      console.warn("[create-checkout-session]", requestId, "Unknown tier", { tierKey, tierId });
      return json(
        {
          error: "Unknown tier",
          request_id: requestId,
          ...(debug ? { debug: { tierKey, tierId } } : {}),
        },
        400,
        withRid,
      );
    }

    const vipKey = normalize(tier.vip_key);
    if (!["vip1", "vip3", "vip9"].includes(vipKey)) {
      console.warn("[create-checkout-session]", requestId, "Tier not purchasable", vipKey);
      return json(
        { error: "Tier not purchasable", request_id: requestId, ...(debug ? { debug: { vipKey } } : {}) },
        400,
        withRid,
      );
    }

    const priceId = tier.stripe_price_id || vipKeyToEnvPrice(vipKey);
    if (!priceId) {
      console.error("[create-checkout-session]", requestId, "Missing Stripe price", vipKey);
      return json(
        {
          error: "Missing Stripe price",
          request_id: requestId,
          ...(debug ? { debug: { vipKey, hasTierStripePriceId: Boolean(tier.stripe_price_id) } } : {}),
        },
        500,
        withRid,
      );
    }

    // --- URL safety (Stripe HARD requirement) ---
    const baseUrl = getBaseUrl(req);

    // IMPORTANT: Stripe rejects empty string. Treat empty/whitespace as "not provided".
    const rawSuccess =
      typeof body?.success_url === "string" ? body.success_url.trim() : "";
    const rawCancel =
      typeof body?.cancel_url === "string" ? body.cancel_url.trim() : "";

    const success_url =
      rawSuccess && rawSuccess.startsWith("http")
        ? rawSuccess
        : `${baseUrl}/billing/success`;

    const cancel_url =
      rawCancel && rawCancel.startsWith("http")
        ? rawCancel
        : `${baseUrl}/billing`;

    // tiny log breadcrumb (no secrets)
    console.log("[create-checkout-session]", requestId, "start", {
      vipKey,
      tier_lookup: tierId ? "by_id" : "by_key",
      baseUrl,
      success_url,
      cancel_url,
      user_id: user.id,
    });

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user.email ?? undefined,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url,
        cancel_url,
        metadata: {
          user_id: user.id,
          email: user.email ?? "",
          vip_key: vipKey,
        },
        subscription_data: {
          metadata: {
            user_id: user.id,
            email: user.email ?? "",
            vip_key: vipKey,
          },
        },
      });
    } catch (e) {
      console.error("[create-checkout-session]", requestId, "Stripe create failed", e);
      return json(
        {
          error: "Internal error",
          request_id: requestId,
          detail: errToObj(e),
          ...(debug
            ? {
                debug: {
                  vipKey,
                  priceId_masked: safeMaskId(priceId),
                  baseUrl,
                  success_url,
                  cancel_url,
                  tierKey,
                  tierId,
                },
              }
            : {}),
        },
        500,
        withRid,
      );
    }

    const ms = Date.now() - t0;
    console.log("[create-checkout-session]", requestId, "ok", {
      ms,
      session_id: session?.id,
      has_url: Boolean(session?.url),
    });

    return json(
      {
        checkout_url: session.url,
        request_id: requestId,
        ...(debug
          ? {
              debug: {
                ms,
                vipKey,
                priceId_masked: safeMaskId(priceId),
                baseUrl,
                success_url,
                cancel_url,
                tierKey,
                tierId,
                user: {
                  id: user.id,
                  email: user.email ?? "",
                },
                stripe: {
                  session_id: session?.id ?? "",
                  mode: session?.mode ?? "",
                },
              },
            }
          : {}),
      },
      200,
      withRid,
    );
  } catch (e) {
    console.error("[create-checkout-session]", requestId, "UNCAUGHT", e);
    return json({ error: "Internal error", request_id: requestId, detail: errToObj(e) }, 500, {
      "x-mb-request-id": requestId,
    });
  }
});
