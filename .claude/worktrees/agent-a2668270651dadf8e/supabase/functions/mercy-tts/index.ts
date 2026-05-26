// PATH: supabase/functions/mercy-tts/index.ts
//
// ElevenLabs-backed text-to-speech for Teacher Mercy. Browser TTS still
// works as the fallback path inside src/hooks/useMercyVoice.ts; this
// function is the cloud upgrade that produces a warm Vietnamese-accented
// voice when the elevenlabs_tts feature flag is on.
//
// Request:
//   POST { text: string, voice_id?: string, language: 'vi' | 'en' }
//
// Response (success):
//   { audioUrl: string, cached: boolean }
//
// Response (capped or blocked):
//   { error: string, code?: 'flag_off' | 'cap_user' | 'cap_global' }
//   — caller falls back to browser TTS on any non-2xx.
//
// Cost controls:
//   - SHA-256 cache key on (text + voice_id). Cache hits skip ElevenLabs
//     entirely. Each unique text is paid for exactly once, ever.
//   - Daily caps enforced via mercy_tts_usage row count (last 24h):
//       per-user: 50 paid renders / day
//       global:   1000 paid renders / day  (≈ $3 / day at Creator)
//     Cache hits are NOT counted — only the paid generations.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  trackLatency,
  trackLatencyMs,
  type LatencyStatus,
} from "../_shared/latencyTelemetry.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CACHE_BUCKET = "mercy-tts-cache";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const PER_USER_DAILY_CAP = 50;
const GLOBAL_DAILY_CAP = 1000;
const MAX_TEXT_LENGTH = 2000; // ElevenLabs hard limit varies by tier; keep us safe

// Voice settings mirror the client config. Kept in sync intentionally
// (small block — no module sharing across function boundaries on Deno).
const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
};

interface MercyTtsRequest {
  text: string;
  voice_id?: string;
  language: "vi" | "en";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Resolution mirrors src/hooks/useFeatureFlag.ts and
 * src/lib/featureFlags.ts — keep all three in sync.
 *   1. enabled_user_ids contains userId → ON
 *   2. is_enabled = true                → ON
 *   3. otherwise                        → OFF
 */
async function isFlagOn(
  client: SupabaseClient,
  flagKey: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from("feature_flags")
    .select("is_enabled, enabled_user_ids")
    .eq("flag_key", flagKey)
    .maybeSingle();
  if (error || !data) return false;
  const cohort = Array.isArray(data.enabled_user_ids) ? data.enabled_user_ids : [];
  if (cohort.includes(userId)) return true;
  return !!data.is_enabled;
}

async function countUsageSince(
  service: SupabaseClient,
  sinceIso: string,
  userId?: string,
): Promise<number> {
  let query = service
    .from("mercy_tts_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceIso);
  if (userId) query = query.eq("user_id", userId);
  const { count, error } = await query;
  if (error) {
    console.warn("[mercy-tts] usage count failed", error.message);
    // Fail closed for caps — assume we're at the limit so the caller
    // falls back to browser TTS rather than racking up surprise spend.
    return Number.MAX_SAFE_INTEGER;
  }
  return count ?? 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const totalStartedAt = performance.now();
  let totalStatus: LatencyStatus = "success";
  let cacheHit = false;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: "Invalid authentication" }, 401);
    }

    const flagOn = await isFlagOn(userClient, "elevenlabs_tts", user.id);
    if (!flagOn) {
      return jsonResponse(
        { error: "ElevenLabs TTS disabled", code: "flag_off" },
        503,
      );
    }

    let body: MercyTtsRequest;
    try {
      body = (await req.json()) as MercyTtsRequest;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const text = String(body?.text ?? "").trim();
    const language = body?.language === "en" ? "en" : "vi";
    const voiceId = String(body?.voice_id ?? "").trim();

    if (!text) return jsonResponse({ error: "text is required" }, 400);
    if (text.length > MAX_TEXT_LENGTH) {
      return jsonResponse(
        { error: `text exceeds ${MAX_TEXT_LENGTH} chars` },
        400,
      );
    }
    if (!voiceId) return jsonResponse({ error: "voice_id is required" }, 400);

    // Service-role client for storage writes + usage counts (bypasses RLS).
    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const cacheKey = await sha256Hex(`${voiceId}|${language}|${text}`);
    const cachePath = `${cacheKey}.mp3`;

    // Cache hit? Public bucket → public URL is signature-free.
    const { data: existing } = await service.storage
      .from(CACHE_BUCKET)
      .list("", { search: cachePath, limit: 1 });
    if (existing && existing.some((f) => f.name === cachePath)) {
      const { data: pub } = service.storage.from(CACHE_BUCKET).getPublicUrl(cachePath);
      cacheHit = true;
      const cachedResp = jsonResponse({ audioUrl: pub.publicUrl, cached: true });
      trackLatency({
        operation: "mercy-tts.total",
        startedAt: totalStartedAt,
        status: totalStatus,
        metadata: { cache_hit: true },
      });
      return cachedResp;
    }

    // Cache miss → enforce daily caps before paying ElevenLabs.
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [userCount, globalCount] = await Promise.all([
      countUsageSince(service, since, user.id),
      countUsageSince(service, since),
    ]);
    if (userCount >= PER_USER_DAILY_CAP) {
      return jsonResponse(
        { error: "Daily TTS limit reached for this user", code: "cap_user" },
        429,
      );
    }
    if (globalCount >= GLOBAL_DAILY_CAP) {
      return jsonResponse(
        { error: "Daily TTS limit reached globally", code: "cap_global" },
        429,
      );
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      console.warn("[mercy-tts] ELEVENLABS_API_KEY missing — falling back");
      return jsonResponse(
        { error: "ElevenLabs not configured", code: "flag_off" },
        503,
      );
    }

    const elStartedAt = performance.now();
    let elStatus: LatencyStatus = "success";
    let elResp: Response;
    try {
      elResp = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: VOICE_SETTINGS,
        }),
      });
    } catch (err) {
      elStatus = "error";
      trackLatencyMs(
        "mercy-tts.elevenlabs-call",
        performance.now() - elStartedAt,
        { status: elStatus },
      );
      throw err;
    }
    if (!elResp.ok) elStatus = "error";
    trackLatencyMs(
      "mercy-tts.elevenlabs-call",
      performance.now() - elStartedAt,
      {
        status: elStatus,
        metadata: { upstream_status: elResp.status },
      },
    );

    if (!elResp.ok) {
      const detail = await elResp.text().catch(() => "");
      console.error("[mercy-tts] ElevenLabs error", elResp.status, detail.slice(0, 200));
      totalStatus = "error";
      const errResp = jsonResponse(
        { error: "Upstream TTS failed", upstream_status: elResp.status },
        502,
      );
      trackLatency({
        operation: "mercy-tts.total",
        startedAt: totalStartedAt,
        status: totalStatus,
        metadata: { cache_hit: false, upstream_status: elResp.status },
      });
      return errResp;
    }

    const audioBuf = new Uint8Array(await elResp.arrayBuffer());

    const { error: uploadErr } = await service.storage
      .from(CACHE_BUCKET)
      .upload(cachePath, audioBuf, {
        contentType: "audio/mpeg",
        upsert: false,
      });
    if (uploadErr && !/already exists/i.test(uploadErr.message)) {
      console.error("[mercy-tts] cache upload failed", uploadErr.message);
      // Don't fail the request — we already paid ElevenLabs. Best effort.
    }

    // Log usage AFTER successful render so a failed upstream call doesn't
    // count against the user's cap.
    const { error: usageErr } = await service.from("mercy_tts_usage").insert({
      user_id: user.id,
      text_hash: cacheKey,
      voice_id: voiceId,
      language,
      text_length: text.length,
    });
    if (usageErr) {
      console.warn("[mercy-tts] usage insert failed", usageErr.message);
    }

    const { data: pub } = service.storage.from(CACHE_BUCKET).getPublicUrl(cachePath);
    const okResp = jsonResponse({ audioUrl: pub.publicUrl, cached: false });
    trackLatency({
      operation: "mercy-tts.total",
      startedAt: totalStartedAt,
      status: totalStatus,
      metadata: { cache_hit: cacheHit },
    });
    return okResp;
  } catch (err) {
    console.error("[mercy-tts] unexpected error", err);
    totalStatus = "error";
    trackLatency({
      operation: "mercy-tts.total",
      startedAt: totalStartedAt,
      status: totalStatus,
      metadata: { cache_hit: cacheHit },
    });
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500,
    );
  }
});
