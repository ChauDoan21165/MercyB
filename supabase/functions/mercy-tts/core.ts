import {
  azureVoiceFor,
  synthesizeAzureTts,
} from "./azureProvider.ts";
import { failureJsonResponse } from "../_shared/failureLog.ts";

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const PER_USER_DAILY_CAP = 50;
const GLOBAL_DAILY_CAP = 1000;
const MAX_TEXT_LENGTH = 2000;
// 9000ms (was 6500) — Azure Neural TTS cold starts can exceed 6.5s on the first
// call after idle, tripping azure_timeout and the VI "chưa sẵn sàng" fallback.
// Wider budget absorbs the cold start; warm calls return well under it.
const AZURE_TIMEOUT_MS = 9000;

// Storage cache for finalized Azure model audio. Reusing the existing PUBLIC
// `room-audio` bucket (service-role write, no RLS/schema change) so repeated
// finalized content — "Mercy đọc" and the self-compare "Nghe mẫu rồi nghe bạn"
// — serves the SAME Mercy voice from cache: reliable, cap-proof, no Azure call.
const TTS_CACHE_BUCKET = "room-audio";
const TTS_CACHE_PREFIX = "tts-cache";

const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface MercyTtsRequest {
  text: string;
  voice_id?: string;
  language?: string;
}

type TtsProvider = "azure" | "elevenlabs";

type EnvGetter = (key: string) => string | undefined;
type LatencyStatus = "success" | "error" | "timeout";

type SupabaseLike = {
  auth?: { getUser: () => Promise<{ data: { user?: { id?: string | null } | null } }> };
  from: (table: string) => any;
  // Optional so test doubles without storage simply skip the cache (no-op).
  storage?: { from: (bucket: string) => any };
};

export interface MercyTtsDeps {
  createClient: (url: string, key: string, options?: unknown) => SupabaseLike;
  env: EnvGetter;
  fetcher: typeof fetch;
  now?: () => number;
  trackLatency?: (args: {
    operation: string;
    startedAt: number;
    status?: LatencyStatus;
    metadata?: Record<string, unknown>;
  }) => void;
  trackLatencyMs?: (
    operation: string,
    durationMs: number,
    options?: { status?: LatencyStatus; metadata?: Record<string, unknown> },
  ) => void;
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
  client: SupabaseLike,
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
  service: SupabaseLike,
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

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

function contentTypeLooksAudio(response: Response): boolean {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  return contentType === "" || contentType.startsWith("audio/");
}

function bytesLookLikeAudio(bytes: Uint8Array): boolean {
  if (bytes.length === 0) return false;
  if (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true;
  if (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return true;
  return false;
}

function validateProviderAudio(response: Response, bytes: Uint8Array): string | null {
  if (bytes.length === 0) return "empty_audio";
  if (!contentTypeLooksAudio(response)) return "invalid_content_type";
  if (!bytesLookLikeAudio(bytes)) return "invalid_audio_bytes";
  return null;
}

async function withTimeout<T>(
  ms: number,
  task: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await task(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

function cachePathFor(hash: string): string {
  return `${TTS_CACHE_PREFIX}/${hash}.mp3`;
}

// Returns a public URL if finalized Azure audio for this hash is already cached.
// Best-effort: any error (no storage, missing object, network) returns null so
// the caller falls through to live synthesis. Never throws.
async function getCachedAzureAudioUrl(
  service: SupabaseLike,
  hash: string,
): Promise<string | null> {
  const bucket = service.storage?.from(TTS_CACHE_BUCKET);
  if (!bucket) return null;
  try {
    const { data, error } = await bucket.list(TTS_CACHE_PREFIX, {
      search: `${hash}.mp3`,
      limit: 1,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const { data: pub } = bucket.getPublicUrl(cachePathFor(hash));
    return pub?.publicUrl ?? null;
  } catch (err) {
    console.warn("[mercy-tts] cache lookup failed", err);
    return null;
  }
}

// Best-effort write of freshly synthesized Azure audio into the cache. Never
// throws; a failed upload just means the next request re-synthesizes.
async function cacheAzureAudio(
  service: SupabaseLike,
  hash: string,
  bytes: Uint8Array,
): Promise<void> {
  const bucket = service.storage?.from(TTS_CACHE_BUCKET);
  if (!bucket) return;
  try {
    await bucket.upload(cachePathFor(hash), bytes, {
      contentType: "audio/mpeg",
      upsert: true,
    });
  } catch (err) {
    console.warn("[mercy-tts] cache upload failed", err);
  }
}

export async function handleMercyTtsRequest(req: Request, deps: MercyTtsDeps): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return failureJsonResponse(req, "mercy-tts", "tts", 405, "method_not_allowed", {
      error: "Method not allowed",
    }, corsHeaders);
  }

  const totalStartedAt = performance.now();
  let totalStatus: LatencyStatus = "success";
  const trackLatency = deps.trackLatency ?? (() => {});
  const trackLatencyMs = deps.trackLatencyMs ?? (() => {});

  try {
    const SUPABASE_URL = deps.env("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = deps.env("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = deps.env("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    const service = deps.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let userId: string | null = null;
    if (authHeader) {
      const userClient = deps.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    let body: MercyTtsRequest;
    try {
      body = (await req.json()) as MercyTtsRequest;
    } catch {
      return failureJsonResponse(req, "mercy-tts", "tts", 400, "invalid_json", {
        error: "Invalid JSON body",
      }, corsHeaders);
    }

    const text = String(body?.text ?? "").trim();
    const language = normalizeLanguage(body?.language);
    const rawVoiceId = String(body?.voice_id ?? "").trim();
    const voiceId = rawVoiceId && rawVoiceId !== "placeholder" ? rawVoiceId : "";

    if (!text) {
      return failureJsonResponse(req, "mercy-tts", "tts", 400, "missing_text", {
        error: "text is required",
      }, corsHeaders);
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return failureJsonResponse(req, "mercy-tts", "tts", 400, "text_too_long", {
        error: `text exceeds ${MAX_TEXT_LENGTH} chars`,
      }, corsHeaders, { maxTextLength: MAX_TEXT_LENGTH });
    }

    const azureFlagOn = await isFlagOn(service, "azure_tts", userId);
    const elevenLabsFlagOn = await isFlagOn(service, "elevenlabs_tts", userId);
    const azureKey = deps.env("AZURE_SPEECH_KEY") ?? "";
    const azureRegion = deps.env("AZURE_SPEECH_REGION") ?? "";
    const elevenLabsKey = deps.env("ELEVENLABS_API_KEY") ?? "";
    const fallbackReasons: string[] = [];

    // Cache lookup BEFORE caps/synthesis: a cached finalized Azure clip is
    // served reliably even when the daily caps are reached, with no Azure call.
    let azureCacheHash = "";
    if (azureFlagOn && azureKey && azureRegion && service.storage) {
      const azureVoice = azureVoiceFor(language);
      azureCacheHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
      const cachedUrl = await getCachedAzureAudioUrl(service, azureCacheHash);
      if (cachedUrl) {
        trackLatency({
          operation: "mercy-tts.total",
          startedAt: totalStartedAt,
          status: "success",
          metadata: { cache_hit: true, provider: "azure" },
        });
        return jsonResponse({ audioUrl: cachedUrl, cached: true, provider: "azure" });
      }
    }

    const now = deps.now?.() ?? Date.now();
    const since = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const [userCount, globalCount] = await Promise.all([
      userId ? countUsageSince(service, since, userId) : Promise.resolve(0),
      countUsageSince(service, since),
    ]);
    if (userId && userCount >= PER_USER_DAILY_CAP) {
      return failureJsonResponse(req, "mercy-tts", "tts", 429, "user_daily_cap", {
        error: "Daily TTS limit reached for this user",
        code: "cap_user",
      }, corsHeaders);
    }
    if (globalCount >= GLOBAL_DAILY_CAP) {
      return failureJsonResponse(req, "mercy-tts", "tts", 429, "global_daily_cap", {
        error: "Daily TTS limit reached globally",
        code: "cap_global",
      }, corsHeaders);
    }

    let provider: TtsProvider | null = null;
    let audioBuf: Uint8Array | null = null;
    let textHash = "";
    let usageVoiceId = "";

    if (azureFlagOn && azureKey && azureRegion) {
      const azureStartedAt = performance.now();
      const azureVoice = azureVoiceFor(language);
      try {
        const azureResp = await withTimeout(AZURE_TIMEOUT_MS, (signal) =>
          synthesizeAzureTts(deps.fetcher, azureKey, azureRegion, text, language, signal)
        );
        trackLatencyMs("mercy-tts.azure-call", performance.now() - azureStartedAt, {
          status: azureResp.ok ? "success" : "error",
          metadata: { upstream_status: azureResp.status, voice: azureVoice.name },
        });
        if (azureResp.ok) {
          const azureBuf = new Uint8Array(await azureResp.arrayBuffer());
          const invalidReason = validateProviderAudio(azureResp, azureBuf);
          if (invalidReason) {
            console.error("[mercy-tts] Azure TTS invalid audio", invalidReason);
            fallbackReasons.push(`azure_${invalidReason}`);
          } else {
            audioBuf = azureBuf;
            provider = "azure";
            usageVoiceId = `azure:${azureVoice.name}`;
            textHash = await sha256Hex(`azure|${azureVoice.name}|${language}|${text}`);
          }
        } else {
          const detail = await azureResp.text().catch(() => "");
          console.error("[mercy-tts] Azure TTS error", azureResp.status, detail.slice(0, 200));
          fallbackReasons.push(`azure_${azureResp.status}`);
        }
      } catch (err) {
        trackLatencyMs("mercy-tts.azure-call", performance.now() - azureStartedAt, { status: "error" });
        console.error("[mercy-tts] Azure TTS threw", err);
        fallbackReasons.push(isAbortError(err) ? "azure_timeout" : "azure_error");
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
        elResp = await deps.fetcher(`${ELEVENLABS_BASE}/${voiceId}`, {
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
      return failureJsonResponse(req, "mercy-tts", "tts", 502, "provider_unavailable", {
        error: "Cloud TTS unavailable",
        code: "provider_unavailable",
        provider: null,
        fallback_reason: fallbackReason,
      }, corsHeaders, { fallbackReason });
    }

    const { error: usageErr } = await service.from("mercy_tts_usage").insert({
      user_id: userId,
      text_hash: textHash,
      voice_id: usageVoiceId,
      language,
      text_length: text.length,
    });
    if (usageErr) console.warn("[mercy-tts] usage insert failed", usageErr.message);

    // Persist finalized Azure audio so the next identical request is cap-proof.
    if (provider === "azure" && azureCacheHash) {
      await cacheAzureAudio(service, azureCacheHash, audioBuf);
    }

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
    totalStatus = "error";
    trackLatency({
      operation: "mercy-tts.total",
      startedAt: totalStartedAt,
      status: totalStatus,
      metadata: { cache_hit: false },
    });
    return failureJsonResponse(req, "mercy-tts", "tts", 500, "unexpected_error", {
      error: err instanceof Error ? err.message : "Unknown error",
    }, corsHeaders);
  }
}
