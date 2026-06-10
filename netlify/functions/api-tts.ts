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

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") return optionsResponse();
  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
  }

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
  const upstreamLanguage = isVietnamese ? "vi-VN" : language;

  if (!text) return json({ ok: false, error: "Missing text" }, 400);

  const incomingAuth = getHeader(event, "authorization");
  const authHeader = incomingAuth || `Bearer ${supabaseAnonKey}`;

  const upstream = await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/mercy-tts`, {
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
      voice_id: isVietnamese ? AZURE_VI_VN_VOICE_ID : requestedVoiceId,
    }),
  });

  const payload = await upstream.json().catch(() => null) as {
    audioUrl?: unknown;
    provider?: string;
    fallback_reason?: string;
    error?: string;
    code?: string;
  } | null;

  if (!upstream.ok || !payload) {
    return json({
      ok: false,
      error: payload?.error || `mercy-tts ${upstream.status}`,
      code: payload?.code,
    }, upstream.ok ? 502 : upstream.status);
  }

  if (isVietnamese && payload.provider !== "azure") {
    return json({
      ok: false,
      error: "Vietnamese TTS requires Azure vi-VN",
      provider: payload.provider,
      fallback_reason: payload.fallback_reason,
    }, 502);
  }

  const bytes = parseAudioDataUrl(payload.audioUrl);
  if (!bytes || bytes.length === 0) {
    return json({
      ok: false,
      error: payload.error || "mercy-tts returned no playable audio",
      provider: payload.provider,
      fallback_reason: payload.fallback_reason,
    }, 502);
  }

  return audio(bytes, {
    "X-TTS-Provider": payload.provider || "unknown",
    ...(payload.fallback_reason ? { "X-TTS-Fallback-Reason": payload.fallback_reason } : {}),
  });
}
