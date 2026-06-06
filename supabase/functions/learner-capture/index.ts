// supabase/functions/learner-capture/index.ts
//
// Track 2 — Learner interaction capture (anonymized, consent-gated).
//
// Trust boundary for the capture pipeline. The browser never sends a
// raw user_id and never holds the HMAC pepper:
//
//   1. Resolve the user from the request JWT (anon-key getUser).
//   2. Re-check consent server-side against public.learning_data_consent
//      (defense in depth — the client checks too, but this is the
//      authoritative gate).
//   3. Compute learner_hash = HMAC-SHA256(user_id, LEARNER_CAPTURE_PEPPER).
//      Optionally session_hash from a client-supplied session id.
//   4. Scrub PII (emails / UUIDs / long digit runs / URLs) from the
//      free-text fields before they touch the table.
//   5. INSERT one append-only row with the service-role client.
//
// Never stores raw user_id, never stores audio. Returns a small JSON
// status; failures are logged and returned as { ok:false } — capture is
// best-effort and must never surface an error to the learner.
//
// Required env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
//               LEARNER_CAPTURE_PEPPER.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  clampScore,
  hmacHex,
  sanitizeRuleIds,
  scrubPii,
} from "./sanitize.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const pepper = Deno.env.get("LEARNER_CAPTURE_PEPPER") ?? "";

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const INTERACTION_TYPES = new Set(["correction", "pronunciation", "conversation"]);
const CORRECTION_STATUSES = new Set(["corrected", "unchanged", "needs_ai", "abstained"]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function resolveUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user) return null;
  // Anonymous Supabase users never get captured.
  if ((data.user as { is_anonymous?: boolean | null }).is_anonymous === true) return null;
  return data.user.id;
}

async function hasConsent(userId: string): Promise<boolean> {
  const { data, error } = await adminClient
    .from("learning_data_consent")
    .select("consented")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return false;
  return data.consented === true;
}

async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  if (!pepper) {
    console.warn("[learner-capture] LEARNER_CAPTURE_PEPPER unset — refusing to write");
    return json({ ok: false, error: "pepper_unset" }, 500);
  }

  const userId = await resolveUserId(req);
  if (!userId) return json({ ok: true, skipped: true, reason: "anon" });

  if (!(await hasConsent(userId))) {
    return json({ ok: true, skipped: true, reason: "no_consent" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const interactionType = String(payload.interaction_type ?? "");
  if (!INTERACTION_TYPES.has(interactionType)) {
    return json({ ok: false, error: "bad_interaction_type" }, 400);
  }

  const correctionStatusRaw =
    payload.correction_status == null ? null : String(payload.correction_status);
  const correctionStatus =
    correctionStatusRaw && CORRECTION_STATUSES.has(correctionStatusRaw)
      ? correctionStatusRaw
      : null;

  const learnerHash = await hmacHex(userId, pepper);
  const sessionId = typeof payload.session_id === "string" ? payload.session_id : "";
  const sessionHash = sessionId ? await hmacHex(sessionId, pepper) : null;

  const clientTs =
    typeof payload.client_ts === "string" && !Number.isNaN(new Date(payload.client_ts).getTime())
      ? new Date(payload.client_ts).toISOString()
      : null;

  const row = {
    learner_hash: learnerHash,
    session_hash: sessionHash,
    interaction_type: interactionType,
    target_language: typeof payload.target_language === "string" ? payload.target_language.slice(0, 12) : null,
    explain_language: typeof payload.explain_language === "string" ? payload.explain_language.slice(0, 12) : null,
    input_text: scrubPii(payload.input_text),
    correction_status: correctionStatus,
    applied_rule_ids: sanitizeRuleIds(payload.applied_rule_ids),
    corrected_text: scrubPii(payload.corrected_text),
    pron_overall_score: clampScore(payload.pron_overall_score),
    pron_word_scores: payload.pron_word_scores ?? null,
    pron_tone_scores: payload.pron_tone_scores ?? null,
    audio_retained: false,
    client_ts: clientTs,
    consent_version: typeof payload.consent_version === "string" ? payload.consent_version.slice(0, 32) : null,
  };

  try {
    const { data, error } = await adminClient
      .from("learner_interaction_capture")
      .insert(row)
      .select("id")
      .single();
    if (error) {
      console.warn("[learner-capture] insert failed:", error.message);
      return json({ ok: false, error: error.message }, 500);
    }
    return json({ ok: true, skipped: false, id: (data as { id: string } | null)?.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[learner-capture] insert threw:", message);
    return json({ ok: false, error: message }, 500);
  }
}

serve(handle);
