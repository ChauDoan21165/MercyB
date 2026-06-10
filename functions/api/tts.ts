import {
  audio,
  asString,
  envValue,
  json,
  optionsResponse,
  readJsonBody,
  type PagesContext,
} from "../../src/pages-functions/http";

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

function parseAudioDataUrl(value: unknown): Uint8Array | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:audio\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) return null;
  try {
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    // Malformed base64 — treat as "no playable audio" (transient), never throw.
    return null;
  }
}

// One call to the Supabase mercy-tts edge function, classified so the caller can
// decide whether to retry. The Azure leg flaps (cold isolate / transient
// fallback to ElevenLabs / brief 5xx), so a single shot surfaces those as a hard
// failure. "retryable" = worth one more attempt at a likely-warm Azure; "fatal"
// = a 4xx (auth/validation) a retry can't fix.
type TtsAttempt =
  | { kind: "audio"; bytes: Uint8Array; provider: string; fallbackReason?: string }
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
    // Network/subrequest failure on the CF -> Supabase hop — transient.
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
    // 5xx / 429 / a 200 with an unparseable body are transient; a 4xx with a
    // parseable body is a real client/auth error that won't fix on retry.
    const transient = !upstream.ok ? upstream.status >= 500 || upstream.status === 429 : true;
    const error = payload?.error || `mercy-tts ${upstream.status}`;
    return transient
      ? { kind: "retryable", error, code: payload?.code }
      : { kind: "fatal", status: upstream.status, error, code: payload?.code };
  }

  if (isVietnamese && payload.provider !== "azure") {
    // Azure vi-VN fell back / failed for this call; a retry may hit warm Azure.
    return {
      kind: "retryable",
      error: "Vietnamese TTS requires Azure vi-VN",
      provider: payload.provider,
      fallbackReason: payload.fallback_reason,
    };
  }

  const bytes = parseAudioDataUrl(payload.audioUrl);
  if (!bytes || bytes.length === 0) {
    return {
      kind: "retryable",
      error: payload.error || "mercy-tts returned no playable audio",
      provider: payload.provider,
      fallbackReason: payload.fallback_reason,
    };
  }

  return { kind: "audio", bytes, provider: payload.provider || "unknown", fallbackReason: payload.fallback_reason };
}

export function onRequestOptions(): Response {
  return optionsResponse();
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const { request, env } = context;
    const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
    const supabaseAnonKey = envValue(env, "SUPABASE_ANON_KEY") || envValue(env, "VITE_SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ ok: false, error: "Missing Supabase environment variables" }, 503);
    }

    const body = await readJsonBody<TtsBody>(request);
    const text = asString(body.text, 2000);
    const language = asString(body.language, 20) || "en";
    const requestedVoiceId = asString(body.voice_id || body.voiceId, 100);
    const isVietnamese = isVietnameseLanguage(language);

    if (!text) return json({ ok: false, error: "Missing text" }, 400);

    const incomingAuth = request.headers.get("authorization") || "";
    const callArgs = {
      supabaseUrl,
      supabaseAnonKey,
      authHeader: incomingAuth || `Bearer ${supabaseAnonKey}`,
      text,
      upstreamLanguage: isVietnamese ? "vi-VN" : language,
      voiceId: isVietnamese ? AZURE_VI_VN_VOICE_ID : requestedVoiceId,
      isVietnamese,
    };

    // Retry once on the transient Azure/edge flap before giving up. This is what
    // turns the prod 502 flap into a recovered 200 on the common cold-start case.
    let attempt = await callMercyTtsOnce(callArgs);
    if (attempt.kind === "retryable") {
      attempt = await callMercyTtsOnce(callArgs);
    }

    if (attempt.kind === "audio") {
      return audio(attempt.bytes, {
        "X-TTS-Provider": attempt.provider,
        ...(attempt.fallbackReason ? { "X-TTS-Fallback-Reason": attempt.fallbackReason } : {}),
      });
    }

    // NEVER surface a raw/hard 502. A 4xx auth/validation error passes through as
    // itself; everything else is a typed RETRYABLE 503 the client can re-press.
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
    // Final safety net: an unexpected throw must never become a raw platform 502.
    return json({ ok: false, retryable: true, error: "TTS proxy failed" }, 503);
  }
}
