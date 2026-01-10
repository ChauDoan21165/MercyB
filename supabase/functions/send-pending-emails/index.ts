// supabase/functions/send-pending-emails/index.ts
// v2 — 2026-01-05 (fix: safe error handling + normalize variables to strings)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail } from "../_shared/sendEmail.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

function errMsg(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function normalizeVars(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    out[k] = v == null ? "" : String(v);
  }
  return out;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") return json({ ok: true }, 200);

  // Force POST (so you don't accidentally trigger from browser GET)
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return json(
      {
        ok: false,
        error:
          "Missing env: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (Edge Function secrets).",
      },
      500,
    );
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  const { data: emails, error } = await supabase
    .from("email_outbox")
    .select("id,to_email,template_key,variables,created_at")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(5);

  if (error) return json({ ok: false, error }, 500);

  let sent = 0;
  let failed = 0;

  for (const email of emails ?? []) {
    try {
      await sendEmail({
        to: String(email.to_email),
        templateKey: String(email.template_key),
        variables: normalizeVars(email.variables),
      });

      await supabase
        .from("email_outbox")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", email.id);

      sent++;
    } catch (err) {
      await supabase
        .from("email_outbox")
        .update({
          status: "failed",
          error_message: errMsg(err),
        })
        .eq("id", email.id);

      failed++;
    }
  }

  return json(
    { ok: true, processed: emails?.length ?? 0, sent, failed },
    200,
  );
});
