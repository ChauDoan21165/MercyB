/**
 * email-unsubscribe — Edge Function
 *
 * The server endpoint behind the List-Unsubscribe header. RFC 8058
 * one-click unsubscribe requires a URL that processes an unauthenticated
 * POST WITHOUT running JavaScript — Gmail / Apple Mail POST it directly
 * and never execute the SPA. mercyblade.com/unsubscribe is a
 * client-rendered React route (vercel.json rewrites all paths to
 * index.html), so the mail client gets a 200 but the token is never
 * redeemed. This function closes that gap.
 *
 * Routing (see ./decision.ts):
 *   POST    → redeem: call public.unsubscribe_by_token(token); always
 *             return 200 text/plain (RFC 8058 — the client ignores the
 *             body, it only needs a 2xx). Never leak whether the token
 *             matched.
 *   GET/HEAD→ 302 to the human /unsubscribe?token= page. GET is
 *             state-neutral on purpose: URL scanners / link-preview
 *             bots fetch List-Unsubscribe URLs and must not be able to
 *             unsubscribe a user by accident.
 *   OPTIONS → CORS preflight.
 *   other   → 405.
 *
 * verify_jwt = false (config.toml): the opaque per-user token IS the
 * credential, exactly like the unsubscribe_by_token RPC's anon grant.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { buildUnsubscribeUrl, SITE_ORIGIN } from "../_shared/unsubscribe.ts";
import { extractToken, planResponse } from "./decision.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  const plan = planResponse(req.method);

  if (plan.kind === "cors") {
    return new Response(null, { headers: corsHeaders });
  }

  if (plan.kind === "method_not_allowed") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (plan.kind === "redirect") {
    // Human (or scanner) followed the URL — hand off to the SPA
    // confirmation page, which also offers per-category management.
    // No state change here.
    const token = extractToken({ url: req.url });
    const location = token
      ? buildUnsubscribeUrl(token)
      : `${SITE_ORIGIN}/account/notifications`;
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: location },
    });
  }

  // plan.kind === "redeem" — the RFC 8058 one-click POST.
  // Always answer 200 text/plain; the mail client discards the body.
  const ok200 = (msg: string) =>
    new Response(msg, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });

  let formBody: string | null = null;
  try {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      formBody = await req.text();
    }
  } catch {
    formBody = null;
  }

  const token = extractToken({ url: req.url, formBody });
  if (!token) {
    console.warn("[email-unsubscribe] one-click POST with no usable token");
    // Still 200 — never surface an error to the mail client UI.
    return ok200("OK");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    console.error(
      "[email-unsubscribe] missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
    );
    // Don't 500 to the mail client — log loudly, ack so it doesn't retry
    // forever, and let monitoring catch the misconfig.
    return ok200("OK");
  }

  try {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await admin.rpc("unsubscribe_by_token", {
      p_token: token,
    });

    if (error) {
      console.error("[email-unsubscribe] RPC error:", error.message);
      return ok200("OK");
    }

    const row = Array.isArray(data) ? data[0] : data;
    const succeeded = Boolean((row as { ok?: boolean } | null)?.ok);
    const message =
      (row as { message?: string } | null)?.message ?? "unknown";
    console.log(
      `[email-unsubscribe] redeem ok=${succeeded} message=${message}`,
    );
    return ok200(succeeded ? "Unsubscribed." : "OK");
  } catch (e) {
    console.error(
      "[email-unsubscribe] unexpected error:",
      e instanceof Error ? e.message : e,
    );
    return ok200("OK");
  }
});
