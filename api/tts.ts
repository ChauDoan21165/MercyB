// File: api/tts.ts
// Vercel (recovery-host) TTS endpoint. Kept in lock-step with the primary
// Netlify handler (netlify/functions/api-tts.ts) and the Cloudflare Pages
// handler (functions/api/tts.ts) so a failover to Vercel cannot silently
// breach Product Contract C1 (docs/PRODUCT-CONTRACT.md):
//   - Vietnamese text MUST be read by an Azure vi-VN voice. Never an English
//     ElevenLabs voice.
//   - The Supabase `mercy-tts` edge function is the single voice authority
//     (Azure-primary, ElevenLabs fallback for non-vi). This proxy never picks
//     a provider itself and never falls back to a robotic device voice.
// Frontend POSTs { text, language?, voice_id? } and receives audio/* bytes
// plus X-TTS-Provider / X-TTS-Fallback-Reason headers.

import type { VercelRequest, VercelResponse } from "@vercel/node";

type TtsBody = {
  text?: string;
  voiceId?: string;
  voice_id?: string;
  language?: string;
};

const AZURE_VI_VN_VOICE_ID = "vi-VN-HoaiMyNeural";

function parseBody(req: VercelRequest): TtsBody {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (req.body && typeof req.body === "object") return req.body as TtsBody;
  return {};
}

function asString(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isVietnameseLanguage(language: string): boolean {
  return language.toLowerCase().split("-")[0] === "vi";
}

// mercy-tts returns audio as a `data:audio/<mime>;base64,...` URL. Decode it to
// raw bytes and recover the concrete mime so the response Content-Type stays
// honest (audio/mpeg, audio/ogg, …) and always matches /^audio\//.
function parseAudioDataUrl(value: unknown): { bytes: Buffer; mime: string } | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:(audio\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) return null;
  return { mime: match[1], bytes: Buffer.from(match[2], "base64") };
}

// mercy-tts returns audio as a data:audio;base64 URL (fresh synth) OR a public
// Storage URL (https://.../room-audio/tts-cache/...mp3) for a CACHE HIT. Resolve
// BOTH to bytes — a data-URL-only reader rejects every cache hit as "no audio".
async function resolveAudioBytes(value: unknown): Promise<{ bytes: Buffer; mime: string } | null> {
  if (typeof value !== "string" || !value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const res = await fetch(value);
      if (!res.ok) return null;
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length === 0) return null;
      return { bytes, mime: res.headers.get("content-type") || "audio/mpeg" };
    } catch {
      return null;
    }
  }
  const decoded = parseAudioDataUrl(value);
  return decoded && decoded.bytes.length > 0 ? decoded : null;
}

// One classified call to mercy-tts. The Azure leg flaps (cold isolate /
// transient ElevenLabs fallback / brief 5xx), so a single shot surfaces those
// as a hard failure. "retryable" = worth one more attempt at warm Azure;
// "fatal" = a 4xx (auth/validation) a retry can't fix.
type TtsAttempt =
  | { kind: "audio"; bytes: Buffer; mime: string; provider: string; fallbackReason?: string }
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
  } catch (err) {
    console.warn("[tts] mercy-tts request threw", err);
    return { kind: "retryable", error: "mercy-tts request failed" };
  }

  const payload = (await upstream.json().catch(() => null)) as {
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

  const decoded = await resolveAudioBytes(payload.audioUrl);
  if (!decoded) {
    return {
      kind: "retryable",
      error: payload.error || "mercy-tts returned no playable audio",
      provider: payload.provider,
      fallbackReason: payload.fallback_reason,
    };
  }

  return { kind: "audio", bytes: decoded.bytes, mime: decoded.mime, provider: payload.provider || "unknown", fallbackReason: payload.fallback_reason };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, apikey, x-client-info");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(503).json({ ok: false, error: "Missing Supabase environment variables" });
  }

  const body = parseBody(req);
  const text = asString(body.text, 2000);
  const language = asString(body.language, 20) || "en";
  const requestedVoiceId = asString(body.voice_id || body.voiceId, 100);
  const isVietnamese = isVietnameseLanguage(language);
  const upstreamLanguage = isVietnamese ? "vi-VN" : language;

  if (!text) return res.status(400).json({ ok: false, error: "Missing text" });

  const incomingAuth = asString(req.headers.authorization, 4000);
  const callArgs = {
    supabaseUrl,
    supabaseAnonKey,
    authHeader: incomingAuth || `Bearer ${supabaseAnonKey}`,
    text,
    upstreamLanguage,
    voiceId: isVietnamese ? AZURE_VI_VN_VOICE_ID : requestedVoiceId,
    isVietnamese,
  };

  try {
    // Retry once on the transient Azure/edge flap before giving up, so the prod
    // cold-start flap recovers to a 200 instead of surfacing a hard failure.
    let attempt = await callMercyTtsOnce(callArgs);
    if (attempt.kind === "retryable") {
      attempt = await callMercyTtsOnce(callArgs);
    }

    if (attempt.kind === "audio") {
      res.setHeader("Content-Type", attempt.mime || "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-TTS-Provider", attempt.provider);
      if (attempt.fallbackReason) res.setHeader("X-TTS-Fallback-Reason", attempt.fallbackReason);
      return res.status(200).send(attempt.bytes);
    }

    // NEVER a raw/hard 502: a 4xx auth/validation error passes through as itself;
    // everything else is a typed RETRYABLE 503 the client can re-press.
    if (attempt.kind === "fatal") {
      return res.status(attempt.status).json({ ok: false, error: attempt.error, code: attempt.code, retryable: false });
    }
    return res.status(503).json({
      ok: false,
      retryable: true,
      error: attempt.error,
      code: attempt.code,
      provider: attempt.provider,
      fallback_reason: attempt.fallbackReason,
    });
  } catch (err) {
    console.warn("[tts] handler threw", err);
    return res.status(503).json({ ok: false, retryable: true, error: "TTS proxy failed" });
  }
}
