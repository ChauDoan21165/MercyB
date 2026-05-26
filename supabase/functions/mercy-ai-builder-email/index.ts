// PATH: supabase/functions/mercy-ai-builder-email/index.ts
// VERSION: v2026-01-06.aib.3 (local/prod env-safe: SUPABASE_ANON_KEY fallback; builder finished/failed -> email; JWT required)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { triggerEmailBestEffort } from "../_shared/emailTriggers.ts";

// ---------------------------
// CORS
// ---------------------------
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  return String(x ?? "").trim();
}

function requireBearerJwt(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  return token;
}

function toStringRecord(x: unknown): Record<string, string> {
  if (!x || typeof x !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(x as Record<string, unknown>)) {
    if (typeof k !== "string") continue;
    out[k] = normalize(v);
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY") || env("ANON_KEY"); // for auth.getUser(jwt)

  if (!supabaseUrl || !anonKey) {
    return json(
      {
        error: "Supabase not configured (need SUPABASE_URL, SUPABASE_ANON_KEY/ANON_KEY)",
        have: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!env("SUPABASE_ANON_KEY"),
          ANON_KEY: !!env("ANON_KEY"),
        },
      },
      500,
    );
  }

  const token = requireBearerJwt(req);
  if (!token) return json({ error: "Missing Bearer JWT" }, 401);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // This can be whatever your builder uses.
  // Example: "job_finished", "job_failed", "invite", etc.
  const trigger = normalize(body?.trigger) || "job_finished";
  const correlationId = normalize(body?.correlation_id) || normalize(body?.job_id) || undefined;

  const supabaseAuth = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });

  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
  const user = userData?.user;

  if (userErr || !user?.id) {
    return json({ error: "Invalid JWT", detail: userErr?.message ?? "No user" }, 401);
  }

  const userEmail =
    typeof user.email === "string" && user.email.trim() ? user.email.trim() : "";

  if (!userEmail) {
    return json({ error: "User missing email" }, 400);
  }

  // Map triggers -> templates (aligned with emailTemplates.ts contract)
  // builder_finished expects: job_id, output_url (optional), logs_url (optional)
  // builder_failed expects: job_id, error, logs_url (optional)
  let templateKey = "notification";
  let variables: Record<string, string> = {};

  if (trigger === "job_finished") {
    templateKey = "builder_finished";

    // Accept multiple upstream names; normalize to output_url contract
    const outputUrl =
      normalize(body?.output_url) ||
      normalize(body?.result_url) ||
      normalize(body?.outputUrl) ||
      "";

    variables = {
      job_id: normalize(body?.job_id),
      output_url: outputUrl,
      logs_url: normalize(body?.logs_url) || normalize(body?.logsUrl) || "",
      // keep optional extra fields for fallback/debugging (template may ignore)
      project_name: normalize(body?.project_name),
    };
  } else if (trigger === "job_failed") {
    templateKey = "builder_failed";

    variables = {
      job_id: normalize(body?.job_id),
      error: normalize(body?.error),
      logs_url: normalize(body?.logs_url) || normalize(body?.logsUrl) || "",
      project_name: normalize(body?.project_name),
    };
  } else {
    templateKey = "notification";
    variables = toStringRecord(body?.variables);
  }

  // Best-effort send (outbox + provider handled inside sendEmail via triggerEmailBestEffort)
  const r = await triggerEmailBestEffort({
    to: userEmail,
    appKey: "mercy_ai_builder",
    templateKey,
    variables,
    correlationId,
  });

  return json({
    ok: true,
    emailed: !!r?.ok,
    to: userEmail,
    templateKey,
    correlationId: correlationId ?? null,
  });
});
