import {
  audio,
  asString,
  getHeader,
  envValue,
  json,
  optionsResponse,
  readJsonBody,
  type NetlifyEvent,
} from "./_shared/http";

type TtsBody = {
  text?: string;
  voiceId?: string;
  voice_id?: string;
  language?: string;
};

const AZURE_VI_VN_VOICE_ID = "vi-VN-HoaiMyNeural";

function isVietnameseLanguage(language: string): boolean {
  return language.toLowerCase().split("-")[0] === "vi";
}

function parseAudioDataUrl(value: unknown): Buffer | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:audio\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) return null;
  return Buffer.from(match[1], "base64");
}

// mercy-tts returns audio as a data:audio;base64 URL (fresh synth) OR a public
// Storage URL (https://.../room-audio/tts-cache/...mp3) for a CACHE HIT. Resolve
// BOTH to bytes — a data-URL-only reader rejects every cache hit as "no audio".
async function resolveAudioBytes(
  value: unknown,
): Promise<{ bytes: Buffer; contentType: string } | null> {
  if (typeof value !== "string" || !value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const res = await fetch(value);
      if (!res.ok) return null;
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length === 0) return null;
      return { bytes, contentType: res.headers.get("content-type") || "audio/mpeg" };
    } catch {
      return null;
    }
  }
  const bytes = parseAudioDataUrl(value);
  return bytes && bytes.length > 0 ? { bytes, contentType: "audio/mpeg" } : null;
}

// One classified call to mercy-tts. The Azure leg flaps (cold isolate /
// transient ElevenLabs fallback / brief 5xx), so a single shot surfaces those
// as a hard failure. "retryable" = worth one more attempt at warm Azure;
// "fatal" = a 4xx (auth/validation) a retry can't fix. Mirrors functions/api/tts.ts.
type TtsAttempt =
  | { kind: "audio"; bytes: Buffer; contentType: string; provider: string; fallbackReason?: string }
  | { kind: "retryable"; error: string; code?: string; provider?: string; fallbackReason?: string }
  | { kind: "fatal"; status: number; error: string; code?: string };

async function callMercyTtsOnce(args: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  authHeader: string;
  text: string;
  upstreamLanguage: string;
  voiceId: string;
  isVietnamese: boolean;
}): Promise<TtsAttempt> {
  const { supabaseUrl, supabaseAnonKey, authHeader, text, upstreamLanguage, voiceId, isVietnamese } = args;
  let upstream: Response;
  try {
    upstream = await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/mercy-tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apikey: supabaseAnonKey,
        Authorization: authHeader,
      },
      body: JSON.stringify({
        text,
        language: upstreamLanguage,
        // Vietnamese must stay on Azure vi-VN. Never forward a legacy English
        // voice into the Vietnamese path.
        voice_id: voiceId,
      }),
    });
  } catch {
    return { kind: "retryable", error: "mercy-tts request failed" };
  }

  const payload = await upstream.json().catch(() => null) as {
    audioUrl?: unknown;
    provider?: string;
    fallback_reason?: string;
    error?: string;
    code?: string;
  } | null;

  if (!upstream.ok || !payload) {
    const transient = !upstream.ok ? upstream.status >= 500 || upstream.status === 429 : true;
    const error = payload?.error || `mercy-tts ${upstream.status}`;
    return transient
      ? { kind: "retryable", error, code: payload?.code }
      : { kind: "fatal", status: upstream.status, error, code: payload?.code };
  }

  if (isVietnamese && payload.provider !== "azure") {
    return {
      kind: "retryable",
      error: "Vietnamese TTS requires Azure vi-VN",
      provider: payload.provider,
      fallbackReason: payload.fallback_reason,
    };
  }

  const resolved = await resolveAudioBytes(payload.audioUrl);
  if (!resolved) {
    return {
      kind: "retryable",
      error: payload.error || "mercy-tts returned no playable audio",
      provider: payload.provider,
      fallbackReason: payload.fallback_reason,
    };
  }

  return {
    kind: "audio",
    bytes: resolved.bytes,
    contentType: resolved.contentType,
    provider: payload.provider || "unknown",
    fallbackReason: payload.fallback_reason,
  };
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") return optionsResponse();
  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
  }

  try {
    const supabaseUrl = envValue("SUPABASE_URL") || envValue("VITE_SUPABASE_URL");
    const supabaseAnonKey = envValue("SUPABASE_ANON_KEY") || envValue("VITE_SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ ok: false, error: "Missing Supabase environment variables" }, 503);
    }

    const body = readJsonBody<TtsBody>(event);
    const text = asString(body.text, 2000);
    const language = asString(body.language, 20) || "en";
    const requestedVoiceId = asString(body.voice_id || body.voiceId, 100);
    const isVietnamese = isVietnameseLanguage(language);

    if (!text) return json({ ok: false, error: "Missing text" }, 400);

    const incomingAuth = getHeader(event, "authorization");
    const callArgs = {
      supabaseUrl,
      supabaseAnonKey,
      authHeader: incomingAuth || `Bearer ${supabaseAnonKey}`,
      text,
      upstreamLanguage: isVietnamese ? "vi-VN" : language,
      voiceId: isVietnamese ? AZURE_VI_VN_VOICE_ID : requestedVoiceId,
      isVietnamese,
    };

    // Retry once on the transient Azure/edge flap before giving up.
    let attempt = await callMercyTtsOnce(callArgs);
    if (attempt.kind === "retryable") {
      attempt = await callMercyTtsOnce(callArgs);
    }

    if (attempt.kind === "audio") {
      return audio(attempt.bytes, {
        "Content-Type": attempt.contentType,
        "X-TTS-Provider": attempt.provider,
        ...(attempt.fallbackReason ? { "X-TTS-Fallback-Reason": attempt.fallbackReason } : {}),
      });
    }

    // NEVER a raw/hard 502: a 4xx auth/validation passes through as itself;
    // everything else is a typed RETRYABLE 503 the client can re-press.
    if (attempt.kind === "fatal") {
      return json({ ok: false, error: attempt.error, code: attempt.code, retryable: false }, attempt.status);
    }
    return json({
      ok: false,
      retryable: true,
      error: attempt.error,
      code: attempt.code,
      provider: attempt.provider,
      fallback_reason: attempt.fallbackReason,
    }, 503);
  } catch {
    return json({ ok: false, retryable: true, error: "TTS proxy failed" }, 503);
  }
}
