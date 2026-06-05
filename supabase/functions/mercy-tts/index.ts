// PATH: supabase/functions/mercy-tts/index.ts
//
// Cloud text-to-speech for Teacher Mercy. Azure Cognitive Services TTS is the
// PRIMARY provider when azure_tts is enabled and configured (native VN neural
// voice; shares the AZURE_SPEECH_* secrets that already power VN pronunciation).
// ElevenLabs remains the fallback when elevenlabs_tts is enabled and configured,
// so a single provider failure cannot 502. Browser TTS stays as the client
// fallback path inside src/lib/teacher-mercy/voiceEngine.ts.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  trackLatency,
  trackLatencyMs,
  type LatencyStatus,
} from "../_shared/latencyTelemetry.ts";
import {
  azureVoiceFor,
  synthesizeAzureTts,
} from "./azureProvider.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const PER_USER_DAILY_CAP = 50;
const GLOBAL_DAILY_CAP = 1000;
const MAX_TEXT_LENGTH = 2000;

const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
};

interface MercyTtsRequest {
  text: string;
  voice_id?: string;
  language?: string;
}

type TtsProvider = "azure" | "elevenlabs";

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

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function audioDataUrl(bytes: Uint8Array): string {
  return `data:audio/mpeg;base64,${bytesToBase64(bytes)}`;
}

function normalizeLanguage(raw: unknown): string {
  const base = String(raw || "en").trim().toLowerCase().split("-")[0];
  return ["en", "fr", "zh", "de", "ja", "ko", "es", "vi"].includes(base) ? base : "en";
}

async function isFlagOn(
  client: SupabaseClient,
  flagKey: string,
  userId?: string | null,
): Promise<boolean> {
  const { data, error } = await client
    .from("feature_flags")
    .select("is_enabled, enabled_user_ids")
    .eq("flag_key", flagKey)
    .maybeSingle();
  if (error || !data) return false;
  const cohort = Array.isArray(data.enabled_user_ids) ? data.enabled_user_ids : [];
  if (userId && cohort.includes(userId)) return true;
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
    return Number.MAX_SAFE_INTEGER;
  }
  return count ?? 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const totalStartedAt = performance.now();
  let totalStatus: LatencyStatus = "success";

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let userId: string | null = null;
    if (authHeader) {
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    let body: MercyTtsRequest;
    try {
      body = (await req.json()) as MercyTtsRequest;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const text = String(body?.text ?? "").trim();
    const language = normalizeLanguage(body?.language);
    const rawVoiceId = String(body?.voice_id ?? "").trim();
    const voiceId = rawVoiceId && rawVoiceId !== "placeholder" ? rawVoiceId : "";

    if (!text) return jsonResponse({ error: "text is required" }, 400);
    if (text.length > MAX_TEXT_LENGTH) {
      return jsonResponse({ error: `text exceeds ${MAX_TEXT_LENGTH} chars` }, 400);
    }

    const azureFlagOn = await isFlagOn(service, "azure_tts", userId);
    const elevenLabsFlagOn = await isFlagOn(service, "elevenlabs_tts", userId);
    const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
    const azureRegion = Deno.env.get("AZURE_SPEECH_REGION") ?? "";
    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY") ?? "";
    const fallbackReasons: string[] = [];

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [userCount, globalCount] = await Promise.all([
      userId ? countUsageSince(service, since, userId) : Promise.resolve(0),
      countUsageSince(service, since),
    ]);
    if (userId && userCount >= PER_USER_DAILY_CAP) {
      return jsonResponse({ error: "Daily TTS limit reached for this user", code: "cap_user" }, 429);
    }
    if (globalCount >= GLOBAL_DAILY_CAP) {
      return jsonResponse({ error: "Daily TTS limit reached globally", code: "cap_global" }, 429);
    }

    let provider: TtsProvider | null = null;
    let audioBuf: Uint8Array | null = null;
    let textHash = "";
    let usageVoiceId = "";

    if (azureFlagOn && azureKey && azureRegion) {
      const azureStartedAt = performance.now();
      const azureVoice = azureVoiceFor(language);
      try {
        const azureResp = await synthesizeAzureTts(fetch, azureKey, azureRegion, text, language);
        trackLatencyMs("mercy-tts.azure-call", performance.now() - azureStartedAt, {
          status: azureResp.ok ? "success" : "error",
          metadata: { upstream_status: azureResp.status, voice: azureVoice.name },
        });
        if (azureResp.ok) {
          audioBuf = new Uint8Array(await azureResp.arrayBuffer());
          provider = "azure";
          usageVoiceId = `azure:${azureVoice.name}`;
          textHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
        } else {
          const detail = await azureResp.text().catch(() => "");
          console.error("[mercy-tts] Azure TTS error", azureResp.status, detail.slice(0, 200));
          fallbackReasons.push(`azure_${azureResp.status}`);
        }
      } catch (err) {
        trackLatencyMs("mercy-tts.azure-call", performance.now() - azureStartedAt, { status: "error" });
        console.error("[mercy-tts] Azure TTS threw", err);
        fallbackReasons.push("azure_error");
      }
    } else {
      if (!azureFlagOn) fallbackReasons.push("azure_tts_flag_off");
      else if (!azureKey) fallbackReasons.push("azure_key_missing");
      else fallbackReasons.push("azure_region_missing");
    }

    if (!audioBuf && elevenLabsFlagOn && elevenLabsKey && voiceId) {
      const elStartedAt = performance.now();
      let elResp: Response;
      try {
        elResp = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
          method: "POST",
          headers: {
            "xi-api-key": elevenLabsKey,
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
        trackLatencyMs("mercy-tts.elevenlabs-call", performance.now() - elStartedAt, { status: "error" });
        console.error("[mercy-tts] ElevenLabs threw", err);
        fallbackReasons.push("elevenlabs_error");
        elResp = new Response("", { status: 599 });
      }
      trackLatencyMs("mercy-tts.elevenlabs-call", performance.now() - elStartedAt, {
        status: elResp.ok ? "success" : "error",
        metadata: { upstream_status: elResp.status },
      });

      if (elResp.ok) {
        audioBuf = new Uint8Array(await elResp.arrayBuffer());
        provider = "elevenlabs";
        usageVoiceId = voiceId;
        textHash = await sha256Hex(`elevenlabs|${voiceId}|${language}|${text}`);
      } else {
        const detail = await elResp.text().catch(() => "");
        console.error("[mercy-tts] ElevenLabs error", elResp.status, detail.slice(0, 200));
        fallbackReasons.push(`elevenlabs_${elResp.status}`);
      }
    } else if (!audioBuf) {
      if (!elevenLabsFlagOn) fallbackReasons.push("elevenlabs_flag_off");
      else if (!elevenLabsKey) fallbackReasons.push("elevenlabs_key_missing");
      else if (!voiceId) fallbackReasons.push("elevenlabs_voice_missing");
    }

    if (!audioBuf || !provider) {
      totalStatus = "error";
      const fallbackReason = fallbackReasons.join(",");
      trackLatency({
        operation: "mercy-tts.total",
        startedAt: totalStartedAt,
        status: totalStatus,
        metadata: { cache_hit: false, fallback_reason: fallbackReason },
      });
      return jsonResponse({
        error: "Cloud TTS unavailable",
        code: "provider_unavailable",
        provider: null,
        fallback_reason: fallbackReason,
      }, 502);
    }

    const { error: usageErr } = await service.from("mercy_tts_usage").insert({
      user_id: userId,
      text_hash: textHash,
      voice_id: usageVoiceId,
      language,
      text_length: text.length,
    });
    if (usageErr) console.warn("[mercy-tts] usage insert failed", usageErr.message);

    trackLatency({
      operation: "mercy-tts.total",
      startedAt: totalStartedAt,
      status: totalStatus,
      metadata: { cache_hit: false, provider },
    });
    return jsonResponse({
      audioUrl: audioDataUrl(audioBuf),
      cached: false,
      provider,
      fallback_reason: fallbackReasons.length ? fallbackReasons.join(",") : undefined,
    });
  } catch (err) {
    console.error("[mercy-tts] unexpected error", err);
    totalStatus = "error";
    trackLatency({
      operation: "mercy-tts.total",
      startedAt: totalStartedAt,
      status: totalStatus,
      metadata: { cache_hit: false },
    });
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500,
    );
  }
});
