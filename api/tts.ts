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
  const authHeader = incomingAuth || `Bearer ${supabaseAnonKey}`;

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
        voice_id: isVietnamese ? AZURE_VI_VN_VOICE_ID : requestedVoiceId,
      }),
    });
  } catch (err) {
    console.warn("[tts] mercy-tts request threw", err);
    return res.status(502).json({ ok: false, error: "TTS proxy failed" });
  }

  const payload = (await upstream.json().catch(() => null)) as {
    audioUrl?: unknown;
    provider?: string;
    fallback_reason?: string;
    error?: string;
    code?: string;
  } | null;

  if (!upstream.ok || !payload) {
    return res.status(upstream.ok ? 502 : upstream.status).json({
      ok: false,
      error: payload?.error || `mercy-tts ${upstream.status}`,
      code: payload?.code,
    });
  }

  if (isVietnamese && payload.provider !== "azure") {
    return res.status(502).json({
      ok: false,
      error: "Vietnamese TTS requires Azure vi-VN",
      provider: payload.provider,
      fallback_reason: payload.fallback_reason,
    });
  }

  const decoded = parseAudioDataUrl(payload.audioUrl);
  if (!decoded || decoded.bytes.length === 0) {
    return res.status(502).json({
      ok: false,
      error: payload.error || "mercy-tts returned no playable audio",
      provider: payload.provider,
      fallback_reason: payload.fallback_reason,
    });
  }

  res.setHeader("Content-Type", decoded.mime || "audio/mpeg");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-TTS-Provider", payload.provider || "unknown");
  if (payload.fallback_reason) res.setHeader("X-TTS-Fallback-Reason", payload.fallback_reason);
  return res.status(200).send(decoded.bytes);
}
